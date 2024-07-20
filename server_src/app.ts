import { Request, Response } from "express";
import * as child from "child_process";
import Database from "better-sqlite3";
import express from "express";
// import {
//     databaseTable,
//     prepareDataInsert,
//     preparedJson,
// } from "./database_table";
import { config } from "dotenv";

export const databaseTable = `
    CREATE TABLE IF NOT EXISTS power_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ACTIVE BOOLEAN,
    APC STRING,
    DATE STRING,
    HOSTNAME STRING,
    VERSION STRING,
    UPSNAME STRING,
    CABLE STRING,
    DRIVER STRING,
    UPSMODE STRING,
    STARTTIME STRING,
    MODEL STRING,
    STATUS STRING,
    LINEV FLOAT,
    LOADPCT FLOAT,
    BCHARGE FLOAT,
    TIMELEFT FLOAT,
    MBATTCHG INTEGER,
    MINTIMEL INTEGER,
    MAXTIME INTEGER,
    SENSE STRING,
    LOTRANS FLOAT,
    HITRANS FLOAT,
    ALARMDEL STRING,
    BATTV FLOAT,
    LASTXFER STRING,
    NUMXFERS INTEGER,
    TONBATT INTEGER,
    CUMONBATT INTEGER,
    XOFFBATT STRING,
    SELFTEST STRING,
    STATFLAG STRING,
    SERIALNO STRING,
    BATTDATE STRING,
    NOMINV FLOAT,
    NOMBATTV FLOAT,
    NOMPOWER INTEGER,
    FIRMWARE STRING,
    END_APC STRING
    )
`;

export const preparedJson = `{
    "ACTIVE": null,
    "APC": null,
    "DATE": null,
    "HOSTNAME": null,
    "VERSION": null,
    "UPSNAME": null,
    "CABLE": null,
    "DRIVER": null,
    "UPSMODE": null,
    "STARTTIME": null,
    "MODEL": null,
    "STATUS": null,
    "LINEV": null,
    "LOADPCT": null,
    "BCHARGE": null,
    "TIMELEFT": null,
    "MBATTCHG": null,
    "MINTIMEL": null,
    "MAXTIME": null,
    "SENSE": null,
    "LOTRANS": null,
    "HITRANS": null,
    "ALARMDEL": null,
    "BATTV": null,
    "LASTXFER": null,
    "NUMXFERS": null,
    "TONBATT": null,
    "CUMONBATT": null,
    "XOFFBATT": null,
    "SELFTEST": null,
    "STATFLAG": null,
    "SERIALNO": null,
    "BATTDATE": null,
    "NOMINV": null,
    "NOMBATTV": null,
    "NOMPOWER": null,
    "FIRMWARE": null,
    "END_APC": null
}`;

export const prepareDataInsert = `
    INSERT INTO power_data VALUES(
    NULL,
    :ACTIVE,
    :APC,
    :DATE,
    :HOSTNAME,
    :VERSION,
    :UPSNAME,
    :CABLE,
    :DRIVER,
    :UPSMODE,
    :STARTTIME,
    :MODEL,
    :STATUS,
    :LINEV,
    :LOADPCT,
    :BCHARGE,
    :TIMELEFT,
    :MBATTCHG,
    :MINTIMEL,
    :MAXTIME,
    :SENSE,
    :LOTRANS,
    :HITRANS,
    :ALARMDEL,
    :BATTV,
    :LASTXFER,
    :NUMXFERS,
    :TONBATT,
    :CUMONBATT,
    :XOFFBATT,
    :SELFTEST,
    :STATFLAG,
    :SERIALNO,
    :BATTDATE,
    :NOMINV,
    :NOMBATTV,
    :NOMPOWER,
    :FIRMWARE,
    :END_APC
    )
`;

const app = express();
app.use(express.json());

config();
const PORT = process.env.PORT || 27415;
const defaultInterval = 60;
const interval =
    process.env.POWER_LOGGING_INTERVAL || defaultInterval.toString();

app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
});

app.get("/status", (request: Request, response: Response) => {
    get_data((output: string) => {
        response.send(output);
    });
});

function get_data(fctn: CallableFunction) {
    child.exec(
        "apcaccess",
        (
            error: child.ExecException | null,
            stdout: string | Buffer,
            stderr: string | Buffer
        ) => {
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }

            var jsonOutput = '"ACTIVE":"TRUE"';
            let q = { Status: "Running" };
            stdout
                .toString()
                .split("\n")
                .forEach((item) => {
                    if (item !== "") {
                        const formattedItem = item.replace(/\s+/g, " ").trim();
                        let keyVal = formattedItem.split(":");
                        jsonOutput +=
                            ',"' +
                            keyVal[0].trim().replace(" ", "_") +
                            '":"' +
                            keyVal[1].trim() +
                            '"';
                    }
                });
            fctn("{" + jsonOutput + "}");
        }
    );
}

console.log("Starting database");
const db = new Database("data/power_data.db");
db.pragma("journal_mode = WAL");
db.exec(databaseTable);
console.log("Database loaded.");

function getAll() {
    const query = "SELECT * FROM power_data";
    const data = db.prepare(query).all();

    console.log(data);
}

function getLast() {
    const query = "SELECT * FROM power_data ORDER BY id DESC LIMIT 1;";
    const data = db.prepare(query).all();

    console.log(data);
}

setInterval(() => {
    console.log("Fired");
    const newData = db.prepare(prepareDataInsert);
    get_data((a: string) => {
        let prep = preparedJson;
        let data = JSON.parse(a);
        Object.keys(data).forEach((key: string) => {
            prep = prep.replace(
                key + '": null',
                key + '": "' + data[key] + '"'
            );
        });
        newData.run(JSON.parse(prep));
        // db.close();
    });
    if ( process.env.MODE == "TESTING")
        getLast()
}, (interval !== undefined ? parseInt(interval) : defaultInterval) * 1000);
