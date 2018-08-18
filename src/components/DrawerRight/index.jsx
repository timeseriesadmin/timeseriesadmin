// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { History as QueryHistoryIcon, Flip as QueryReferenceIcon } from '@material-ui/icons';

import QueryHistory from '../QueryHistory';
import QueryReference from '../QueryReference';

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
    maxHeight: 280,
    overflow: 'auto',
  },
});

const DrawerRight = ({ classes }) => (
  <div className={classes.root}>
    <ExpansionPanel classes={{ expanded: classes.expandedPanel }} defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Tooltip title="100 last queries, they won't dissapear after closing the app">
          <QueryHistoryIcon className={classes.icon}/>
        </Tooltip>
        <Typography className={classes.heading}>Query history</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.detailsPanel}>
        <QueryHistory/>
      </ExpansionPanelDetails>
    </ExpansionPanel>
    <ExpansionPanel classes={{ expanded: classes.expandedPanel }} defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <QueryReferenceIcon className={classes.icon}/>
        <Typography className={classes.heading}>Query References</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.detailsPanel}>
        <QueryReference/>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

export default withStyles(styles)(DrawerRight);
