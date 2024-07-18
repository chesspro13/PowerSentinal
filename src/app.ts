import { Request, request, Response, response } from "express";
const {exec} = require("child_process")

const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 27415;

app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT)
})

app.get("/status", (request: Request, response: Response) => {
    const powerMonitor :string= exec('apcaccess' ,
    (error: string, stdout: string, stderr: string) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }

        var jsonOutput = '"STATUS":"Active"';
        let q = {"Status": "Running"};
        stdout.split("\n").forEach((item) => {
            if ( item !== '' ){
                const formattedItem = item.replace(/\s+/g, " ").trim();
                let keyVal = formattedItem.split(":");
                jsonOutput += ',"' + keyVal[0].trim() + '":"' + keyVal[1].trim() + '"';
            }
        });
        response.send("{" + jsonOutput + "}");

    });
})

