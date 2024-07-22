import "./App.css";
import Aside from "./Aside";
import Header from "./Header";
import Content from "./Content";
import D3 from "./D3";
import * as React from "react";
import * as d3 from "d3";

function App() {
    const [data, setData] = React.useState([]);

    function updateData() {
        fetch("/api/load").then((result) => {
            result.json().then((data) => {
                // console.log(data);
                setData(data);
                console.log(d3.extent(data));
            });
        });
    }
    React.useEffect(() => {
        updateData();
    }, []);

    return (
        <div className="App">
            <Header />
            <div className="container">
                <Aside />
                {/* <Content /> */}
                <D3 data={data} />
            </div>
        </div>
    );
}

export default App;
