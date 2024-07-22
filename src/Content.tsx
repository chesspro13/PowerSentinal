import * as React from "react";
import "./App.css";

function Header() {
    const [allData, setAllData] = React.useState([]);

    React.useEffect(() => {
        fetch("/api/status").then((result) => {
            console.log(result);
        });
    });

    return (
        <main>
            <h1>Main Content</h1>
            <div id="graph"></div>
        </main>
    );
}

export default Header;
