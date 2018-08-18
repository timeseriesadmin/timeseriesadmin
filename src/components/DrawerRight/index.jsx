// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { History as QueryHistoryIcon, Flip as QueryReferenceIcon } from '@material-ui/icons';

import QueryHistory from '../QueryHistory';
import QueryReference from '../QueryReference';

const mediaRule = '@media (min-width:0px) and (orientation: landscape)';
const styles = theme => ({
  root: {
    width: '100%',
  },
  header: {
    ...theme.mixins.toolbar,
		width: 480,
		position: 'fixed',
		top: 0,
		right: 0,
		boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: '0 8px',
		background: theme.palette.common.white,
		zIndex: theme.zIndex.appBar,
  },
  tab: {
    minHeight: 64,
    // minWidth: (480 - theme.spacing.unit*2) / 3,
  },
  tabIcon: {
    fontSize: theme.typography.pxToRem(20),
  },
  content: {
    paddingTop: theme.mixins.toolbar.minHeight,
    // eslint-disable-next-line no-useless-computed-key
    [mediaRule]: {
      paddingTop: theme.mixins.toolbar[mediaRule].minHeight,
    },
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.mixins.toolbar[theme.breakpoints.up('sm')].minHeight,
    },
  },
});

type Props = {
  classes: any,
};
type State = {
  activeTab: number,
};
class DrawerRight extends React.Component<Props, State> {
  state = {
    activeTab: 0,
  };

  handleChange = (event, value) => {
    this.setState({ activeTab: value });
  }

  render = () => {
    const { classes } = this.props;
    const { activeTab } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <Tabs value={activeTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleChange}
          >
            <Tab label="History"
              className={classes.tab}
              icon={<QueryHistoryIcon className={classes.tabIcon} />}
            />
            <Tab label="Reference"
              className={classes.tab}
              icon={<QueryReferenceIcon className={classes.tabIcon} />}
            />
          </Tabs>
        </div>

        <div className={classes.content}>
          {activeTab === 0 && <QueryHistory/>}
          {activeTab === 1 && <QueryReference/>}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DrawerRight);
