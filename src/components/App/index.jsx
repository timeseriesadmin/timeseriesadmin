// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import TopBar from '../TopBar';
import MainContent from '../MainContent';
import DrawerRight from '../DrawerRight';

export const drawerWidth = 480;
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
    boxSizing: 'border-box',
    transition: theme.transitions.create('padding', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  rootWithDrawer: {
    paddingRight: drawerWidth,
  },
  content: {
    maxWidth: '100%',
    boxSizing: 'border-box',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 2,
    paddingTop: theme.mixins.toolbar.minHeight + theme.spacing.unit * 2,
    [mediaRule]: {
      paddingTop:
        theme.mixins.toolbar[mediaRule].minHeight + theme.spacing.unit * 2,
    },
    [theme.breakpoints.up('sm')]: {
      paddingTop:
        theme.mixins.toolbar[theme.breakpoints.up('sm')].minHeight +
        theme.spacing.unit * 2,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
});

const IS_OPEN_DRAWER = gql`
  query isOpenDrawer {
    isOpenDrawer @client
  }
`;

const SET_OPEN_DRAWER = gql`
  mutation setOpenDrawer($isOpen: Boolean) {
    setOpenDrawer(isOpen: $isOpen) @client
  }
`;

const App = ({ classes }) => (
  <Query query={IS_OPEN_DRAWER}>
    {({ data: { isOpenDrawer } }: { data: any }) => (
      <Mutation mutation={SET_OPEN_DRAWER}>
        {setOpenDrawer => (
          <div
            className={classNames(classes.root, {
              [classes.rootWithDrawer]: isOpenDrawer,
            })}
          >
            <TopBar
              isOpenDrawer={isOpenDrawer}
              toggleDrawer={() =>
                setOpenDrawer({
                  variables: { isOpen: !isOpenDrawer },
                })
              }
            />

            <main className={classes.content}>
              <MainContent />
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
              <DrawerRight />
            </Drawer>
          </div>
        )}
      </Mutation>
    )}
  </Query>
);

export default withStyles(styles)(App);
