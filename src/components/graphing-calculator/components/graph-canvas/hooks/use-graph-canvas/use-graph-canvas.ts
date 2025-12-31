import type { BuildSvgPathFromPoints, UseGraphCanvasResult } from "./use-graph-canvas.interface";

export const buildSvgPathFromPoints: BuildSvgPathFromPoints = (points) =>
  points
    .map((point, index) => {
      const x = point.x;
      const y = -point.y;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

export const useGraphCanvas = (): UseGraphCanvasResult => ({
  buildSvgPathFromPoints,
});
