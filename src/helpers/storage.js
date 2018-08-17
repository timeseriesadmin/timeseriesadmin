// @flow
// Universal storage for Electron and Web
// import Cookies from 'js-cookie';
// import storage from 'electron-json-storage';
// console.log('test');

// if (process.env.REACT_APP_ELECTRON) {
// const ElectronCookies = require('@exponent/electron-cookies');

// Add support for document.cookie, using the given origin (protocol, host, and
// port)
// ElectronCookies.enable({
  // origin: 'https://grzegorowski.com',
// });

// Remove support for document.cookie. Cookies are not cleared from the
// underlying storage.
// ElectronCookies.disable();
// }

// let store;
// console.log(process.env.REACT_APP_ELECTRON);
  // const Store = require('electron-store');
  // store = new Store();
// }

export default {
  get: (name: string, defaultVal?: any) => {
    // if (process.env.REACT_APP_ELECTRON) {
      // return store.get(name);
    // }
    // return Cookies.get(name);
    const val = window.localStorage.getItem(name);
    if (val === null && defaultVal !== undefined) {
      return defaultVal;
    }
    return val;
  },
  set: (name: string, value: string) => {
    // if (process.env.REACT_APP_ELECTRON) {
      // return store.set(name, value);
    // }
    // return Cookies.set(name, value);
    return window.localStorage.setItem(name, value);
  },
};
