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

export function getLoadInRange(
    startDate: string,
    endDate: string
): number[] | unknown {
    const query =
        "SELECT LOADPCT, DATETIME FROM power_data WHERE DATE( DATETIME ) BETWEEN '" +
        localToUTC(startDate.split("T")[0] + "T00:00:00.000Z") +
        "' AND '" +
        localToUTC(endDate.split("T")[0] + "T23:59:59.999Z" ) +
        "' ORDER BY id ASC;";

    const data = db.prepare(query).all();
    let cleanData: {}[] = [];
    data.forEach((item: JSON | unknown) => {
        const s = JSON.stringify(item);
        const load = JSON.parse(s)["LOADPCT"];
        const date = new Date(JSON.parse(s)["DATETIME"]);
        cleanData.push({ time: utcToLocal(date.toISOString()), load: load });
    });
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
