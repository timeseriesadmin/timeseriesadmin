import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found!');
}

ReactDOM.render(
  <Root />,
  root,
);

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NextRoot = require('./components/Root').default;
    ReactDOM.render(
      <NextRoot />,
      root,
    );
  });
}

registerServiceWorker();
