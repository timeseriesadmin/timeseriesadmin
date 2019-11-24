import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiSvgIcon: {
      root: {
        marginRight: 3,
        fontSize: 18,
      },
    },
    MuiButton: {
      label: {
        paddingRight: 8,
      },
      sizeSmall: {
        paddingTop: 0,
        paddingBottom: 0,
        minHeight: 26,
        borderRadius: 0,
        textTransform: 'none',
      },
    },
    MuiIconButton: {
      root: {
        padding: 0,
      },
    },
    MuiCollapse: {
      wrapper: {
        paddingLeft: 10,
      },
    },
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    MuiListItem: {
      gutters: {
        padding: 0,
        flexDirection: 'column',
        alignItems: 'flex-start',
        '@media (min-width: 600px)': {
          padding: 0,
        },
      },
    },
    MuiListItemText: {
      primary: {
        display: 'inline-block',
        fontSize: 14,
        marginRight: 8,
      },
      secondary: {
        display: 'inline-block',
        fontSize: 12,
      },
    },
  },
});
