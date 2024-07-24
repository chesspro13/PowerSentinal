import { useState, useEffect } from "react";
import { LineChart, XAxis, Line, YAxis } from "recharts";
import DatePicker from "./datepicker";
import React from "react";

function Charts() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    useEffect(() => {
        if (startDate !== "" && endDate !== "") 
            fetch("/api/load/range/" + startDate + "/" + endDate).then((result) => {
                result.json().then((data) => {
                    setData(data);
                });
            });;
    }, [startDate, endDate]);

    return (
        <div>
            <div style={{ display: "flex" }}>
                <DatePicker
                    range="early"
                    setDate={setStartDate}
                    description="Start range "
                />
                <DatePicker
                    range="late"
                    setDate={setEndDate}
                    description="End range "
                />
            </div>
            <LineChart
                width={600}
                height={400}
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <XAxis dataKey="time" />
                <YAxis dataKey="load" domain={[30, 60]} />
                <Line
                    type="monotone"
                    dataKey="load"
                    isAnimationActive={false}
                    stroke="#fff"
                />
            </LineChart>
        </div>
    );
}

export default Charts;
