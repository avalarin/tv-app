#!/bin/bash
set -e

yarn --cwd ./web build
rm -rf ./hub/public
mv ./web/build ./hub/public