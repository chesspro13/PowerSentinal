import { useState, useEffect } from "react";
import "./datepicker.css";
import React from "react";

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
        let maxDate = today.getFullYear() + "-";
        if (today.getMonth() < 10)
            maxDate += "0" + (today.getMonth() + 1);
        else maxDate += today.getMonth() + 1;
        maxDate += "-";
        if (today.getDate() < 10) maxDate += "0" + today.getDate();
        else maxDate += today.getDate();
        maxDate += "T23:59:59.999Z";
        setLatestDate(maxDate);
    }

    useEffect(() => {
        getEarliestDate();
        getLatestDate();
    }, []);

    useEffect(() => {
        if (props.range === "early") {
            if (earliestDate !== "" && date !== earliestDate) {
                setDate((earliestDate).split("T")[0]);
                props.setDate((earliestDate).split("T")[0]);
            }
        } else if (props.range === "late") {
            if (latestDate !== "" && date !== latestDate) {
                setDate((latestDate).split("T")[0]);
                props.setDate((latestDate).split("T")[0]);
            }
        }
    }, [earliestDate, latestDate]);

    return (
        <div style={{ display: "flex" }}>
            <label>{props.description}</label>
            <input
                type="date"
                value={date}
                min={earliestDate}
                max={latestDate}
                onChange={(newValue) => {
                    setDate(newValue.target.value);
                    props.setDate(newValue.target.value);
                }}
            />
        </div>
    );
}

export default DatePicker;
