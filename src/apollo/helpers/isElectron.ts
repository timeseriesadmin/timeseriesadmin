export function isElectron() {
  // https://github.com/electron/electron/issues/2288#issuecomment-337858978
  return window.navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
}
