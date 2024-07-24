import { useState, useEffect, useCallback } from "react";
import { LineChart, XAxis, CartesianGrid, Line, YAxis } from "recharts";
import useWindowDimensions from "./window_dimensions";
import DatePicker from "./datepicker";
import React from "react";
import { contourDensity } from "d3";

function Charts() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { height, width } = useWindowDimensions();

    function updateData() {
        fetch("/api/load/range/" + startDate + "/" + endDate).then((result) => {
            result.json().then((data) => {
                setData(data);
            });
        });
    }

    useEffect(() => {
        if (startDate != "" && endDate != "") updateData();
    }, [startDate, endDate]);

    return (
        <div>
            <div style={{ display: "flex" }}>
                <DatePicker
                    range="early"
                    setDate={setStartDate}
                    description="Starting date "
                />
                <DatePicker
                    range="late"
                    setDate={setEndDate}
                    description="Ending date "
                />
            </div>
            <LineChart
                width={width * 0.75}
                height={height * 0.75}
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
