import { useState, useEffect, useCallback } from "react";
import { LineChart, XAxis, CartesianGrid, Line, YAxis } from "recharts";
import DatePicker from "./datepicker";

function Charts() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // function updateData() {
    //     fetch("/api/load/overtime").then((result) => {
    //         result.json().then((data) => {
    //             setData(data);
    //         });
    //     });
    // }
    function updateData() {
        console.log(startDate, endDate);
        fetch("/api/load/range/" + startDate + "/" + endDate).then((result) => {
            result.json().then((data) => {
                setData(data);
            });
        });
    }

    useEffect(() => {
        console.log("I got data: " + typeof data);
        console.log("I got data: " + JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        if (startDate != "" && endDate != "") updateData();
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
