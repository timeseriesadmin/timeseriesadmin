// @flow
import { BrowserRouter } from 'react-router-dom'
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

import App from './App';
import client from '../apollo';

const Root = () => (
  <ApolloProvider client={client}>
		<MuiThemeProvider theme={theme}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</MuiThemeProvider>
  </ApolloProvider>
);

export default Root;
