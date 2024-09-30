#!/usr/bin/env bash

echo "WARNING! Script 'nodesetup.sh' MUST be ran before this script!"

if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root"
    exit
fi

source .env

dir=$PWD
subD=${dir//"/home/"/}
user=${subD%%\/*}

express_install=false
server_install=false
client_install=false

serverPackages()
{
    ./uninstall.sh

    echo "The following packages are required for opperation: APCUPSD, NVM"

    choice=$(getUserinput "Begin the installation of dependencies?")
    if [[ $choice =~ [Yy] ]]; then
        echo "Installing APCUPSD, NodeJS, and UFW"
        apt-get -y install apcupsd nodejs ufw
        echo "APCUPSD, NodeJS, and UFW installed."

        echo "Installing NPM packages"
        npm i 
        echo "NPM packages installed"
        
        mkdir "$PWD/dist/data"
        echo "Created folder for database"

        choice=$(getUserinput "Would you like to build the service?")
        if [[ $choice =~ [Yy] ]]; then    
            npm run build

            setupService "/home/$user/.nvm/versions/node/v$NODE_VERSION/bin/node  $PWD/dist/app.js"
        fi
        
        choice=$(getUserinput "Would you like to allow port's $API_PORT and $WEB_PORT through ufw?")
        if [[ $choice =~ [Yy] ]]; then
            ufw allow "$API_PORT/tcp"
            ufw allow "$WEB_PORT/tcp"
        fi
    fi

    chown -R $user:$user "../${PWD##*/}"
}

setupService() {
    choice=$(getUserinput "Would you like to setup a systemd service?")
    if [[ $choice =~ [Yy] ]]; then        
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

        choice=$(getUserinput "Would you like to start powersentinal.service to start on boot?")
        if [[ $choice =~ [Yy] ]]; then
            systemctl enable powersentinal.service
        fi

        choice=$(getUserinput "Would you like to start powersentinal.service now?")
        if [[ $choice =~ [Yy] ]]; then
            systemctl daemon-reload
            systemctl start powersentinal.service
        fi

        echo  $(systemctl status powersentinal.service)
    fi
}

getUserinput() {
    if [[ $express_install == true ]] ; then
        answer="y"
    else
        read -p "$1 [Y/n]: " answer
        answer="${answer:-Y}"
    fi 
    echo $answer
}

startFromScratch() {
    read -p "Choose installation method: [server/s] | [client/c] " choice

    case $choice in
        server|S|s) serverPackages ;;
        client|C|c) setupService "$PWD/watcher.sh" ;;
        *) echo "Invalid option" ;;
    esac
}

while test $# != 0
do
    case $1 in
        -y|-Y) express_install=true ;;
        -s|-S) server_install=true ;;
        -c|-C) client_install=true ;;
    esac
    shift
done

if [[ $server_install == true &&  $client_install == true ]] ; then
    echo "Cannot use both -S (Server) and -C (Client) on the same system!"
    exit 1
elif [[ $server_install == false &&  $client_install == false ]] ; then
    startFromScratch
elif [[ $server_install == true &&  $client_install == false ]] ; then 
    serverPackages
elif [[ $server_install == false &&  $client_install == true ]] ; then 
    setupService "$PWD/client_src/watcher.sh"
fi

