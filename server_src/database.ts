import Database from "better-sqlite3";
import { utcToLocal, localToUTC } from "./date.js";
import {
    databaseTable,
    prepareDataInsert,
} from "./database_table.js";

console.log("Starting database");
const db = new Database("./dist/data/power_data.db");
db.pragma("journal_mode = WAL");
db.exec(databaseTable);
console.log("Database loaded.");
const VA_RATING = process.env.VA_RATING || "1500";

export function getAll() {
    const query = "SELECT * FROM power_data ORDER BY id DESC";
    const data = db.prepare(query).all();
    return JSON.stringify(data)
}

export function getOldestRecord() {
    const query = "SELECT DATETIME FROM power_data ORDER BY id ASC LIMIT 1;";
    const data = db.prepare(query).all()[0];
    const s = JSON.stringify(data);
    return '{ "DATE": "' + utcToLocal( JSON.parse(s)["DATETIME"]) + '"}';
}

export function getLast() {
    const query = "SELECT * FROM power_data ORDER BY id DESC LIMIT 1;";
    const data = JSON.stringify(db.prepare(query).all()[0]);    
    let last = JSON.parse(data)
    last["DATETIME"] = utcToLocal( last["DATETIME"])
    return last;
}

export function getFirst() {
    const query = "SELECT * FROM power_data ORDER BY id ASC LIMIT 1;";
    const data = JSON.stringify(db.prepare(query).all()[0]);    
    let first = JSON.parse(data)
    first["DATETIME"] = utcToLocal( first["DATETIME"])
    return first;
}

function getAtResolution( data: any[], segments: number)
{
    const resolution = Math.ceil( data.length / segments);

    let cleanData: {}[] = [];
    let average = []
    let date = undefined    

    for (let i = 0; i <= segments * resolution; i += resolution) {
        for ( let j = 0; j < resolution; j++){
            if ( i+j < data.length ){
                const item = data[i + j];
                console.log( item)
                const load = item["LOADPCT"];
                const amperage = (parseInt(VA_RATING) * (parseInt(load)/100) )/120
                average.push( amperage );
            }
        }
        if ( i < data.length )
            date = new Date(data[i]["DATETIME"]);
        else
            date = new Date(data[data.length - 1]["DATETIME"])
        console.log( average.length)
        if (average.length != 0)
            cleanData.push({ time: utcToLocal(date.toISOString()), load: average.reduce((a, b) => a + b) / average.length });
        average = []
    }
    return cleanData
}

export function getLoadInRange(
    startDate: string,
    endDate: string
): number[] | unknown {
    const query =
        "SELECT ID, LOADPCT, DATETIME FROM power_data WHERE DATE( DATETIME ) BETWEEN '" +
        localToUTC(startDate.split("T")[0] + "T00:00:00.000Z") +
        "' AND '" +
        localToUTC(endDate.split("T")[0] + "T23:59:59.999Z" ) +
        "' ORDER BY id ASC";

    const data = db.prepare(query).all();
    const cleanData = getAtResolution( data, 100 )
    return cleanData;
}

export function getLoad(): number[] | unknown {
    const query = "SELECT LOADPCT, DATETIME FROM power_data ORDER BY id ASC;";
    const data = db.prepare(query).all();

    let cleanData: {}[] = [];
    data.forEach((item: JSON | unknown) => {
        const s = JSON.stringify(item);
        const load = JSON.parse(s)["LOADPCT"];
        const datetime = utcToLocal(JSON.parse(s)["DATETIME"]);
        cleanData.push({ minute: datetime, load: load });
    });
    return cleanData;
}

export function printLast() {
    console.log(getLast());
}

export function writeData(data: JSON) {
    const newData = db.prepare(prepareDataInsert);
    newData.run(data);
}
