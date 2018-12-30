// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import QueryHistory from '../QueryHistory';

import { HISTORY_MAX_LENGTH } from '../../apollo/resolvers';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit,
  },
  info: {
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
  },
});

type Props = {
  classes: any,
};
const PanelHistory = ({ classes }: Props) => (
  <div>
    <Typography variant="body1" className={classes.info}>
      List of most recent queries executed, with max length of{' '}
      {HISTORY_MAX_LENGTH} items.
    </Typography>
    <div className={classes.root}>
      <QueryHistory />
    </div>
  </div>
);

export default withStyles(styles)(PanelHistory);
