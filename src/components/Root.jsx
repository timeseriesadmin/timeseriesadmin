// @flow
import { BrowserRouter } from 'react-router-dom'
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';

import App from './App';
import client from '../apollo';

const Root = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);

export default Root;
