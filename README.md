# Virus Scanner

This project is a virus scanner as a microservice with REST interface. It consists of ClamAV and NodeJS client for ClamAV.

## ClamAV

ClamAV is used as a docker image. It runs:
* `clamd` daemon socket listening on port 3310;
* `freshclam` signature database update tool in the background.

## REST Client

REST Client is a NodeJS application based on `NestJS` framework. 

## How-To

To run microservice you can use `docker compose`. It will run Scanner service on port 3310 and API service on port 1337. The API documentation will be available on endpoint `GET http://127.0.0.1:1337/api/documentation`.

Usage: `docker-compose up -d --build`.

## Local Development

To develop on local you can run ClamAV container in the background: `docker-compose up --build scanner`.

To run REST Client manually need to:
* have NodeJS on your machine with version `> 11`
* enter to the client directory - `cd ./nodejs-rest-client`
* install dependencies - `yarn install:all`
* build project - `yarn build`
* run project - `yarn start`

The REST Client configuring is based on environment variables. 

You can run client with variables from [dotenv file](nodejs-rest-client/env/.env). Use `yarn start:env` command instead `yarn start`.
