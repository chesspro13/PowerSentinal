import express from "express";
import { preparedJson } from "./database_table.js";
import * as databaseOperations from "./database.js";
import { router as dataRouter } from "./routes/data.js";
import { router as statusRouter } from "./routes/status.js";
import { config } from "dotenv";
import { get_data } from "./data_collector.js";

// Environment Variables
config();
const PORT = process.env.PORT || 27415;
const defaultInterval = 60;
const interval =
    process.env.POWER_LOGGING_INTERVAL || defaultInterval.toString();

// Express
const app = express();
app.use(express.json());
app.use("/data", dataRouter);
app.use("/status", statusRouter);
app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
});

// Data collection loop
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
    if (process.env.MODE == "TESTING") databaseOperations.printLast();
}, (interval !== undefined ? parseInt(interval) : defaultInterval) * 1000);
