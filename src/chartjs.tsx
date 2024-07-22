import React from "react";
import { LineChart, XAxis, CartesianGrid, Line, YAxis } from "recharts";
import DatePicker from './datepicker'


function Charts() {
    const [data, setData] = React.useState([]);

    function updateData() {
        fetch("/api/load").then((result) => {
            result.json().then((data) => {
                console.log(data[0]);
                setData(data);
            });
        });
    }

    React.useEffect(() => {
        updateData();
    }, []);
       
    return (
        <div>
            <DatePicker />
            <DatePicker />
            <LineChart width={600} height={400} data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis dataKey="time" />
                <YAxis dataKey="load" />
                <Line type="monotone" dataKey="load" isAnimationActive={false} stroke="#fff" />
            </LineChart>
        </div>
    );
}

export default Charts;
