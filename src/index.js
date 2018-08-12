// eslint-disable-next-line
window.eval = global.eval = function () {
  throw new Error(`Sorry, this app does not support window.eval().`)
}

// the only possible entrypoint for CRA is index.js file
require('./index.jsx');
