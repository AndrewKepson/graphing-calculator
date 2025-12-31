import { Card, Box } from '@mui/material'
import { styled, css } from '@mui/material/styles'

export const ViewportPanelCard = styled(Card)(
  ({ theme }) => css`
    padding: 16px;
    border-radius: 16px;
    background: ${theme.palette.background.paper};
    box-shadow: 0 12px 22px rgba(10, 12, 16, 0.3);
  `
)

export const ViewportPanelGrid = styled(Box)(
  ({ theme }) => css`
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    .MuiButton-contained {
      background: ${theme.palette.primary.main};
      color: ${theme.palette.primary.contrastText};
      text-transform: none;
      font-weight: 600;
    }
  `
)
