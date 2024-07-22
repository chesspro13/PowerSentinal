import * as React from "react";
import "./App.css";

function Header() {
    const [data, setData] = React.useState([]);

    function updateData() {
        fetch("/api/status").then((result) => {
            result.json().then((data) => {
                setData(data);
                console.log(data);
            });
        });
    }

    React.useEffect(() => {
        updateData();
        const interval = setInterval(() => {
            updateData();
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main>
            <h1>Main Content</h1>
            <div id="graph">
                {Object.keys(data).map((key) => (
                    <div className="json-item">
                        <h2>{key}</h2>
                        <p>{data[key]}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default Header;
