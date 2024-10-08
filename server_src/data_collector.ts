import * as child from "child_process";

export function get_data(fctn: CallableFunction) {
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
            const dateObj = new Date();

            var jsonOutput = '"YEAR":"' + dateObj.getUTCFullYear() +
                '","MONTH":"' + dateObj.getUTCMonth()  +
                '","DAY":"' + dateObj.getUTCDate() +
                '","HOUR":"' + dateObj.getUTCHours() +
                '","MINUTE":"' + dateObj.getUTCMinutes() +
                '","SECOND":"' + dateObj.getUTCSeconds() + '"'

            var jsonOutput = '"DATETIME":"' + new Date().toISOString() + '"';
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
                            keyVal[0].trim()
                            .replace(" ", "_") +
                            '":"' +
                            keyVal[1]
                            .replace(" Percent","")
                            .trim() +
                            '"';
                    }
                });
            fctn("{" + jsonOutput + "}");
        }
    );
}
