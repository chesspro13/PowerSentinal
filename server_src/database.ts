import Database from "better-sqlite3";
import {
    databaseTable,
    prepareDataInsert,
    preparedJson,
} from "./database_table.js";

console.log("Starting database");
const db = new Database("./dist/data/power_data.db");
db.pragma("journal_mode = WAL");
db.exec(databaseTable);
console.log("Database loaded.");

export function getAll() {
    const query = "SELECT * FROM power_data";
    const data = db.prepare(query).all();

    console.log(data);
}

export function getOldestRecord() {
    const query =
        "SELECT MONTH, DAY, YEAR FROM power_data ORDER BY id ASC LIMIT 1;";
    const data = db.prepare(query).all()[0];
    const s = JSON.stringify(data);
    const dataObject = JSON.parse(s);
    let date = dataObject.YEAR + "-";
    if (dataObject.MONTH < 10) date += "0" + dataObject.MONTH;
    else date += dataObject.MONTH;
    date += "-";
    if (dataObject.DAY < 10) date += "0" + dataObject.DAY;
    else date += dataObject.DAY;
    return '{ "DATE": "' + date + '"}';
}

export function getLast() {
    const query = "SELECT * FROM power_data ORDER BY id DESC LIMIT 1;";
    const data = db.prepare(query).all();
    return data[0];
}

export function getLoadInRange(
    startDate: string,
    endDate: string
): number[] | unknown {
    const query =
        "SELECT LOADPCT, DATETIME FROM power_data WHERE date( DATETIME ) BETWEEN " +
        startDate +
        " AND " +
        endDate +
        " ORDER BY id ASC;";

    console.log(
        "Getting load data from query ================================================================"
    );
    console.log(query);
    const data = db.prepare(query).all();
    let cleanData: {}[] = [];
    console.log("Data: " + JSON.stringify(data));
    data.forEach((item: JSON | unknown) => {
        const s = JSON.stringify(item);
        const load = JSON.parse(s)["LOADPCT"];

        const date = new Date(JSON.parse(s)["DATETIME"]);

        const time =
            date.getMonth() +
            "-" +
            date.getDate() +
            "-" +
            date.getFullYear() +
            ":" +
            date.getHours() +
            date.getMinutes();
        cleanData.push({ time: time, load: load });
    });
    console.log(cleanData);
    return cleanData;
}
export function getLoadOverTime(
    startDate: string,
    endDate: string
): number[] | unknown {
    console.log(
        "Getting load data================================================================"
    );
    const query = "SELECT LOADPCT, DATETIME FROM power_data ORDER BY id ASC;";
    const data = db.prepare(query).all();
    let cleanData: {}[] = [];
    data.forEach((item: JSON | unknown) => {
        const s = JSON.stringify(item);
        const load = JSON.parse(s)["LOADPCT"];

        const date = new Date(JSON.parse(s)["DATETIME"]);

        const time =
            date.getMonth() +
            "-" +
            date.getDate() +
            "-" +
            date.getFullYear() +
            ":" +
            date.getHours() +
            date.getMinutes();
        cleanData.push({ time: time, load: load });
    });
    console.log(cleanData);
    return cleanData;
}

export function getLoad(): number[] | unknown {
    console.log("Getting load data");
    const query = "SELECT LOADPCT, DATETIME FROM power_data ORDER BY id ASC;";
    const data = db.prepare(query).all();
    console.log(data);

    let cleanData: {}[] = [];
    data.forEach((item: JSON | unknown) => {
        const s = JSON.stringify(item);
        const load = JSON.parse(s)["LOADPCT"];
        const datetime = JSON.parse(s)["DATETIME"];
        cleanData.push({ minute: datetime, load: load });
    });
    console.log(cleanData);
    return cleanData;
}

export function printLast() {
    console.log(getLast());
}

export function writeData(data: JSON) {
    const newData = db.prepare(prepareDataInsert);
    newData.run(data);
}
