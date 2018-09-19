// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import QueryHistoryIcon from '@material-ui/icons/History';
import QueryReferenceIcon from '@material-ui/icons/Flip';
import InfluxExplorerIcon from '@material-ui/icons/Explore';
import InfluxConnectionsIcon from '@material-ui/icons/Link';

import PanelExplorer from '../PanelExplorer';
import QueryHistory from '../QueryHistory';
import QueryReference from '../QueryReference';
import PanelConnections from '../PanelConnections';

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
    minWidth: (480 - theme.spacing.unit*3) / 4, // 4 - number of tabs
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
            <Tab label="Connect"
              className={classes.tab}
              icon={<InfluxConnectionsIcon className={classes.tabIcon} />}
            />
            <Tab label="Explorer"
              className={classes.tab}
              icon={<InfluxExplorerIcon className={classes.tabIcon} />}
            />
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
          {activeTab === 0 && <PanelConnections/>}
          {activeTab === 1 && <PanelExplorer/>}
          {activeTab === 2 && <QueryHistory/>}
          {activeTab === 3 && <QueryReference/>}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DrawerRight);
