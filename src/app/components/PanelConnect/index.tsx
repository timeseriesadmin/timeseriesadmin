import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme } from '@material-ui/core/styles';
import Connections from '../Connections';

const styles = (theme: Theme): any => ({
  root: {
    paddingTop: theme.spacing(),
    paddingLeft: 0,
  },
  info: {
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
});

type Props = {
  classes: any;
};
const PanelConnect = ({ classes }: Props) => (
  <div>
    <Typography variant="body1" className={classes.info}>
      List of all saved connections
    </Typography>
    <div className={classes.root}>
      <Connections />
    </div>
  </div>
);

export default withStyles(styles)(PanelConnect);
