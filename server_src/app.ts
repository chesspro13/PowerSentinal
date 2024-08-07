import express from "express";
import { preparedJson } from "./database_table.js";
import * as databaseOperations from "./database.js";
import { router as apiRouter } from "./api.js";
import { config } from "dotenv";
import { get_data } from "./data_collector.js";

// Environment Variables
config();
const API_PORT = process.env.API_PORT || 27415;
const WEB_PORT = process.env.WEB_PORT || 8080;
const defaultInterval = 60;
const interval =
    process.env.POWER_LOGGING_INTERVAL || defaultInterval.toString();

// WEB INTERFACE
const web = express();
web.use(express.json());
web.use("/", express.static("./dist/build"));
web.use("/api", apiRouter);
web.listen(WEB_PORT, () => {
    console.log("WEB server listening on port: ", WEB_PORT);
});

// API
const api = express();
api.use(express.json());
api.use("/api", apiRouter);
api.listen(API_PORT, () => {
    console.log("API server listening on port: ", API_PORT);
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
        if (process.env.MODE == "PRODUCTION")
            databaseOperations.writeData(JSON.parse(prep));
    });
    if (process.env.MODE == "TESTING") databaseOperations.printLast();
}, (interval !== undefined ? parseInt(interval) : defaultInterval) * 1000);
