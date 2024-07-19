#!/bin/bash
source ../.env

while true 
do
    echo "http://$IP_ADDRESS:$PORT/status"
    statusWquotes=$(curl "http://$IP_ADDRESS:$PORT/status" | jq .STATUS)
    status=${statusWquotes//\"/}
    battLevel=$(curl "http://$IP_ADDRESS:$PORT/status" | jq .BCHARGE)
    battQuote=${battLevel// Percent/}
    percentage=${battQuote//\"/}
    level=${percentage%.*}

    echo "$status"

    if [ $status == "ONBATT" ] 
    then
        if (( level < 80 )); then
            if [[ $MODE == "TESTING" ]]; then 
                echo "Simulating shutdown event!"
            elif [[ $MODE == "PRODUCTION" ]]; then
                # TODO: Add external shutdown scripts for fine tuned control
                echo "Shutting down!"
                shutdown now
            else 
                echo "OPERATION MODE NOT CONFIGURED CORRECTLY"
            fi
        else
            echo "On battery! $level%"
        fi

        sleep 30
    elif [ $status == "ONLINE" ] 
    then
        echo "Status: Normal"
        echo "Charge: $level%" 
        sleep 60
    else 
        echo "Status: Inactive"
        sleep 60
    fi
done