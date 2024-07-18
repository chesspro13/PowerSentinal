#!/bin/bash

while true 
do
    battLevel=$(curl ***REMOVED***:27415/status | jq .BCHARGE)
    battQuote=${battLevel// Percent/}
    percentage=${battQuote//\"/}
    level=${percentage%.*}
    
    echo "[$level]"
    if (( level > 80 )); then
        echo "Shutting down!"
        shutdown now
    else
        echo "Battery level $level%"
    fi

    sleep 5
done