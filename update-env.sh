#!/bin/bash
OS=$(uname)

LATEST_TAG=$(git describe --abbrev=0 --tags)
echo "Current version is $LATEST_TAG"
echo "Updating package.json version"

# -E/-rsee: http://www.grymoire.com/Unix/Sed.html#uh-4a
if [[ $OS == "Darwin" ]]; then
  # -i see: http://www.grymoire.com/Unix/Sed.html#uh-62h
  # edit "in place": -i
  # replace only first occurence: 1,
  # when line has string: version
  # of: [0-9]+\.[0-9]+\.[0-9]+
  # with: LATEST_TAG
  sed -E -i '' "1,/version/s/[0-9]+\.[0-9]+\.[0-9]+/${LATEST_TAG}/" package.json
else
  sed -r -i "1,/version/s/[0-9]+\.[0-9]+\.[0-9]+/${LATEST_TAG}/" package.json
fi

echo "Updating .env file"

if [[ $OS == "Darwin" ]]; then
  sed -E -i '' "1,/REACT_APP_VERSION=/s/REACT_APP_VERSION=.*/REACT_APP_VERSION=${LATEST_TAG}/" .env
else
  sed -r -i "1,/REACT_APP_VERSION=/s/REACT_APP_VERSION=.*/REACT_APP_VERSION=${LATEST_TAG}/" .env
fi
