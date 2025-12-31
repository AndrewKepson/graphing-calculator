import type { GraphLine, GraphShading, GraphViewport } from '../../types'

export interface GraphingCalculatorActions {
  addLine: (line: GraphLine) => void
  updateLine: (lineId: string, changes: Partial<GraphLine>) => void
  removeLine: (lineId: string) => void
  addShading: (shading: GraphShading) => void
  updateShading: (shadingId: string, changes: Partial<GraphShading>) => void
  removeShading: (shadingId: string) => void
  setViewport: (viewport: GraphViewport) => void
  selectLine: (lineId?: string) => void
  recompute: () => void
}

export interface UseGraphingCalculatorResult {
  lines: GraphLine[]
  shading: GraphShading[]
  viewport: GraphViewport
  selectedLineId?: string
  recomputeKey: number
  actions: GraphingCalculatorActions
}
