import type { GraphLine, GraphRenderData, GraphShading, GraphViewport } from "../../types";

export interface UseGraphingEngineArgs {
    lines: GraphLine[];
    shading: GraphShading[];
    viewport: GraphViewport;
    recomputeKey?: number;
    samples?: number;
}

export type UseGraphingEngineResult = GraphRenderData;
