// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Drawer } from '@material-ui/core';
import { HelpOutline as DrawerOpenIcon, ChevronRight as DrawerCloseIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Route } from 'react-router-dom';

import PageHome from '../PageHome';
import DrawerRight from '../DrawerRight';

// TODO: remember open/close state in local storage

const drawerWidth = 480;
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
	{(setOpenDrawer) => (
		<div className={classes.root}>
			<AppBar className={classNames(classes.appBar, {
				[classes.appBarShifted]: isOpenDrawer,
			})}>
				<Toolbar disableGutters className={classes.toolbar}>
					<Typography variant="title" color="inherit" className={classes.flex}>
						Influx Query Admin
					</Typography>
					<div className={classes.rightPanel}>
						<Tooltip title={isOpenDrawer ? "Close sidebar" : "Additional info"}>
							<div>
								<IconButton
									classes={{ disabled: classes.disabledBtn }}
									size="small"
									color="inherit"
									onClick={() => setOpenDrawer({ variables: { isOpen: !isOpenDrawer } })}
								>
									{isOpenDrawer ? (
										<DrawerCloseIcon />
									) : (
										<DrawerOpenIcon />
									)}
								</IconButton>
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
				<DrawerRight />
			</Drawer>

		</div>
	)}
	</Mutation>
	)}
	</Query>
);

export default withStyles(styles, { withTheme: true })(App);
