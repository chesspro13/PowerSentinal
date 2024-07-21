import { Request, Response } from "express";
import * as child from "child_process";
import Database from "better-sqlite3";
import express from "express";
import {
    databaseTable,
    prepareDataInsert,
    preparedJson,
} from "./database_table.js";
import * as databaseOperations from "./database.js";
import { router as dataRouter } from "./routes/data.js";
import { config } from "dotenv";

const app = express();
app.use(express.json());
app.use("/data", dataRouter);

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

setInterval(() => {
    get_data((a: string) => {
        let prep = preparedJson;
        let data = JSON.parse(a);
        Object.keys(data).forEach((key: string) => {
            prep = prep.replace(
                key + '": null',
                key + '": "' + data[key] + '"'
            );
        });
        databaseOperations.writeData(JSON.parse(prep));
    });
    if (process.env.MODE == "TESTING") databaseOperations.getLast();
}, (interval !== undefined ? parseInt(interval) : defaultInterval) * 1000);
