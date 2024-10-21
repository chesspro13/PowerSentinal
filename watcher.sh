#!/bin/bash
source .env

while true 
do
    echo "Pinging server at http://$IP_ADDRESS:$API_PORT/api/status"
    echo $(curl "http://$IP_ADDRESS:$API_PORT/api/status")
    
    statusWquotes=$(curl "http://$IP_ADDRESS:$API_PORT/api/status" | jq .STATUS)
    status=${statusWquotes//\"/}
    battLevel=$(curl "http://$IP_ADDRESS:$API_PORT/api/status" | jq .BCHARGE)
    battQuote=${battLevel// Percent/}
    percentage=${battQuote//\"/}
    level=${percentage%.*}

    echo "Status: [$status]"
    echo "Battery: [$level]"

    if [ "$status" = "ONBATT" ]
    then
        if (( level < 80 )); then
            if [[ $MODE == "TESTING" ]]; then 
                echo "Simulating shutdown event!"
            elif [[ $MODE == "PRODUCTION" ]]; then
                # TODO: Add external shutdown scripts for fine tuned control
                if [[ $CEPH_ROLE == "MANAGER" ]]; then
                    ceph osd set noout
                    ceph osd set nobackfill
                    ceph osd set norecover
                    ceph osd set norebalance
                    ceph osd set nodown
                    ceph osd set pause

                    echo "Shutting down!"
                    shutdown now
                elif [[ $CEPH_ROLE == "NODE" ]]; then
                    echo "Shutting down!"
                    shutdown +1
                else
                    echo "Shutting down!"
                    shutdown now
                fi
            else 
                echo "OPERATION MODE NOT CONFIGURED CORRECTLY"
            fi
        else
            echo "On battery! $level%"
        fi

        sleep 30
    elif [ "$status" = "ONLINE" ]
    then
        echo "Status: Normal"
        echo "Charge: $level%" 
        sleep 60
    else 
        echo "Status: Inactive"
        sleep 5
    fi
done