// @flow
import { BrowserRouter } from 'react-router-dom'
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { grey, cyan } from '@material-ui/core/colors';

import App from './App';
import client from '../apollo';

const theme = createMuiTheme({
	palette: {
		// type: 'dark',
		primary: {
			light: grey['500'],
			main: grey['800'],
			dark: grey['900'],
		},
		secondary: {
			light: cyan['A200'],
			main: cyan['A400'],
			dark: cyan['A700'],
		},
	},
});

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
