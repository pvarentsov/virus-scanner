#!/usr/bin/env bash

RUN_DIR=$(pwd)

SCRIPT_DIR=$(
  cd $(dirname "$0")
  pwd
)

COMMAND=$1

validate() {
    if [ -z "$COMMAND" ]
    then
        print_help
        exit 1
    fi
}

print_help() {
    echo "Command is not set. Example: docker-yarn-command-executor.sh \"start\""
}

build_image() {
    docker build -f ./docker/Dockerfile.build . -t docker-api-builder > /dev/null
}

run_command() {
    docker run -v $(pwd):/usr/src/app -w /usr/src/app -it docker-api-builder yarn $COMMAND
}

validate

cd "$SCRIPT_DIR" && cd ..

build_image

cd "$RUN_DIR"

run_command