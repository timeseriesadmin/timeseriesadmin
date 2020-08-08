# Development

A bunch of information for developers connected with "Time Series Admin" project.

## General info

Time Series Admin is based on [Facebook CRA](https://github.com/facebook/create-react-app).
It uses [Apollo Client](https://www.apollographql.com/docs/react/) for managing application local state.
[Material UI](https://material-ui.com/) provides user interface components.
Forms are handled with [React Final Form](https://github.com/final-form/react-final-form).

NPM is used for dependency management.
Eslint provides JS linting.
Typescript is used for type hinting.
CI is ensured with CircleCI.
Coverage reports are uploaded to Codecov service.

## Branching strategy

- master - current state of development (releases are tagged)
- feature/\* - feature branch

## Build development environment

0. Install NPM
1. Execute `npm install`
1. Run `npm run start` to start development server on port **3000**

## Build locally

Use `npm run build` to compile release files.
Use `npm run db:start` to run local InfluxDB through Docker engine.
Created DB will have following credentials:

- URL: http://localhost:8086
- DB NAME: test
- USER: admin
- PASS: password

Use `npm run electron:dev` to develop Electron with live updates.
Use `npm run build` and `npm run electron` to test Electron releases before bundling.

## Tests

Unit & integration tests:

0. `npm run test` will trigger single run of all Jest tests
1. `npm run test:watch` starts watching for file changes and reruns Jest tests

End-to-end tests:

0. Start application with `npm run start`
1. Execute `npm run cypress:run` to start end-to-end Cypress based tests in headless mode

**NOTE:** You may open Cypress tests UI with `npm run cypress:open`.

## Deployment

Use `npm run dist:[platform]` to create platform specific bundle (`platform` may have following values: `docker`, `mac`, `win`, `linux`, `all`).

## Releases

0. Update CHANGELOG.md
1. Use `npm version patch` to set new version number and then `npm publish` to publish on NPM
1. Execute `./release.sh` script to create Electron packages for every supported system
1. Push Docker images with `npm run release:docker`
1. Manually create Github release, upload files from step 2. and changes from CHANGELOG.md
1. Update `config.toml` file on Github page and follow deployment instruction there

## Notes

Electron distribution configuration is based on https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c and https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3.
