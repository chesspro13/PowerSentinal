import DatePicker from "./datepicker";
import React from "react";
import "./graph_controls.css";

interface props {
  metadata: {};

  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;

  setResolution: (resolution: number) => void;

  setAverageGraphActive: (toggle: boolean) => void;
  setMinGraphActive: (toggle: boolean) => void;
  setMaxGraphActive: (toggle: boolean) => void;

  avgGraphActive: boolean;
  minGraphActive: boolean;
  maxGraphActive: boolean;
}

function GraphControls(props: props) {
  return (
    <div className="control-bar">
      <div className="date-pickers" style={{ display: "flex" }}>
        <DatePicker
          range="early"
          setDate={props.setStartDate}
          description="Starting date  "
        />
        <DatePicker
          range="late"
          setDate={props.setEndDate}
          description="Ending date   "
        />
      </div>
      <div className="lines">
        <div className="line-toggles">
          <label>
            Max Graph Line
            <input
              type="checkbox"
              id="max-active"
              name="max-active"
              checked={props.maxGraphActive}
              onChange={(event) =>
                props.setMaxGraphActive(event.target.checked)
              }
            />
          </label>
        </div>
        <div className="line-toggles">
          <label>
            Avg Graph Line
            <input
              type="checkbox"
              id="avg-active"
              name="avg-active"
              checked={props.avgGraphActive}
              onChange={(event) =>
                props.setAverageGraphActive(event.target.checked)
              }
            />
          </label>
        </div>
        <div className="line-toggles">
          <label>
            Min Graph Line
            <input
              type="checkbox"
              id="min-active"
              name="min-active"
              checked={props.minGraphActive}
              onChange={(event) =>
                props.setMinGraphActive(event.target.checked)
              }
            />
          </label>
        </div>
      </div>
      <div className="resolution-slider">
        <table>
          <tbody>
            <tr>
              <td colSpan={3}>
                <label>
                  Graph Resolution
                  <input
                    className="slider"
                    type="range"
                    id="volume"
                    name="volume"
                    min="1"
                    max="200"
                    defaultValue={props.metadata["RESOLUTION"]}
                    onChange={(event) =>
                      props.setResolution(parseInt(event.target.value))
                    }
                    style={{ width: "500px" }}
                  />
                </label>
              </td>
            </tr>
            <tr>
              <td className="metadata-data">
                <p>Data collected</p>
                <p>{props.metadata["DATAPOINT_COUNT"]} points of data</p>
              </td>
              <td className="metadata-data">
                <p>Readings per Datapoint</p>
                <p>{props.metadata["RESOLUTION"]} readings</p>
              </td>
              <td className="metadata-data">
                <p>Datapoints graphed</p>
                <p>{props.metadata["SEGMENTS"]}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default GraphControls;
