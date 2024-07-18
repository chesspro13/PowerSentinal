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
    const status = {"status": "Running"}

    const powerMonitor = exec('ls' ,
    (error: string, stdout: string, stderr: string) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });

    response.send(status)
})

