import { Button } from "@mui/material";
import { styled, css } from "@mui/material/styles";

export const StyledCalculatorButton = styled(Button)(
  ({ theme }) => css`
    width: 100%;
    height: 100%;
    border-radius: 12px;
    border: 1px solid ${theme.palette.divider};
    padding: 8px 10px;
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: none;
  `
);
