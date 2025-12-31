import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { LineListCard, LineListHeader, LineListItem, LineListSwatch } from './line-list.styles';
import type { GraphLineListProps } from './line-list.interface';

export const GraphLineList = ({
  lines,
  selectedLineId,
  onAddLine,
  onDeleteAll,
  onExpressionChange,
  onSelectLine,
  onToggleLine,
  onDeleteLine,
}: GraphLineListProps) => {
  return (
    <LineListCard>
      <LineListHeader>
        <div>
          <Typography variant="h6">Lines</Typography>
          <Typography variant="body2" color="text.secondary">
            Edit expressions and toggle visibility
          </Typography>
        </div>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={onAddLine}>
            Add
          </Button>
          <Button variant="outlined" startIcon={<DeleteSweepIcon />} onClick={onDeleteAll}>
            Clear
          </Button>
        </Stack>
      </LineListHeader>
      <Stack spacing={1.5}>
        {lines.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Add a line to begin plotting.
          </Typography>
        ) : (
          lines.map((line) => {
            const isSelected = line.id === selectedLineId;
            return (
              <LineListItem key={line.id} $selected={isSelected} onClick={() => onSelectLine(line.id)}>
                <LineListSwatch $color={line.style.color} />
                <TextField
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={line.type === "cartesian" ? line.expression : line.label}
                  disabled={line.type !== "cartesian"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: "secondary.main", fontWeight: 700 }}>
                        f(x)=
                      </InputAdornment>
                    ),
                  }}
                  onChange={(event) => onExpressionChange(line.id, event.target.value)}
                  onClick={(event) => event.stopPropagation()}
                />
                <Switch
                  checked={line.visible}
                  onChange={() => onToggleLine(line.id)}
                  onClick={(event) => event.stopPropagation()}
                  size="small"
                />
                <IconButton
                  aria-label="Delete line"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteLine(line.id);
                  }}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </LineListItem>
            );
          })
        )}
      </Stack>
    </LineListCard>
  );
};
