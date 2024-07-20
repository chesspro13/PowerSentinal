#!/usr/bin/env bash

if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root"
    exit
fi

systemctl stop powersentinal.service > /dev/null 2>&1
echo "PowerSentinal service stopped"
systemctl disable powersentinal.service > /dev/null 2>&1
echo "PowerSentinal service disabled"
rm /etc/systemd/system/powersentinal.service > /dev/null 2>&1
echo "PowerSentinal service removed"