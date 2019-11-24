import { grey } from '@material-ui/core/colors';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

export default function(theme: Theme) {
  return {
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
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    disabledBtn: {
      color: `${theme.palette.common.white} !important`, // TODO: is it the only way to override default color?
    },
  };
}
