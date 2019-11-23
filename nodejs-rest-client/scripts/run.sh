#!/usr/bin/env bash

SCRIPT_DIR=$(
  cd $(dirname "$0")
  pwd
)

cd "$SCRIPT_DIR" && cd ../dist

node -r dotenv/config . dotenv_config_path=./infrastructure/configuration/.env bootstrap.js
