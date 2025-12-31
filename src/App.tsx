import { CssBaseline, ThemeProvider } from "@mui/material";
import { GraphingCalculator } from "./components/graphing-calculator";
import { Layout } from "./components/layout/layout";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <GraphingCalculator />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
