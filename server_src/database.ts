import Database from "better-sqlite3";
import {
    databaseTable,
    prepareDataInsert,
    preparedJson,
} from "./database_table.js";

console.log("Starting database");
const db = new Database("./data/power_data.db");
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

    return data;
}

export function printLast() {
    console.log(getLast());
}

export function writeData(data: JSON) {
    const newData = db.prepare(prepareDataInsert);
    newData.run(data);
}
