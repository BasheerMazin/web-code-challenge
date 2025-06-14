import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#003545",
    },
    secondary: {
      main: "#E8424C",
    },
  },
  typography: {
    fontFamily: "sans-serif",
  },
});

export default theme;
