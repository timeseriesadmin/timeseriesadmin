// @flow
import React from 'react';
import Inspector from 'react-inspector';
import Typography from '@material-ui/core/Typography';
import get from 'lodash/get';

import type { ApolloError } from 'apollo-client';

// Converts ApolloError to string
const stringifyError = (apolloError: ApolloError): string => {
  const error = get(apolloError, 'networkError.networkError');
  if (!error) {
    return JSON.stringify(apolloError);
  }
  return `${error.status}:${error.statusText} ${error.details ||
    error.data ||
    ''}`;
};

type Props = {
  error: ApolloError,
};
const QueryError = ({ error }: Props) => (
  <div>
    <Typography
      variant="headline"
      component="h3"
      style={{ marginBottom: 8, color: 'red' }}
    >
      {stringifyError(error)}
    </Typography>
    <Typography
      variant="subheading"
      component="h4"
      style={{ margin: '18px 0 6px' }}
    >
      Error details
    </Typography>
    <Typography variant="caption" component="p" style={{ margin: '6px 0 6px' }}>
      You should probably look at "response" key
    </Typography>
    <Inspector theme="chromeLight" data={error.networkError} expandLevel={2} />
  </div>
);

export default QueryError;
