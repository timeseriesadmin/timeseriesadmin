"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
// Modules to control application life and create native browser window
var electron_1 = require("electron");
var https_1 = __importDefault(require("https"));
var commonError_1 = require("./shared/commonError");
var influxRequest_1 = require("./shared/influxRequest");
if (process.env.ELECTRON_IS_DEV) {
    // Enable Google Dev Tools in Electron
    var debug_1 = require('electron-debug');
    debug_1();
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        width: 1300,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            preload: __dirname + '/preload.js'
        }
    });
    // open all target="_blank" links in a new window
    mainWindow.webContents.on('new-window', function (event, url) {
        event.preventDefault();
        electron_1.shell.openExternal(url);
    });
    // and load the index.html of the app.
    if (process.env.ELECTRON_START_URL) {
        mainWindow.loadURL(process.env.ELECTRON_START_URL);
    }
    else {
        mainWindow.loadFile('./build/index.html');
    }
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    var template = [
        {
            label: 'Application',
            submenu: [
                // { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
                // { type: "separator" },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: function () {
                        electron_1.app.quit();
                    }
                },
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
                { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
                { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    selector: 'selectAll:'
                },
            ]
        },
    ];
    electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(template));
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', function () {
    createWindow();
    // autoUpdater.checkForUpdates();
});
// Custom `influx-query` ipc event
electron_1.ipcMain.on('influx-query', function (event, _a) {
    var params = _a.params;
    influxRequest_1.influxRequest(__assign({ httpsAgent: new https_1["default"].Agent({
            rejectUnauthorized: params.rejectUnauthorized
        }) }, params))
        .then(function (response) {
        mainWindow.webContents.send('influx-query-response', { response: response });
    })["catch"](function (error) {
        mainWindow.webContents.send('influx-query-response', {
            error: commonError_1.commonError(error)
        });
    });
});
// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
// autoUpdater.on('update-downloaded', (info) => {
// mainWindow.webContents.send('updateReady');
// });
// when receiving a quitAndInstall signal, quit and install the new version ;)
// ipcMain.on('quitAndInstall', (event, arg) => {
// autoUpdater.quitAndInstall();
// });
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
