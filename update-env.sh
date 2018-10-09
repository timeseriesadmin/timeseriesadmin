#!/bin/bash
OS=$(uname)

LATEST_TAG=$(git describe --abbrev=0 --tags)
echo "Current version is $LATEST_TAG"
echo "Updating package.json version"

echo "Updating .env file"

if [[ $OS == "Darwin" ]]; then
  sed -E -i '' "1,/REACT_APP_VERSION=/s/REACT_APP_VERSION=.*/REACT_APP_VERSION=${LATEST_TAG}/" .env
else
  sed -r -i "1,/REACT_APP_VERSION=/s/REACT_APP_VERSION=.*/REACT_APP_VERSION=${LATEST_TAG}/" .env
fi
