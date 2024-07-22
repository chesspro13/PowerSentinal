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

export function getLast() {
    const query = "SELECT * FROM power_data ORDER BY id DESC LIMIT 1;";
    const data = db.prepare(query).all();
    return data[0];
}

export function getLoad(): number[] | unknown {
    const query = "SELECT LOADPCT FROM power_data ORDER BY id DESC;";
    const data = db.prepare(query).all();
    console.log(typeof data[0]);

    if (typeof data[0] == "object") console.log();
    let cleanData: number[] = [];
    data.forEach((item: string | unknown) => {
        const s = JSON.stringify(data[0]);
        const l = JSON.parse(s)["LOADPCT"];
        if (l != "null") {
            const j = l.split(" ")[0];

            cleanData.push(parseFloat(j));
        }
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
