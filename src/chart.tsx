import { useState, useEffect } from "react";
import { LineChart, XAxis, Line, YAxis } from "recharts";
import useWindowDimensions from "./window_dimensions";
import DatePicker from "./datepicker";
import React from "react";

function Charts() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [ minValue, setMinValue ] = useState(Number)
    const [ maxValue, setMaxValue ] = useState(Number)
    const { height, width } = useWindowDimensions();

    useEffect(() => {
        if (startDate !== "" && endDate !== "") 
            fetch("/api/load/range/" + startDate + "/" + endDate).then((result) => {
                result.json().then((data) => {
                    setData(data);


                    let values = new Array()
                    let max = 0;
                    let min = 100;

                    data.map((element)=> {
                        const val = element["load"]
                        if ( val > max )
                            max = val
                        if ( val <  min )
                            min = val
                    })
                    
                    setMaxValue(max + 0.25)
                    setMinValue(min - 0.25)
                });
            });;
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
                <YAxis dataKey="load" domain={[minValue, maxValue]} />
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
