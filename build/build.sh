#!/usr/bin/env bash

set -e

RUN_DIR=$(pwd)

SCRIPT_DIR=$(
  cd $(dirname "$0")
  pwd
)

AVAILABLE_ENV_PATTERN="^(local)$"

ENV="$1"

export_yarn() {
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
}

copy_configuration_files() {
    cp ./env/${ENV}/*.conf ./scanner/clamav/docker
    cp ./env/${ENV}/api.env ./nodejs-rest-client/env/.env

    cd "$SCRIPT_DIR" && cd ..
}

build_api() {
    cd ./nodejs-rest-client
    yarn install:all
    yarn lint
    yarn build

    cd "$SCRIPT_DIR" && cd ..
}

print_help() {
    echo ""
    echo "-----------------------------------------------------------------------"
    echo "|                        Available commands                           |"
    echo "-----------------------------------------------------------------------"
    echo "| local   - Prepare configuration and build for local environment     |"
    echo "-----------------------------------------------------------------------"
    echo ""
}

start() {
    cd "$SCRIPT_DIR" && cd ..

    if [[ "$ENV" =~ $AVAILABLE_ENV_PATTERN ]]; then
        export_yarn
        copy_configuration_files
        build_api
    else
        print_help
    fi

    cd "$RUN_DIR"
}

start