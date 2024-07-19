import { Request, Response } from "express";
import * as child from "child_process";
import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 27415;

app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
});

app.get("/status", (request: Request, response: Response) => {
    const powerMonitor = child.exec(
        "apcaccess",
        (
            error: child.ExecException | null,
            stdout: string | Buffer,
            stderr: string | Buffer
        ) => {
            console.log(stdout);
            console.log(stderr);
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
                            keyVal[0].trim() +
                            '":"' +
                            keyVal[1].trim() +
                            '"';
                    }
                });
            response.send("{" + jsonOutput + "}");
        }
    );
});
