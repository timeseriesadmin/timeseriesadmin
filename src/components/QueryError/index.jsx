// @flow
import React from 'react';
import Inspector from 'react-inspector';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { get } from 'lodash';

import type { ApolloError } from 'apollo-client';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
});

// Converts ApolloError to string
// TODO: cover all possible cases
const parseErrorMessage = (error: ApolloError): string => {
  const errorStatus = get(error, 'networkError.response.status', null);
  const errorMessage = get(error, 'networkError.response.data', null);

  if (errorStatus === 400 && errorMessage) {
    // this is probably a bug in query string
    // TODO: it should possible to show some suggestions connected with fixing it
    return `${errorStatus}: ${errorMessage}`;
  }

  const errorDetails = get(error, 'networkError.response.data.error', null);
  if (errorDetails) {
    return `${errorStatus ? errorStatus + ': ' : ''}${errorDetails}`;
  }

  return `${errorStatus ? errorStatus + ': ' : ''}${errorMessage}`;
};

type Props = {
  classes: any,
  error: ApolloError,
};
const QueryError = ({ classes, error }: Props) => (
  <div className={classes.root}>
    <Typography variant="headline" component="h3" style={{ marginBottom: 8 }}>
      Error message
    </Typography>
    <Typography component="p">
      {parseErrorMessage(error)}
    </Typography>
    <Typography variant="subheading" component="h4" style={{ margin: '18px 0 6px' }}>
      Error details
    </Typography>
    <Typography variant="caption" component="p" style={{ margin: '6px 0 6px' }}>
      You should probably look at "response" key
    </Typography>
    <Inspector
      theme="chromeLight"
      data={error.networkError}
      expandLevel={2}
    />
  </div>
);

export default withStyles(styles)(QueryError);
