import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import DrawerOpenIcon from '@material-ui/icons/Menu';
import DrawerCloseIcon from '@material-ui/icons/ChevronRight';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import VersionInfo from '../VersionInfo';
import IconMain from '../IconMain';

import styles from './styles';

export interface Props {
  classes: { [key: string]: string };
  isOpenDrawer: boolean;
  drawerWidth?: number;
  toggleDrawer: () => void;
}

const TopBar = ({
  classes,
  isOpenDrawer,
  drawerWidth = 200,
  toggleDrawer,
}: Props) => (
  <AppBar
    className={classNames(classes.appBar, {
      [classes.appBarShifted]: isOpenDrawer,
    })}
    style={{
      width: isOpenDrawer ? `calc(100% - ${drawerWidth}px)` : undefined,
      marginRight: isOpenDrawer ? drawerWidth : undefined,
    }}
    data-testid="TopBar"
  >
    <Toolbar disableGutters className={classes.toolbar}>
      <div
        className={classes.flex}
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        <IconMain
          style={{
            width: 48,
            height: 48,
            alignSelf: 'center',
            marginRight: 8,
          }}
        />
        <Typography
          variant="h6"
          color="inherit"
          style={{ alignSelf: 'center' }}
        >
          Time Series Admin
          <VersionInfo />
        </Typography>
      </div>
      <div className={classes.rightPanel}>
        <Tooltip title={isOpenDrawer ? 'Close sidebar' : 'Open sidebar'}>
          <div>
            <IconButton
              classes={{ disabled: classes.disabledBtn }}
              color="inherit"
              onClick={toggleDrawer}
              aria-label={isOpenDrawer ? 'Close sidebar' : 'Open sidebar'}
            >
              {isOpenDrawer ? <DrawerCloseIcon /> : <DrawerOpenIcon />}
            </IconButton>
          </div>
        </Tooltip>
      </div>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(TopBar);
