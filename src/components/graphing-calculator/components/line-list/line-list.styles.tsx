import { Box, Card } from '@mui/material'
import { styled, css } from '@mui/material/styles'

export const LineListCard = styled(Card)(
  ({ theme }) => css`
    padding: 16px;
    border-radius: 16px;
    background: ${theme.palette.background.paper};
    box-shadow: 0 12px 24px rgba(10, 12, 16, 0.3);
  `
)

export const LineListHeader = styled(Box)(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .MuiButton-contained {
      background: ${theme.palette.primary.main};
      color: ${theme.palette.primary.contrastText};
      text-transform: none;
      font-weight: 600;
      border-radius: 10px;
      padding: 6px 16px;
    }

    .MuiButton-outlined {
      border-color: ${theme.palette.divider};
      color: ${theme.palette.text.primary};
      text-transform: none;
      font-weight: 600;
      border-radius: 10px;
      padding: 6px 16px;
    }
  `
)

export const LineListItem = styled(Box)<{ $selected: boolean }>(
  ({ $selected, theme }) => css`
    display: grid;
    grid-template-columns: 14px 1fr auto auto;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid ${$selected ? theme.palette.primary.main : 'transparent'};
    background: ${$selected ? 'rgba(20, 24, 31, 0.8)' : 'rgba(20, 24, 31, 0.5)'};
    cursor: pointer;
  `
)

export const LineListSwatch = styled(Box)<{ $color: string }>(
  ({ $color }) => css`
    width: 12px;
    height: 12px;
    border-radius: 999px;
    background: ${$color};
  `
)
