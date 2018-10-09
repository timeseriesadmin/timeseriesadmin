#!/bin/bash
OS=$(uname)

# LATEST_TAG=$(git describe --abbrev=0 --tags)
VERSION=$(grep '"version":' package.json | cut -d\" -f4)
echo "Current version is $VERSION"

echo "Updating .env file"

if [[ $OS == "Darwin" ]]; then
  sed -E -i '' "1,/REACT_APP_VERSION=/s/REACT_APP_VERSION=.*/REACT_APP_VERSION=${VERSION}/" .env
else
  sed -r -i "1,/REACT_APP_VERSION=/s/REACT_APP_VERSION=.*/REACT_APP_VERSION=${VERSION}/" .env
fi
