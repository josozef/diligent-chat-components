import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import DemoContext, { type ThemeMode } from "./DemoContext";
import App from "./App";
import { lightTheme, darkTheme } from "./theme";
import AtlasLightCssVariables from "./AtlasLightCssVariables";

function Root() {
  const [hasAlerts, setHasAlerts] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>("atlas-light");

  const theme = useMemo(
    () => (themeMode === "atlas-dark" ? darkTheme : lightTheme),
    [themeMode],
  );

  return (
    <DemoContext.Provider value={{ hasAlerts, setHasAlerts, themeMode, setThemeMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AtlasLightCssVariables />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </DemoContext.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
