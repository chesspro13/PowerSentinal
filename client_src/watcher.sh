#!/bin/bash
source ../.env

while true 
do
    status=$(curl "http://$IP_ADDRESS:$PORT/status" | jq .STATUS)
    battLevel=$(curl "http://$IP_ADDRESS:$PORT/status" | jq .BCHARGE)
    battQuote=${battLevel// Percent/}
    percentage=${battQuote//\"/}
    level=${percentage%.*}

    if [[ status == "ONBATT" ]]; then
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
    else
        echo "Status: Normal"
        sleep 60
    fi
done