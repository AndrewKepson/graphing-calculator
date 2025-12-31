import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useGraphingCalculatorContext } from '../../context/graphing-calculator-context'
import type {
  GraphCartesianLine,
  GraphLineStyle,
  GraphViewport,
} from '../../types'
import type { UseGraphingCalculatorUiResult } from './use-graphing-calculator-ui.interface'

const DEFAULT_LINE_COLORS = ['#1d4ed8', '#9333ea', '#ea580c', '#0f766e']
const FALLBACK_LINE_COLOR = '#1d4ed8'

const createLineStyle = (index: number): GraphLineStyle => ({
  color: DEFAULT_LINE_COLORS[index % DEFAULT_LINE_COLORS.length] ?? FALLBACK_LINE_COLOR,
  width: 2,
  opacity: 1,
  dashed: false,
})

const createLineLabel = (index: number) => `Line ${index}`

export const useGraphingCalculatorUi = (): UseGraphingCalculatorUiResult => {
  const { lines, shading, viewport, selectedLineId, recomputeKey, actions } =
    useGraphingCalculatorContext()
  const counterRef = useRef(lines.length + 1)
  const initializedRef = useRef(false)

  const addCartesianLine = useCallback(() => {
    const index = counterRef.current
    const line: GraphCartesianLine = {
      id: `line-${index}`,
      label: createLineLabel(index),
      visible: true,
      type: 'cartesian',
      expression: 'x',
      style: createLineStyle(index - 1),
    }
    counterRef.current += 1
    actions.addLine(line)
    actions.selectLine(line.id)
  }, [actions])

  useEffect(() => {
    if (initializedRef.current || lines.length > 0) return
    initializedRef.current = true
    addCartesianLine()
  }, [addCartesianLine, lines.length])

  const setLineExpression = useCallback(
    (lineId: string, expression: string) => {
      actions.updateLine(lineId, { expression } as Partial<GraphCartesianLine>)
    },
    [actions]
  )

  const toggleLineVisibility = useCallback(
    (lineId: string) => {
      const line = lines.find((item) => item.id === lineId)
      if (!line) return
      actions.updateLine(lineId, { visible: !line.visible })
    },
    [actions, lines]
  )

  const deleteLine = useCallback(
    (lineId: string) => {
      actions.removeLine(lineId)
      if (selectedLineId === lineId) {
        actions.selectLine(undefined)
      }
    },
    [actions, selectedLineId]
  )

  const deleteAllLines = useCallback(() => {
    actions.resetCalculator()
    counterRef.current = 1
    addCartesianLine()
  }, [actions, addCartesianLine])

  const selectLine = useCallback(
    (lineId?: string) => {
      actions.selectLine(lineId)
    },
    [actions]
  )

  const insertIntoSelectedLine = useCallback(
    (symbol: string) => {
      if (!selectedLineId) return
      const line = lines.find((item) => item.id === selectedLineId)
      if (!line || line.type !== 'cartesian') return
      const nextExpression = `${line.expression}${symbol}`
      actions.updateLine(line.id, {
        expression: nextExpression,
      } as Partial<GraphCartesianLine>)
    },
    [actions, lines, selectedLineId]
  )

  const resetSelectedLine = useCallback(() => {
    if (!selectedLineId) return
    const line = lines.find((item) => item.id === selectedLineId)
    if (!line || line.type !== 'cartesian') return
    actions.updateLine(line.id, {
      expression: '',
    } as Partial<GraphCartesianLine>)
  }, [actions, lines, selectedLineId])

  const backspaceSelectedLine = useCallback(() => {
    if (!selectedLineId) return
    const line = lines.find((item) => item.id === selectedLineId)
    if (!line || line.type !== 'cartesian') return
    if (!line.expression) return
    actions.updateLine(line.id, {
      expression: line.expression.slice(0, -1),
    } as Partial<GraphCartesianLine>)
  }, [actions, lines, selectedLineId])

  const updateViewport = useCallback(
    (next: GraphViewport) => {
      actions.setViewport(next)
    },
    [actions]
  )

  const recompute = useCallback(() => {
    actions.recompute()
  }, [actions])

  return useMemo(
    () => ({
      lines,
      shading,
      viewport,
      selectedLineId,
      recomputeKey,
      addCartesianLine,
      setLineExpression,
      toggleLineVisibility,
      deleteLine,
      deleteAllLines,
      selectLine,
      updateViewport,
      insertIntoSelectedLine,
      resetSelectedLine,
      backspaceSelectedLine,
      recompute,
    }),
    [
      lines,
      shading,
      viewport,
      selectedLineId,
      recomputeKey,
      addCartesianLine,
      setLineExpression,
      toggleLineVisibility,
      deleteLine,
      deleteAllLines,
      selectLine,
      updateViewport,
      insertIntoSelectedLine,
      resetSelectedLine,
      backspaceSelectedLine,
      recompute,
    ]
  )
}
