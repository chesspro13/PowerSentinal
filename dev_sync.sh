#!/usr/bin/env bash

source .env

mkdir -p dist/data
scp -P 22 $USER@$IP_ADDRESS:/home/$USER/powersentinalTesting/dist/data/* dist/data/
