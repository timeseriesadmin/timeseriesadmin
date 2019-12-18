import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';

import { App } from '../App';
import client from '../../apollo';

export const Root = () => (
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </ApolloProvider>
);
