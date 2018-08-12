// @flow
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { Route } from 'react-router-dom';
import PageHome from '../PageHome';

const mediaRule = '@media (min-width:0px) and (orientation: landscape)';
const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  flex: {
    flex: 1,
  },
  toolbar: {
    ...theme.mixins.toolbar,
    paddingLeft: 0,
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing.unit * 2,
    },
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
  },
});

type Props = {
  classes: any;
  router: any;
  theme: any;
};
const App = (props: Props) => {
  const { classes } = props;
  let updateReady = false;

  let ipcRenderer;
  let installUpdates;
  if (process.env.REACT_APP_ELECTRON) {
    ipcRenderer = require('electron').ipcRenderer;

    ipcRenderer.on('updateReady', function(event, text) {
      updateReady = true;
    });

    installUpdates = (event) => {
      ipcRenderer.send('quitAndInstall');
    };
  }

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar disableGutters className={classes.toolbar}>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Influx Admin
          </Typography>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Version: <span id="version">{process.env.REACT_APP_VERSION}</span>
            {process.env.REACT_APP_ELECTRON && updateReady &&
              <Button onClick={installUpdates}>
              Update
              </Button>
            }
          </Typography>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <Route path="/" component={PageHome} />
      </main>

    </div>
  );
};

export default withStyles(styles, { withTheme: true })(App);
