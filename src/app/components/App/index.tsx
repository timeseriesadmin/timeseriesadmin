import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';

import TopBar from '../TopBar';
import MainContent from '../MainContent/MainContent';
import { DrawerRight } from '../sidebar/DrawerRight';

import { useStyles } from './styles';
import { SettingsContextProvider } from 'app/contexts/SettingsContext';
import { QueryHistoryContextProvider } from 'app/contexts/QueryHistoryContext';

import { MIN_DRAWER_WIDTH } from 'app/apollo/defaults';

export const App: React.FC = () => {
  const [isOpenDrawer, setOpenDrawer] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(MIN_DRAWER_WIDTH);
  const classes = useStyles({});

  return (
    <QueryHistoryContextProvider>
      <div
        style={{ paddingRight: isOpenDrawer ? drawerWidth : null }}
        className={classes.root}
      >
        <TopBar
          isOpenDrawer={isOpenDrawer}
          drawerWidth={drawerWidth}
          toggleDrawer={(): void => setOpenDrawer(!isOpenDrawer)}
        />

        <main className={classes.content}>
          <SettingsContextProvider>
            <MainContent />
          </SettingsContextProvider>
        </main>

        <Drawer
          variant="persistent"
          anchor="right"
          open={isOpenDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          PaperProps={{ style: { width: drawerWidth } }}
        >
          <DrawerRight
            drawerWidth={drawerWidth}
            updateWidth={(width: number): void => setDrawerWidth(width)}
          />
        </Drawer>
      </div>
    </QueryHistoryContextProvider>
  );
};
