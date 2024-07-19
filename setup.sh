#!/usr/bin/env bash

if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root"
    exit
fi

source .env

serverPackages()
{
    echo "The following packages are required for opperation: APCUPSD, NVM"
    read -p "Begin the installation of dependencies? [Y/n]: " answer
    
    answer="${answer:-Y}"
    
    if [[ $answer =~ [Yy] ]]; then
        echo "Installing APCUPSD and NodeJS"
        apt-get -y install apcupsd nodejs
        echo "APCUPSD and NodeJS installed."

        
        read -p "Would you like build the service? [Y/n]: " answer
        answer="${answer:-Y}"
        if [[ $answer =~ [Yy] ]]; then    
            npm run build

            setupService "/usr/bin/nodejs $PWD/dist/app.js"
        fi
    fi
}

setupService() {
    read -p "Would you like to setup a systemd service? [Y/n]: " answer
    answer="${answer:-Y}"
    if [[ $answer =~ [Yy] ]]; then        
        service="[Unit]
            \nDescription=Watch up status to gracefully shutdown in case of prolonged power outage.
            \nAfter=network.target\n
            \n
            \n[Service]
            \nEnvironment=PORT=$PORT
            \nEnvironment=IP_ADDRESS=$IP_ADDRESS
            \nEnvironment=MODE=$MODE
            \nType=simple
            \nExecStart=$1
            \nRestart=always
            \n
            \n[Install]
            \nWantedBy=multiuser.target\n
            \n"
        echo -e $service > /etc/systemd/system/powersentinal.service

        read -p "Would you like powersentinal.service to start on boot [Y/n]: " answer
        answer="${answer:-Y}"
        if [[ $answer =~ [Yy] ]]; then
            systemctl enable powersentinal.service
        fi

        read -p "Would you like to start powersentinal.service now? [Y/n]: " answer
        answer="${answer:-Y}"
        if [[ $answer =~ [Yy] ]]; then
            systemctl start powersentinal.service
        fi

        echo  $(systemctl status powersentinal.service)
    fi
}

read -p "Choose installation method: [server/s] | [client/c] " choice

case $choice in
    server|S|s) serverPackages ;;
    client|C|c) setupService "$PWD/client_src/watcher.sh" ;;
    *) echo "Invalid option" ;;
esac