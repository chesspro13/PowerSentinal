import { useState, useEffect } from "react";
import { LineChart, XAxis, Line, YAxis } from "recharts";
import useWindowDimensions from "./window_dimensions";
import React from "react";
import GraphControls from "./graph_controls";

function Charts() {
  const [metadata, setMetadata] = useState({});
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [averageGraphActive, setAverageGraphActive] = useState(true);
  const [minGraphActive, setMinGraphActive] = useState(false);
  const [maxGraphActive, setMaxGraphActive] = useState(false);
  const [minValue, setMinValue] = useState(Number);
  const [maxValue, setMaxValue] = useState(Number);
  const [resolution, setResolution] = useState(100);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (startDate !== "" && endDate !== "")
      fetch(
        "/api/load/range/" +
          startDate +
          "/" +
          endDate +
          "/resolution/" +
          resolution
      ).then((result) => {
        result.json().then((data) => {
          setData(data["DATA"]);
          setMetadata(data["METADATA"]);

          let values = new Array();
          let max = 0;
          let min = 100;

          data["DATA"].map((element) => {
            const minElement = element["min"];
            const maxElement = element["max"];
            if (maxElement > max) max = maxElement;
            if (minElement < min) min = minElement;
          });

          setMaxValue(max + 0.25);
          setMinValue(min - 0.25);
        });
      });
  }, [startDate, endDate, resolution]);

  return (
    <div>
      <GraphControls
        metadata={metadata}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setResolution={setResolution}
        setAverageGraphActive={setAverageGraphActive}
        setMinGraphActive={setMinGraphActive}
        setMaxGraphActive={setMaxGraphActive}
        avgGraphActive={averageGraphActive}
        minGraphActive={minGraphActive}
        maxGraphActive={maxGraphActive}
      />
      <LineChart
        width={width * 0.75}
        height={height * 0.75}
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="time" />
        <YAxis dataKey="load" domain={[minValue, maxValue]} />
        {averageGraphActive ? (
          <Line
            type="monotone"
            dataKey="load"
            isAnimationActive={false}
            stroke="#fff"
          />
        ) : null}
        {minGraphActive ? (
          <Line
            type="monotone"
            dataKey="min"
            isAnimationActive={false}
            stroke="#FF00FF"
          />
        ) : null}
        {maxGraphActive ? (
          <Line
            type="monotone"
            dataKey="max"
            isAnimationActive={false}
            stroke="#00FFFF"
          />
        ) : null}
      </LineChart>
    </div>
  );
}

export default Charts;
