import type { GraphLine, GraphShading, GraphViewport } from '../../types'

export interface UseGraphingCalculatorUiResult {
  lines: GraphLine[]
  shading: GraphShading[]
  viewport: GraphViewport
  selectedLineId?: string
  recomputeKey: number
  addCartesianLine: () => void
  setLineExpression: (lineId: string, expression: string) => void
  toggleLineVisibility: (lineId: string) => void
  deleteLine: (lineId: string) => void
  deleteAllLines: () => void
  selectLine: (lineId?: string) => void
  updateViewport: (viewport: GraphViewport) => void
  insertIntoSelectedLine: (symbol: string) => void
  resetSelectedLine: () => void
  backspaceSelectedLine: () => void
  recompute: () => void
}
