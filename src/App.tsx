import "./App.css";
import Aside from "./Aside";
import Header from "./Header";
import * as React from "react";
import Charts from "./chartjs";

function App() {

    return (
        <div className="App">
            <Header />
            <div className="container">
                <Aside />
                <Charts />
            </div>
        </div>
    );
}

export default App;
