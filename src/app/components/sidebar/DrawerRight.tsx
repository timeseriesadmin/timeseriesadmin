import React, { useState, ChangeEvent } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import QueryHistoryIcon from '@material-ui/icons/History';
import QueryReferenceIcon from '@material-ui/icons/Flip';
import InfluxExplorerIcon from '@material-ui/icons/Explore';
import InfluxConnectionsIcon from '@material-ui/icons/Link';

import PanelExplorer from './PanelExplorer/PanelExplorer';
import PanelHistory from './PanelHistory';
import PanelReference from './PanelReference';
import PanelConnect from './PanelConnect';
import { useStyles } from './styles';

import { MIN_DRAWER_WIDTH, MIN_CONTENT_WIDTH } from 'app/apollo/defaults';

type Props = {
  drawerWidth: number;
  updateWidth?: (width: number) => void;
};

export const DrawerRight: React.FC<Props> = (props: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isResizing, setResizing] = useState(false);
  const classes = useStyles(props);
  const { drawerWidth, updateWidth } = props;

  const handleMousemove = (event: MouseEvent): void => {
    // skip if document.body is not yet present
    if (!document.body || !updateWidth) {
      return;
    }

    const offsetRight =
      document.body.offsetWidth - (event.clientX - document.body.offsetLeft);
    if (
      offsetRight > MIN_DRAWER_WIDTH &&
      // prevent resizing outside visible area
      offsetRight < document.body.offsetWidth - MIN_CONTENT_WIDTH
    ) {
      updateWidth(offsetRight);
    }
  };

  const handleMouseup = (): void => {
    // we don't want to do anything if we aren't resizing.
    if (!isResizing) {
      return;
    }
    document.removeEventListener('mouseup', handleMouseup);
    document.removeEventListener('mousemove', handleMousemove);
    setResizing(true);
  };

  const handleMousedown = (): void => {
    document.addEventListener('mouseup', handleMouseup);
    document.addEventListener('mousemove', handleMousemove);
    setResizing(true);
  };

  const handleChange = (_event: ChangeEvent, value: number): void => {
    setActiveTab(value);
  };

  return (
    <div
      className={classes.root}
      style={{ width: drawerWidth }}
      data-testid="DrawerRight"
    >
      <div onMouseDown={handleMousedown} className={classes.dragger} />
      <div
        className={classes.header}
        style={{ right: drawerWidth - MIN_DRAWER_WIDTH }}
      >
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
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
