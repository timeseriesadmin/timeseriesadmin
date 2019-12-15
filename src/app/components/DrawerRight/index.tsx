import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import QueryHistoryIcon from '@material-ui/icons/History';
import QueryReferenceIcon from '@material-ui/icons/Flip';
import InfluxExplorerIcon from '@material-ui/icons/Explore';
import InfluxConnectionsIcon from '@material-ui/icons/Link';

import PanelExplorer from '../PanelExplorer/PanelExplorer';
import PanelHistory from '../PanelHistory';
import PanelReference from '../PanelReference';
import PanelConnect from '../PanelConnect';
import styles from './styles';

import { MIN_DRAWER_WIDTH, MIN_CONTENT_WIDTH } from 'app/apollo/defaults';

type Props = {
  classes: { [key: string]: string };
  drawerWidth: number;
  updateWidth?: (width: number) => void;
};
type State = {
  activeTab: number;
  // customWidth: number,
  lastDownX: number;
  isResizing: boolean;
};

class DrawerRight extends React.Component<Props, State> {
  state = {
    activeTab: 0,
    isResizing: false,
    lastDownX: 0,
    // customWidth: 0,
  };

  handleMousedown = (e: any) => {
    document.addEventListener('mouseup', this.handleMouseup);
    document.addEventListener('mousemove', this.handleMousemove);
    this.setState({ isResizing: true, lastDownX: e.clientX });
  };

  handleMousemove = (e: any) => {
    // skip if document.body is not yet present
    if (!document.body) {
      return;
    }

    let offsetRight =
      document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
    if (
      offsetRight > MIN_DRAWER_WIDTH &&
      // prevent resizing outside visible area
      offsetRight < document.body.offsetWidth - MIN_CONTENT_WIDTH
    ) {
      this.props.updateWidth && this.props.updateWidth(offsetRight);
      // this.setState({ customWidth: offsetRight });
    }
  };

  handleMouseup = () => {
    // we don't want to do anything if we aren't resizing.
    if (!this.state.isResizing) {
      return;
    }
    document.removeEventListener('mouseup', this.handleMouseup);
    document.removeEventListener('mousemove', this.handleMousemove);
    this.setState({ isResizing: false });
  };

  handleChange = (_event: any, value: any) => {
    this.setState({ activeTab: value });
  };

  render = () => {
    const { classes, drawerWidth } = this.props;
    const { activeTab } = this.state;

    return (
      <div className={classes.root} style={{ width: drawerWidth }}>
        <div onMouseDown={this.handleMousedown} className={classes.dragger} />
        <div
          className={classes.header}
          style={{ right: drawerWidth - MIN_DRAWER_WIDTH }}
        >
          <Tabs
            value={activeTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleChange}
          >
            <Tab
              label="Connect"
              className={classes.tab}
              icon={<InfluxConnectionsIcon className={classes.tabIcon} />}
            />
            <Tab
              label="Explorer"
              className={classes.tab}
              icon={<InfluxExplorerIcon className={classes.tabIcon} />}
            />
            <Tab
              label="History"
              className={classes.tab}
              icon={<QueryHistoryIcon className={classes.tabIcon} />}
            />
            <Tab
              label="Reference"
              className={classes.tab}
              icon={<QueryReferenceIcon className={classes.tabIcon} />}
            />
          </Tabs>
        </div>

        <div className={classes.content}>
          {activeTab === 0 && <PanelConnect />}
          {activeTab === 1 && <PanelExplorer />}
          {activeTab === 2 && <PanelHistory />}
          {activeTab === 3 && <PanelReference />}
        </div>
      </div>
    );
  };
}

export default withStyles(styles)(DrawerRight);
