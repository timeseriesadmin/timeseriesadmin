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
import { grey } from '@material-ui/core/colors';
import classNames from 'classnames';

import VersionInfo from '../VersionInfo';
import IconMain from '../IconMain';
import { drawerWidth } from '../App';

const styles = theme => ({
  flex: {
    flex: 1,
  },
  appBar: {
    background: grey['900'],
  },
  toolbar: {
    ...theme.mixins.toolbar,
    paddingLeft: theme.spacing.unit * 2,
    // paddingLeft: 0,
    // [theme.breakpoints.up('md')]: {
    //   paddingLeft: theme.spacing.unit * 2,
    // },
  },
  rightPanel: {
    paddingRight: theme.spacing.unit * 2,
  },
  appBarShifted: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  disabledBtn: {
    color: `${theme.palette.common.white} !important`, // TODO: is it the only way to override default color?
  },
});

type Props = {
  classes: { [string]: string },
  isOpenDrawer: boolean,
  toggleDrawer: () => void,
};

const TopBar = ({ classes, isOpenDrawer, toggleDrawer }: Props) => (
  <AppBar
    className={classNames(classes.appBar, {
      [classes.appBarShifted]: isOpenDrawer,
    })}
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
