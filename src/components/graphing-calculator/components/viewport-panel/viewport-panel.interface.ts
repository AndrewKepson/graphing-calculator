import type { GraphViewport } from "../../types";

export interface ViewportPanelProps {
  viewport: GraphViewport;
  onViewportChange: (viewport: GraphViewport) => void;
  onRecompute: () => void;
}
