const mediaRule = '@media (min-width:0px) and (orientation: landscape)';

export default function(theme: any): any {
  return {
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
  };
}
