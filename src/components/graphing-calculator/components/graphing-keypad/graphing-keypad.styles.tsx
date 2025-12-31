import { Card, Box } from '@mui/material'
import { styled, css } from '@mui/material/styles'

export const GraphingKeypadWrapper = styled(Card)(
  ({ theme }) => css`
    padding: 16px;
    border-radius: 16px;
    background: ${theme.palette.background.paper};
    color: ${theme.palette.text.primary};
    box-shadow: 0 16px 30px rgba(10, 12, 16, 0.35);

    .MuiTypography-root {
      margin-bottom: 12px;
    }
  `
)

export const GraphingKeypadGrid = styled(Box)(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;

    .MuiButtonBase-root:first-of-type {
      grid-column: span 3;
      background: ${theme.palette.secondary.main};
      color: ${theme.palette.text.primary};
    }

    .MuiButtonBase-root {
      background: rgba(10, 12, 16, 0.6);
      color: ${theme.palette.text.primary};
      font-weight: 600;
      border-radius: 12px;
    }
  `
)
