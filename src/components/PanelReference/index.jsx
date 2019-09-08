// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import QueryReference from '../QueryReference';
import { DOCS_URL } from '../../config';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit,
  },
  info: {
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
  },
  link: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
});

type Props = {
  classes: any,
};
const PanelHistory = ({ classes }: Props) => (
  <div>
    <Typography variant="body1" className={classes.info}>
      Some examples taken from{' '}
      <a target="_blank" rel="noopener noreferrer" href={DOCS_URL}>
        official InfluxDB docs
      </a>
      .
    </Typography>
    <div className={classes.root}>
      <QueryReference />
    </div>
  </div>
);

export default withStyles(styles)(PanelHistory);
