// @flow
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

export type Props = {
  classes: { [string]: string },
  isOpenDrawer: boolean,
  drawerWidth: number,
  toggleDrawer: () => void,
};

const TopBar = ({
  classes,
  isOpenDrawer,
  drawerWidth,
  toggleDrawer,
}: Props) => (
  <AppBar
    className={classNames(classes.appBar, {
      [classes.appBarShifted]: isOpenDrawer,
    })}
    style={{
      width: isOpenDrawer ? `calc(100% - ${drawerWidth}px)` : null,
      marginRight: isOpenDrawer ? drawerWidth : null,
    }}
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
          variant="title"
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
              size="small"
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
