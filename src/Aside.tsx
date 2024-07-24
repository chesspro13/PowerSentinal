import React, { useState, useEffect } from "react";
import "./App.css";

function Aside() {
    const [ liveData, setLiveData ] = useState({})

    function getLiveData() {
        fetch("/api/load/last").then((result) => {
            result.json().then((data) => {
                console.log( data )
                setLiveData(data);
            });
        });
    }


    useEffect(() => {
        getLiveData();
        const interval = setInterval(() => {
            getLiveData();
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <aside>
            <h1>Live Data</h1>
            <ul>
                    {Object.keys(liveData).map((key) => (
                            <li><b>{key}</b>: {liveData[key]}</li>
                    ))}
            </ul>
        </aside>
    );
}

export default Aside;
