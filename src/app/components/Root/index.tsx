import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';

import App from '../App';
import client from '../../apollo';

const Root = () => (
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </ApolloProvider>
);

export default Root;
