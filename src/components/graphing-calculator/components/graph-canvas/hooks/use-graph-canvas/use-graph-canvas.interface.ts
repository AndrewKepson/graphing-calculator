import type { GraphPoint } from "../../../../types";

export type BuildSvgPathFromPoints = (points: GraphPoint[]) => string;

export interface UseGraphCanvasResult {
  buildSvgPathFromPoints: BuildSvgPathFromPoints;
}
