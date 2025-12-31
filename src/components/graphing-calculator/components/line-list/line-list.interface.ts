import type { GraphLine } from "../../types";

export interface GraphLineListProps {
  lines: GraphLine[];
  selectedLineId?: string;
  onAddLine: () => void;
  onDeleteAll: () => void;
  onExpressionChange: (lineId: string, expression: string) => void;
  onSelectLine: (lineId?: string) => void;
  onToggleLine: (lineId: string) => void;
  onDeleteLine: (lineId: string) => void;
}
