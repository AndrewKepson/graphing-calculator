import { Box, Typography } from '@mui/material'
import { styled, css } from '@mui/material/styles'

export const GraphCanvasContainer = styled(Box)(
  () => css`
    display: flex;
    flex-direction: column;
    padding: 16px 18px 18px;
    height: 100%;
    gap: 12px;
  `
)

export const GraphCanvasTitle = styled(Typography)(
  ({ theme }) => css`
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${theme.palette.text.secondary};
    font-weight: 600;
  `
)

export const GraphCanvasSvg = styled('svg')(
  ({ theme }) => css`
    flex: 1;
    width: 100%;
    background: radial-gradient(
      circle at top,
      #1a202c 0%,
      ${theme.palette.background.default} 100%
    );
    border-radius: 16px;
    box-shadow: inset 0 0 0 1px ${theme.palette.divider};
  `
)
