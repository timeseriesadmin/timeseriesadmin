import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const mediaRule = '@media (min-width:0px) and (orientation: landscape)';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      padding: theme.spacing(2),
      paddingTop: (theme.mixins.toolbar.minHeight as any) + theme.spacing(2),
      [mediaRule]: {
        paddingTop:
          ((theme.mixins.toolbar[mediaRule] as any).minHeight as any) +
          theme.spacing(2),
      },
      [theme.breakpoints.up('sm')]: {
        paddingTop:
          ((theme.mixins.toolbar[theme.breakpoints.up('sm')] as any)
            .minHeight as any) + theme.spacing(2),
      },
    },
  }),
);
