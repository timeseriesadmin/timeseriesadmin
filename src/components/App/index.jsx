// @flow
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Tooltip, Drawer, IconButton } from '@material-ui/core';
import { HelpOutline as DrawerOpenIcon, Close as DrawerCloseIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Route } from 'react-router-dom';

import PageHome from '../PageHome';
import DrawerRight from '../DrawerRight';

// TODO: remember open/close state in local storage

const drawerWidth = 360;
const mediaRule = '@media (min-width:0px) and (orientation: landscape)';
const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    zIndex: 1,
    minHeight: '100vh',
  },
  flex: {
    flex: 1,
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
  content: {
    maxWidth: '100%',
    boxSizing: 'border-box',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 2,
    paddingTop: theme.mixins.toolbar.minHeight,
    // eslint-disable-next-line no-useless-computed-key
    [mediaRule]: {
      paddingTop: theme.mixins.toolbar[mediaRule].minHeight,
    },
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.mixins.toolbar[theme.breakpoints.up('sm')].minHeight,
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerTitle: {
    paddingLeft: theme.spacing.unit * 2,
  },
  appBarShiftLeft: {
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
  classes: any;
};
type State = {
  isOpenDrawer: boolean;
};
class App extends React.Component<Props, State> {
  state = {
    isOpenDrawer: true,
  };

  render = () => {
    const { classes } = this.props;
    const { isOpenDrawer } = this.state;
    // let updateReady = false;

    // let ipcRenderer;
    // let installUpdates;
    /*if (process.env.REACT_APP_ELECTRON) {
      ipcRenderer = require('electron').ipcRenderer;

      ipcRenderer.on('updateReady', function(event, text) {
        updateReady = true;
      });

      installUpdates = (event) => {
        ipcRenderer.send('quitAndInstall');
      };
    }*/
    const toggleDrawer = (open: boolean) => (event: Event) => {
      this.setState({ isOpenDrawer: open });
    };

    return (
      <div className={classes.root}>
        <AppBar className={classNames(classes.appBar, {
          [classes.appBarShiftLeft]: isOpenDrawer,
        })}>
          <Toolbar disableGutters className={classes.toolbar}>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Influx Admin
            </Typography>
            <div className={classes.rightPanel}>
              <Tooltip title="Additional info">
                <div>
                  <Button classes={{ disabled: classes.disabledBtn }} size="small" color="inherit" onClick={toggleDrawer(true)} disabled={isOpenDrawer}>
                    <DrawerOpenIcon />
                  </Button>
                </div>
              </Tooltip>
            </div>
            {/*<Typography variant="caption" color="inherit" className={classes.rightPanel}>
              ver. <span id="version">{process.env.REACT_APP_VERSION}</span>
              {/*process.env.REACT_APP_ELECTRON && updateReady &&
                <Button onClick={installUpdates}>
                Update
                </Button>
              }
            </Typography>*/}
          </Toolbar>
        </AppBar>

        <main className={classNames(classes.content, {
          [classes.contentShift]: isOpenDrawer,
        })}>
          <Route path="/" component={PageHome} />
        </main>

        <Drawer
          variant="persistent"
          anchor="right"
          open={isOpenDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div className={classes.drawerHeader}>
            <Typography variant="subheading" color="inherit" className={classNames(classes.flex, classes.drawerTitle)}>
              Additional info
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <DrawerCloseIcon />
            </IconButton>
          </div>
          <DrawerRight/>
        </Drawer>

      </div>
    );
  }
};

export default withStyles(styles, { withTheme: true })(App);
