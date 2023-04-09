#!/bin/bash
echo "------------------------------------------------------------"
echo "Deleting temporary files"
rm -rf dist
rm -rf coverage
rm -rf .build
rm -rf .esbuild
rm -rf .serverless
rm -rf layers
echo "------------------------------------------------------------"
