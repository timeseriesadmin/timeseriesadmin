# Development

A bunch of information for developers connected with "Time Series Admin" project.

## General info

Time Series Admin is based on [Facebook CRA](https://github.com/facebook/create-react-app).
It uses [Apollo Client](https://www.apollographql.com/docs/react/) for managing application local state.
[Material UI](https://material-ui.com/) provides user interface components.
Forms are handled with [React Final Form](https://github.com/final-form/react-final-form).

Yarn is used for dependency management.
Eslint provides JS linting.
Flow is used for type hinting.

## Build development environment

0. Install Yarn
1. Execute `yarn`
1. Run `yarn start` to start development server on port **3000**

## Build locally

Use `yarn build` to compile release files.
Use `yarn db:start` to run local InfluxDB through Docker engine.
Created DB will have following credentials:

- URL: http://localhost:8086
- DB NAME: test
- USER: admin
- PASS: password

Use `yarn electron:dev` to develop Electron with live updates.
Use `yarn build` and `yarn electron` to test Electron releases before bundling.

## Deployment

Use `yarn dist:[platform]` to create platform specific bundle (`platform` may have following values: `docker`, `mac`, `win`, `linux`, `all`).

## Notes

Electron distribution configuration is based on https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c and https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3.
