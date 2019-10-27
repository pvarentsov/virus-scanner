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

    mkdir -p ./dist/server/static/
    cp ./src/server/static/* ./dist/server/static/
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
