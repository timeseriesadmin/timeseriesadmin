import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from './app/components/root/Root';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found!');
}

ReactDOM.render(<Root />, root);

if (module.hot) {
  module.hot.accept('./app/components/root/Root', () => {
    const NextRoot = require('./app/components/root/Root').Root;
    ReactDOM.render(<NextRoot />, root);
  });
}

registerServiceWorker();
