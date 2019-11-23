#!/usr/bin/env bash

SCRIPT_DIR=$(
  cd $(dirname "$0")
  pwd
)

RUN_DIR=$(pwd)

cd "$SCRIPT_DIR" && cd .. && yarn

cd ./src && yarn

cd "$RUN_DIR"
