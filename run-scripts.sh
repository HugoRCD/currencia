#!/bin/bash

docker run --rm crypto-scripts run scripts/coinmarketcap/index.ts
docker run --rm crypto-scripts run scripts/kraken/index.ts
docker run --rm crypto-scripts run scripts/cryptocompare/index.ts
