import { Box } from "@mui/material";
import { styled, css } from "@mui/material/styles";

export const LayoutContainer = styled(Box)(
  ({ theme }) => css`
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    background: ${theme.palette.background.default};
    color: ${theme.palette.text.primary};
  `
);

export const LayoutHeader = styled("header")(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 32px;
    border-bottom: 1px solid ${theme.palette.divider};
    background: linear-gradient(to bottom, #1a202c, ${theme.palette.background.default});
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-size: 0.8rem;
  `
);

export const LayoutFooter = styled("footer")(
  ({ theme }) => css`
    padding: 18px 32px;
    border-top: 1px solid ${theme.palette.divider};
    background: ${theme.palette.background.paper};
    font-size: 0.8rem;

    a {
      color: ${theme.palette.primary.main};
      text-decoration: none;
      font-weight: 600;
    }

    a:hover {
      text-decoration: underline;
    }
  `
);
