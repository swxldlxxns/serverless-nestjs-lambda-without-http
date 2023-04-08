#!/bin/bash

./clear.sh
echo "------------------------------------------------------------"
echo "Buildings layers"
mkdir layers
mkdir layers/modules
mkdir layers/src
cp package.json layers/modules/package.json
cp package-lock.json layers/modules/package-lock.json
cd layers/modules || exit
npm i --omit=dev --ignore-scripts
cd ../../
tsc
cp -rf dist/src/ layers/src/
echo "------------------------------------------------------------"
echo "Deploy stack"
serverless deploy
echo "------------------------------------------------------------"
./clear.sh
