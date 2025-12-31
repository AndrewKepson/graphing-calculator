import type { ChangeEvent } from "react";
import { Button, TextField, Typography } from "@mui/material";
import type { GraphViewport } from "../../types";
import { ViewportPanelCard, ViewportPanelGrid } from "./viewport-panel.styles";
import type { ViewportPanelProps } from "./viewport-panel.interface";

const toNumber = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const ViewportPanel = ({ viewport, onViewportChange, onRecompute }: ViewportPanelProps) => {
  const handleChange = (key: keyof GraphViewport) => (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = toNumber(event.target.value, viewport[key]);
    onViewportChange({ ...viewport, [key]: nextValue });
  };

  return (
    <ViewportPanelCard>
      <Typography variant="h6">Viewport</Typography>
      <ViewportPanelGrid>
        <TextField label="X min" size="small" value={viewport.xMin} onChange={handleChange("xMin")} />
        <TextField label="X max" size="small" value={viewport.xMax} onChange={handleChange("xMax")} />
        <TextField label="Y min" size="small" value={viewport.yMin} onChange={handleChange("yMin")} />
        <TextField label="Y max" size="small" value={viewport.yMax} onChange={handleChange("yMax")} />
        <div />
        <Button variant="contained" onClick={onRecompute}>
          Recompute
        </Button>
      </ViewportPanelGrid>
    </ViewportPanelCard>
  );
};
