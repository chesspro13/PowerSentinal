#!/usr/bin/env bash

if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root"
    exit
fi


serverPackages()
{
    echo "The following packages are required for opperation: APCUPSD, NVM"
    read -p "Install missing packages? [Y/n]: " answer
    
    answer="${answer:-Y}"
    
    if [[ $answer =~ [Yy] ]]; then
        apt-get install apcupsd

        wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
        
        echo "Packages installed!"
    fi
}

clientSetup() {
    read -p "Would you like to setup a systemd service? [Y/n]: " answer
    answer="${answer:-Y}"
    if [[ $answer =~ [Yy] ]]; then        
        service="[Unit]
            \nDescription=Watch up status to gracefully shutdown in case of prolonged power outage.\n
            \n
            \n[Service]
            \nType=simple
            \n
            \nExecStart=$pwd/client_src/watcher.sh
            \nRestart=always
            \n
            \n[Install]
            \nWantedBy=multiuser.target"
        echo -e $service > /etc/systemd/system/upsied.service

        read -p "Would you like upsied.service to start on boot [Y/n]: " answer
        answer="${answer:-Y}"
        if [[ $answer =~ [Yy] ]]; then
            systemctl enable upsied.service
        fi

        read -p "Would you like to start upsied.service now? [Y/n]: " answer
        answer="${answer:-Y}"
        if [[ $answer =~ [Yy] ]]; then
            systemctl start upsied.service
        fi
    fi
}

read -p "Choose installation method: [server/s] | [client/c] " choice

case $choice in
    server|S|s) serverPackages ;;
    client|C|c) clientSetup ;;
    *) echo "Invalid option" ;;
esac