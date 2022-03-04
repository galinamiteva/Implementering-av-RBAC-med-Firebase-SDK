import { colors } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
import shadows from './shadows';
import typography from './typography';

const theme = createTheme({
  palette: {
    background: {
      dark: '#F4F6F8',
      default: colors.common.white,
      paper: colors.common.white
    },
    primary: {
      main: '#293827'
    },
    secondary: {
      main: '#CC3E31'
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    },
    type: 'light'
  },
  shadows,
  typography
});

export default theme;
