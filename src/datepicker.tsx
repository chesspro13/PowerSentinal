import { useState, useEffect } from "react";
import "./datepicker.css";

interface props {
    description: string;
    range: string;
    setDate: (a: string) => void;
}

function DatePicker(props: props) {
    const [earliestDate, setEarliestDate] = useState(String);
    const [date, setDate] = useState(String);
    const [latestDate, setLatestDate] = useState(String);

    function getEarliestDate() {
        fetch("/api/date/oldest").then((result) => {
            result.json().then((data) => {
                setEarliestDate(data["DATE"]);
            });
        });
    }

    function getLatestDate() {
        const today = new Date();
        let maxDate = today.getUTCFullYear() + "-";
        if (today.getUTCMonth() < 10)
            maxDate += "0" + (today.getUTCMonth() + 1);
        else maxDate += today.getUTCMonth() + 1;
        maxDate += "-";
        if (today.getUTCDate() < 10) maxDate += "0" + today.getUTCDate();
        else maxDate += today.getUTCDate();
        setLatestDate(maxDate);
    }

    useEffect(() => {
        getEarliestDate();
        getLatestDate();
    }, []);

    useEffect(() => {
        if (props.range == "early") {
            if (earliestDate != "" && date != earliestDate) {
                setDate(earliestDate);
                props.setDate(earliestDate);
            }
        } else if (props.range == "late") {
            if (latestDate != "" && date != latestDate) {
                setDate(latestDate);
                props.setDate(latestDate);
            }
        }
    }, [earliestDate, latestDate]);

    return (
        <div style={{ display: "flex" }}>
            <label>{props.description}</label>
            <input
                type="date"
                value={date}
                // min={earliestDate}
                // max={maxDate}
                onChange={(newValue) => {
                    console.log("Changed: " + newValue.target.value);
                    setDate(newValue.target.value);
                    props.setDate(newValue.target.value);
                }}
                name="ksdjf"
                id="KDFLJ"
            />
        </div>
    );
}

export default DatePicker;
