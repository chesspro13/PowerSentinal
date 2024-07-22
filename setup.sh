#!/usr/bin/env bash

echo "WARNING! Script 'nodesetup.sh' MUST be ran before this script!"

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
        echo "Installing APCUPSD, NodeJS, and UFW"
        apt-get -y install apcupsd nodejs ufw
        echo "APCUPSD, NodeJS, and UFW installed."

        echo "Installing NPM packages"
        npm i 
        echo "NPM packages installed"
        
        mkdir "$PWD/data"
        echo "Created folder for database"

        read -p "Would you like build the service? [Y/n]: " answer
        answer="${answer:-Y}"
        if [[ $answer =~ [Yy] ]]; then    
            npm run build

            dir=$PWD
            subD=${dir//"/home/"/}
            user=${subD%%\/*}
            setupService "/home/$user/.nvm/versions/node/v$NODE_VERSION/bin/node  $PWD/dist/app.js"
        fi
        
        read -p "Would you like to allow port's $API_PORT and $WEB_PORT through ufw? [Y/n]: " answer
        answer="${answer:-Y}"
        if [[ $answer =~ [Yy] ]]; then
            ufw allow "$API_PORT/tcp"
            ufw allow "$WEB_PORT/tcp"
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
            \nEnvironment=WEB_PORT=$WEB_PORT
            \nEnvironment=API_PORT=$API_PORT
            \nEnvironment=IP_ADDRESS=$IP_ADDRESS
            \nEnvironment=MODE=$MODE
            \nEnvironment=WORKING_DIR=$PWD/dist
            \nWorkingDirectory=$PWD
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
            systemctl daemon-reload
            systemctl start powersentinal.service
        fi

        echo  $(systemctl status powersentinal.service)
    fi
}

startFromScratch() {
    read -p "Choose installation method: [server/s] | [client/c] " choice

    case $choice in
        server|S|s) serverPackages ;;
        client|C|c) setupService "$PWD/client_src/watcher.sh" ;;
        *) echo "Invalid option" ;;
    esac
}

case $1 in 
    server|S|s) serverPackages ;;
    client|C|c) setupService "$PWD/client_src/watcher.sh" ;;
    *) startFromScratch
esac