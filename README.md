# Virus Scanner

This project is a virus scanner as a microservice with REST interface. It consists of ClamAV and NodeJS client for ClamAV.

## ClamAV

ClamAV is used as a docker image. It runs:
* `clamd` daemon socket listening on port 3310;
* `freshclam` signature database update tool in the background.

## REST Client

REST Client is a NodeJS application based on `NestJS` framework. 

## How-To

To ran microservice you can use `docker compose`. It will ran Scanner service on port 3310 and API service on port 1337. 

Usage: `docker-compose up -d --build`.

## Locally Development

To develop on local you can ran ClamAV container in the background: `docker-compose up --build scanner`.

To ran REST Client manually need to:
* install dependencies - `yarn install:all`
* build project - `yarn build`
* ran project - `yarn start`

The REST Client configuring is based on environment variables. 

You can ran client with variables from [dotenv file](nodejs-rest-client/env/.env). Use `yarn start:env` command instead `yarn start`.
