// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Explorer from '../Explorer';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit*2,
  },
  info: {
    padding: theme.spacing.unit*2,
    paddingBottom: 0,
  },
});

type Props = {
  classes: any,
};
const PanelExplorer = ({ classes }: Props) => (
  <div>
    <Typography variant="body1" className={classes.info}>
      Explore currently connected server
    </Typography>
    <div className={classes.root}>
      <Explorer/>
  </div>
  </div>
);

export default withStyles(styles)(PanelExplorer);
