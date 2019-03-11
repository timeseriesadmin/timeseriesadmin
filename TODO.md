# TODO

List of things that are in the project backlog:

- CORE: add users management
- UX: add pagination for large datasets in Explorer panel using `fetchMore` Graphql feature https://www.apollographql.com/docs/react/features/pagination.html
- CORE: allow to write/insert/import data manually and from file
- UX: opt-in password saving
- CORE: Support Electron autoUpdater: https://github.com/electron-userland/electron-builder/issues/3053#issuecomment-401001573
- UX: in network error indicate possible cause of lack of port number if it is not provided by user
- UX: remember Explorer Panel state
- UX: ease query history access
- CORE: secure passwords stored in app with node-keytar https://medium.com/cameron-nokes/how-to-securely-store-sensitive-information-in-electron-with-node-keytar-51af99f1cfc4
- UX: add confirmation message (and undo button), after saved connection removal
- BUG: Explorer requires clicking "Run query" button before it is possible to explore
- CORE: support querying with 'GET' instead of 'POST' (https://github.com/timeseriesadmin/timeseriesadmin/issues/1)
- CORE: support JSON responses if CSV format is not available (https://github.com/timeseriesadmin/timeseriesadmin/issues/1)
