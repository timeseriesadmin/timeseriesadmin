Influx Explorer
===

[![dependencies Status](https://david-dm.org/influx-explorer/influx-explorer/status.svg)](https://david-dm.org/influx-explorer/influx-explorer) [![devDependencies Status](https://david-dm.org/influx-explorer/influx-explorer/dev-status.svg)](https://david-dm.org/influx-explorer/influx-explorer?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Administration panel and database explorer interface for [InfluxDB](https://www.influxdata.com/time-series-platform/influxdb/).

## Download

Go to download section on the official project page [https://influx-explorer.github.io/#download](https://influx-explorer.github.io/#download).
Currently supported/tested platforms are:

- Windows 10 (x64)
- Ubuntu 18.04
- Mac OS X 10.13
- Docker 18.06

## Usage

For usage related information go to the official project page [https://influx-explorer.github.io](https://influx-explorer.github.io).

## Development

Use `yarn start` to run development server.
Use `yarn build` to compile release files.

Use `yarn electron:dev` to develop Electron with live updates.
Use `yarn build` and `yarn electron` to test Electron releases before bundling.

## Deployment

Use `yarn dist:[platform]` to create platform specific bundle (`platform` may have following values: `docker`, `mac`, `win`, `linux`, `all`).

## Notes

Electron distribution configuration based on https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c and https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3.

## TODO

- CORE: add user management
- UX: add pagination for large datasets in Explorer panel using `fetchMore` Graphql feature https://www.apollographql.com/docs/react/features/pagination.html
- CORE: allow to write/insert/import data
- UX: cmd+enter to submit query
- UX: opt-in password saving
- CORE: Support Electron autoUpdater: https://github.com/electron-userland/electron-builder/issues/3053#issuecomment-401001573
- CORE: secure localStorage e.g. with password encryption of stored data (?) see: https://stackoverflow.com/questions/3220660/local-storage-vs-cookies
- UX: in network error indicate possible cause of lack of port number if it is not provided by user
- UX: remember Explorer panel state
- UX: ease History access
- UX: allow for copy/paste from Explorer panel e.g. measurement name
- BUG: prevent uppercasing of measurement names in Explorer panel

## License

[MIT](./LICENSE)

## Author

Jan Grzegorowski
