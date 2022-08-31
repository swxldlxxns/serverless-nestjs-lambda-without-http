#!/bin/bash
echo "------------------------------------------------------------"
echo "Deleting temporary files"
rm -rf dist
rm -rf coverage
rm -rf .build
rm -rf .esbuild
rm -rf .serverless
[ -d layers/src/src/ ] && [ ! -L layers/src/src/ ] && rm -rf layers/src/src/
[ -d layers/modules/node_modules/ ] && [ ! -L layers/modules/node_modules/ ] && rm -rf layers/modules/node_modules/
[ -f layers/modules/package-lock.json ] && rm layers/modules/package-lock.json
[ -f layers/modules/package.json ] && rm layers/modules/package.json
echo "------------------------------------------------------------"
