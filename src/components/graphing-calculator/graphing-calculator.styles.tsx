import { Box } from "@mui/material";
import { styled, css } from "@mui/material/styles";

export const GraphingCalculatorContainer = styled(Box)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: radial-gradient(
      circle at top,
      ${theme.palette.background.paper} 0%,
      ${theme.palette.background.default} 60%,
      ${theme.palette.background.default} 100%
    );
    color: ${theme.palette.text.primary};
  `
);

export const GraphingCalculatorLayout = styled(Box)(
  () => css`
    display: grid;
    grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
    gap: 20px;
    height: 100%;
    padding: 24px;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto minmax(320px, 1fr);
    }
  `
);

export const GraphingSidebar = styled(Box)(
  () => css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `
);

export const GraphingPanel = styled(Box)(
  ({ theme }) => css`
    border-radius: 20px;
    background: ${theme.palette.background.paper};
    box-shadow: 0 20px 40px rgba(10, 12, 16, 0.35);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `
);
