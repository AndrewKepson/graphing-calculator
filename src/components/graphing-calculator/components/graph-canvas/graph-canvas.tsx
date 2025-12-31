import { alpha, useTheme } from "@mui/material/styles";
import { GraphCanvasContainer, GraphCanvasSvg, GraphCanvasTitle } from "./graph-canvas.styles";
import type { GraphCanvasProps } from "./graph-canvas.interface";
import { useGraphCanvas } from "./hooks";

export const GraphCanvas = ({ viewport, renderData }: GraphCanvasProps) => {
  const theme = useTheme();
  const { buildSvgPathFromPoints } = useGraphCanvas();
  const { gridLines, polylines, shadingPolygons } = renderData;
  const viewBox = [viewport.xMin, -viewport.yMax, viewport.xMax - viewport.xMin, viewport.yMax - viewport.yMin].join(
    " "
  );

  return (
    <GraphCanvasContainer>
      <GraphCanvasTitle>Plot</GraphCanvasTitle>
      <GraphCanvasSvg viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
        {shadingPolygons.map((polygon) => (
          <path
            key={polygon.id}
            d={`${buildSvgPathFromPoints(polygon.points)} Z`}
            fill={polygon.color}
            fillOpacity={polygon.opacity}
            stroke="none"
          />
        ))}
        {gridLines.map((line) => {
          const stroke = line.isAxis
            ? alpha(theme.palette.primary.main, 0.55)
            : alpha(theme.palette.primary.main, 0.18);
          const strokeWidth = line.isAxis ? 0.2 : 0.07;
          return (
            <path
              key={line.id}
              d={buildSvgPathFromPoints(line.points)}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {polylines.map((line) => (
          <path
            key={line.id}
            d={buildSvgPathFromPoints(line.points)}
            fill="none"
            stroke={line.style.color}
            strokeWidth={line.style.width + 0.6}
            strokeOpacity={Math.max(line.style.opacity, 0.9)}
            strokeDasharray={line.style.dashed ? "4 4" : undefined}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </GraphCanvasSvg>
    </GraphCanvasContainer>
  );
};
