const mediaRule = '@media (min-width:0px) and (orientation: landscape)';

export default function(theme: any): any {
  return {
    root: {
      width: '100%',
    },
    header: {
      ...theme.mixins.toolbar,
      position: 'fixed',
      top: 0,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      padding: '0 8px',
      background: theme.palette.common.white,
      zIndex: theme.zIndex.appBar,
    },
    tab: {
      minHeight: 64,
      minWidth: (480 - theme.spacing.unit * 3) / 4, // 4 - number of tabs
    },
    tabIcon: {
      fontSize: theme.typography.pxToRem(20),
    },
    content: {
      paddingTop: theme.mixins.toolbar.minHeight,
      // eslint-disable-next-line no-useless-computed-key
      [mediaRule]: {
        paddingTop: theme.mixins.toolbar[mediaRule].minHeight,
      },
      [theme.breakpoints.up('sm')]: {
        paddingTop: theme.mixins.toolbar[theme.breakpoints.up('sm')].minHeight,
      },
    },
    dragger: {
      width: 5,
      cursor: 'ew-resize',
      borderRight: '1px solid #ddd',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: theme.zIndex.appBar + 1,
      backgroundColor: '#f1f1f1',
      '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 1,
        width: 1,
        height: '100%',
        backgroundColor: '#fff',
      },
    },
  };
}
