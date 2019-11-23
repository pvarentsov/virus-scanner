#!/usr/bin/env bash

set -e

RUN_DIR=$(pwd)

SCRIPT_DIR=$(
  cd $(dirname "$0")
  pwd
)

clear_dist() {
    rm -rf ./dist/*
}

run_tsc() {
    ./node_modules/.bin/tsc --skipLibCheck
}

copy_configuration_files() {
    cp ./src/package.json ./dist/package.json

    mkdir -p ./dist/infrastructure/configuration/
    cp ./src/infrastructure/configuration/.env ./dist/infrastructure/configuration/



    mkdir -p ./dist/infrastructure/server/static/
    cp ./src/infrastructure/server/static/* ./dist/infrastructure/server/static/
}

install_dependencies() {
    cd ./dist
    yarn
    cd ..
}

compile() {
    clear_dist
    run_tsc
    copy_configuration_files
    install_dependencies
}

start() {
    cd "$SCRIPT_DIR" && cd ..
    compile
    cd "$RUN_DIR"
}

start
