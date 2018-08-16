// @flow
import React from 'react';
import Inspector from 'react-inspector';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
});

const stringifyError = (errorObj: any): string => {
  let msg;
  // TODO: refactor to use less try-catch'es ...
  try {
    const response = errorObj.details.response.data.split('\n');
    if (response.length > 1) {
      try {
        msg = JSON.parse(response[1]);
      } catch(error) {
        msg = response[1];
      }
    } else {
      msg = JSON.parse(response);
    }
  } catch(error) {
    try {
      msg = errorObj.details.response.statusText;
    } catch(error) {
      msg = 'Unknown error, please check Error details section';
    }
  }
  return msg;
};

type Props = {
  classes: any,
  error: string, // error details
};
const QueryError = ({ classes, error }: Props) => {
  const errorObj = JSON.parse(error);

  const errorText = stringifyError(errorObj);

  return (
    <div className={classes.root}>
      <Typography variant="headline" component="h3" style={{ marginBottom: 8 }}>
        Error message
      </Typography>
      <Typography component="p">
        {errorText}
      </Typography>
      <Typography variant="subheading" component="h4" style={{ margin: '18px 0 6px' }}>
        Error details
      </Typography>
      <Typography variant="caption" component="p" style={{ margin: '6px 0 6px' }}>
        You should probably look at "response" key
      </Typography>
      <Inspector
        theme="chromeLight"
        data={errorObj.details}
        expandLevel={2}
      />
    </div>
  );
};

export default withStyles(styles)(QueryError);
