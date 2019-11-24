import { createMuiTheme } from '@material-ui/core/styles';
import { grey, cyan } from '@material-ui/core/colors';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    // type: 'dark',
    primary: {
      light: grey['500'],
      main: grey['800'],
      dark: grey['900'],
    },
    secondary: {
      light: cyan.A200,
      main: cyan.A400,
      dark: cyan.A700,
    },
  },
});

export default theme;
