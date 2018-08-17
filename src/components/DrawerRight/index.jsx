// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { History as QueryHistoryIcon, Flip as QueryExampleIcon } from '@material-ui/icons';

import QueryHistory from '../QueryHistory';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  icon: {
    fontSize: theme.typography.pxToRem(20),
    marginRight: theme.spacing.unit,
  },
  expandedPanel: {
    margin: 0,
  },
  detailsPanel: {
    flexDirection: 'column',
    textAlign: 'left',
    maxHeight: 300,
    overflow: 'auto',
  },
});

const DrawerRight = ({ classes }) => (
  <div className={classes.root}>
    <ExpansionPanel classes={{ expanded: classes.expandedPanel }} defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <QueryHistoryIcon className={classes.icon}/>
        <Typography className={classes.heading}>Query history</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.detailsPanel}>
        <QueryHistory/>
      </ExpansionPanelDetails>
    </ExpansionPanel>
    <ExpansionPanel classes={{ expanded: classes.expandedPanel }}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <QueryExampleIcon className={classes.icon}/>
        <Typography className={classes.heading}>Query Examples</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
          sit amet blandit leo lobortis eget.
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

export default withStyles(styles)(DrawerRight);
