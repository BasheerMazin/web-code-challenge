import React from "react";
import ReactDOM from "react-dom/client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";

import App from "./App";
import theme from "./theme";
import ErrorBoundary from "./components/ErrorBoundary";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </LocalizationProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
