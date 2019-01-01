#!/bin/bash
VERSION=$(grep '"version":' package.json | cut -d\" -f4)

echo This script will create new release of TSA version: $VERSION
echo Press any key to continue...
read

yarn dist:all

mkdir -p release

mv dist/Time\ Series\ Admin-${VERSION}.dmg release/TimeSeriesAdmin.dmg
mv dist/Time\ Series\ Admin\ Setup\ ${VERSION}.exe release/TimeSeriesAdmin.exe
mv dist/timeseriesadmin_${VERSION}_amd64.deb release/TimeSeriesAdmin.deb

echo Removing dist directory
echo Press any key to continue...
read

rm -r dist
