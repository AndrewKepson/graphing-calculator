import { CssBaseline, ThemeProvider } from "@mui/material";
import { GraphingCalculator } from "./components/graphing-calculator";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GraphingCalculator />
    </ThemeProvider>
  );
}

export default App;
