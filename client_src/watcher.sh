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
        
        echo "[$level]"
        if (( level < 80 )); then
            echo "Shutting down!"
            # shutdown now
        else
            echo "On battery! $level%"
        fi

        sleep 30
    else
        echo "Status: Normal"
        sleep 60
    fi
done