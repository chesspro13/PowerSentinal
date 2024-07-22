import React from "react";
import "./datepicker.css"


function DatePicker() {
    const [earliestDate, setEarliestDate] = React.useState(String);
    const [startDate, setStartDate] = React.useState(String);
    const [endDate, setEndDate] = React.useState(String);
    const maxDate = getMaxDay()

    function getStartDate() {
        fetch("/api/date/oldest").then((result) => {
            result.json().then((data) => {
                console.log("Oldest date");
                console.log(data);
                setEarliestDate(data["DATE"]);
                setStartDate(data["DATE"]);
            });
        });
    }

    function getMaxDay()
    {
        const today = new Date();
        let maxDate = today.getUTCFullYear() + "-" 
        if (today.getUTCMonth() < 10)
            maxDate += "0" + today.getUTCMonth()
        else
            maxDate += today.getUTCMonth()
        maxDate += "-"
        if (today.getUTCDay() < 10)
            maxDate += "0" + today.getUTCDay()
        else
            maxDate += today.getUTCDay()
        return maxDate
    }

    React.useEffect(() => {
        getStartDate();
    }, []);
       
    return (
        <div>
            <p>Date Range:</p><input type="date" value={earliestDate} min={earliestDate} max={maxDate} name="ksdjf" id="KDFLJ" /><p>Resolution:</p>
        </div>
    );
}

export default DatePicker;
