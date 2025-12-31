import { useMemo } from 'react'
import {
  compileExpression,
  evaluateCompiledExpression,
} from '../expression-utils'
import type {
  UseGraphingEngineArgs,
  UseGraphingEngineResult,
} from './use-graphing-engine.interface'
import type {
  GraphLine,
  GraphRenderData,
  GraphGridLine,
  GraphPoint,
  GraphPolyline,
  GraphShading,
  GraphViewport,
  GraphPolygon,
} from '../../types'

const DEFAULT_SAMPLES = 400
const DEFAULT_POLAR_MIN = 0
const DEFAULT_POLAR_MAX = Math.PI * 2

const getDomain = (line: GraphLine, viewport: GraphViewport) => {
  if (line.domain?.min !== undefined || line.domain?.max !== undefined) {
    return {
      min: line.domain?.min ?? viewport.xMin,
      max: line.domain?.max ?? viewport.xMax,
    }
  }

  if (line.type === 'parametric' || line.type === 'polar') {
    return { min: DEFAULT_POLAR_MIN, max: DEFAULT_POLAR_MAX }
  }

  return { min: viewport.xMin, max: viewport.xMax }
}

const getGridStep = (range: number) => {
  const raw = range / 10
  if (raw <= 0) return 1
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)))
  const normalized = raw / magnitude
  if (normalized >= 5) return 5 * magnitude
  if (normalized >= 2) return 2 * magnitude
  return magnitude
}

const buildGridLines = (viewport: GraphViewport): GraphGridLine[] => {
  const xRange = viewport.xMax - viewport.xMin
  const yRange = viewport.yMax - viewport.yMin
  const xStep = getGridStep(xRange)
  const yStep = getGridStep(yRange)

  const gridLines: GraphGridLine[] = []
  const xStart = Math.ceil(viewport.xMin / xStep) * xStep
  const xEnd = Math.floor(viewport.xMax / xStep) * xStep
  const yStart = Math.ceil(viewport.yMin / yStep) * yStep
  const yEnd = Math.floor(viewport.yMax / yStep) * yStep

  let id = 0
  for (let x = xStart; x <= xEnd; x += xStep) {
    const isAxis = Math.abs(x) < Number.EPSILON
    gridLines.push({
      id: `grid-x-${id}`,
      isAxis,
      points: [
        { x, y: viewport.yMin },
        { x, y: viewport.yMax },
      ],
    })
    id += 1
  }

  for (let y = yStart; y <= yEnd; y += yStep) {
    const isAxis = Math.abs(y) < Number.EPSILON
    gridLines.push({
      id: `grid-y-${id}`,
      isAxis,
      points: [
        { x: viewport.xMin, y },
        { x: viewport.xMax, y },
      ],
    })
    id += 1
  }

  return gridLines
}

const buildPolylineSegments = (
  points: GraphPoint[],
  lineId: string,
  style: GraphPolyline['style']
) => {
  const polylines: GraphPolyline[] = []
  let segment: GraphPoint[] = []

  points.forEach((point, index) => {
    if (Number.isFinite(point.y)) {
      segment.push(point)
    } else if (segment.length > 1) {
      polylines.push({
        id: `${lineId}-${polylines.length}`,
        lineId,
        points: segment,
        style,
      })
      segment = []
    } else {
      segment = []
    }

    if (index === points.length - 1 && segment.length > 1) {
      polylines.push({
        id: `${lineId}-${polylines.length}`,
        lineId,
        points: segment,
        style,
      })
    }
  })

  return polylines
}

const parseInequalityExpression = (expression: string) => {
  const operators = ['<=', '>=', '<', '>'] as const
  const match = operators.find((op) => expression.includes(op))
  if (!match) return undefined
  const index = expression.indexOf(match)
  if (index === -1) return undefined
  const left = expression.slice(0, index).trim()
  const right = expression.slice(index + match.length).trim()
  if (!left || !right) return undefined

  const leftLower = left.toLowerCase()
  const rightLower = right.toLowerCase()
  const isLeftY = leftLower === 'y'
  const isRightY = rightLower === 'y'
  if (!isLeftY && !isRightY) return undefined

  const inclusive = match === '<=' || match === '>='
  if (isLeftY) {
    return {
      boundaryExpression: right,
      direction: match.includes('<') ? 'below' : 'above',
      inclusive,
    } as const
  }

  return {
    boundaryExpression: left,
    direction: match.includes('<') ? 'above' : 'below',
    inclusive,
  } as const
}

const buildInequalityShading = (
  points: GraphPoint[],
  viewport: GraphViewport,
  lineId: string,
  color: string,
  opacity: number,
  direction: 'above' | 'below'
): GraphPolygon[] => {
  const polygons: GraphPolygon[] = []
  let segment: GraphPoint[] = []

  const commitSegment = () => {
    if (segment.length < 2) {
      segment = []
      return
    }
    const first = segment[0]
    const last = segment[segment.length - 1]
    if (!first || !last) {
      segment = []
      return
    }
    const capY = direction === 'below' ? viewport.yMin : viewport.yMax
    const polygon: GraphPolygon = {
      id: `${lineId}-shade-${polygons.length}`,
      shadingId: lineId,
      color,
      opacity,
      points: [
        ...segment,
        { x: last.x, y: capY },
        { x: first.x, y: capY },
      ],
    }
    polygons.push(polygon)
    segment = []
  }

  points.forEach((point, index) => {
    if (Number.isFinite(point.y)) {
      segment.push(point)
    } else {
      commitSegment()
    }

    if (index === points.length - 1) {
      commitSegment()
    }
  })

  return polygons
}

const sampleCartesianLine = (
  line: Extract<GraphLine, { type: 'cartesian' }>,
  viewport: GraphViewport,
  samples: number
): { polylines: GraphPolyline[]; shadingPolygons: GraphPolygon[] } => {
  const inequality = parseInequalityExpression(line.expression)
  const expression = inequality?.boundaryExpression ?? line.expression
  const compiled = compileExpression(expression)
  if (compiled.error) return { polylines: [], shadingPolygons: [] }
  const domain = getDomain(line, viewport)
  const step = (domain.max - domain.min) / samples

  const points: GraphPoint[] = []
  for (let i = 0; i <= samples; i += 1) {
    const x = domain.min + step * i
    const y = evaluateCompiledExpression(compiled, { x })
    points.push({ x, y: y ?? Number.NaN })
  }

  const style = inequality
    ? { ...line.style, dashed: !inequality.inclusive }
    : line.style
  const polylines = buildPolylineSegments(points, line.id, style)

  if (!inequality) {
    return { polylines, shadingPolygons: [] }
  }

  const shadingPolygons = buildInequalityShading(
    points,
    viewport,
    line.id,
    line.style.color,
    0.14,
    inequality.direction
  )

  return { polylines, shadingPolygons }
}

const sampleParametricLine = (
  line: Extract<GraphLine, { type: 'parametric' }>,
  viewport: GraphViewport,
  samples: number
): { polylines: GraphPolyline[]; shadingPolygons: GraphPolygon[] } => {
  const compiledX = compileExpression(line.xExpression)
  const compiledY = compileExpression(line.yExpression)
  if (compiledX.error || compiledY.error) {
    return { polylines: [], shadingPolygons: [] }
  }
  const domain = getDomain(line, viewport)
  const step = (domain.max - domain.min) / samples

  const points: GraphPoint[] = []
  for (let i = 0; i <= samples; i += 1) {
    const t = domain.min + step * i
    const x = evaluateCompiledExpression(compiledX, { t })
    const y = evaluateCompiledExpression(compiledY, { t })
    points.push({ x: x ?? Number.NaN, y: y ?? Number.NaN })
  }

  return { polylines: buildPolylineSegments(points, line.id, line.style), shadingPolygons: [] }
}

const samplePolarLine = (
  line: Extract<GraphLine, { type: 'polar' }>,
  viewport: GraphViewport,
  samples: number
): { polylines: GraphPolyline[]; shadingPolygons: GraphPolygon[] } => {
  const compiled = compileExpression(line.rExpression)
  if (compiled.error) return { polylines: [], shadingPolygons: [] }
  const domain = getDomain(line, viewport)
  const step = (domain.max - domain.min) / samples

  const points: GraphPoint[] = []
  for (let i = 0; i <= samples; i += 1) {
    const t = domain.min + step * i
    const r = evaluateCompiledExpression(compiled, { t })
    if (!isValidNumber(r)) {
      points.push({ x: Number.NaN, y: Number.NaN })
      continue
    }
    const x = r * Math.cos(t)
    const y = r * Math.sin(t)
    points.push({ x, y })
  }

  return { polylines: buildPolylineSegments(points, line.id, line.style), shadingPolygons: [] }
}

const buildLinePolylines = (
  line: GraphLine,
  viewport: GraphViewport,
  samples: number
) => {
  if (!line.visible) return { polylines: [], shadingPolygons: [] }
  if (line.type === 'cartesian') return sampleCartesianLine(line, viewport, samples)
  if (line.type === 'parametric')
    return sampleParametricLine(line, viewport, samples)
  if (line.type === 'polar') return samplePolarLine(line, viewport, samples)
  return { polylines: [], shadingPolygons: [] }
}

const buildBetweenLinesShading = (
  shading: GraphShading,
  lines: GraphLine[],
  viewport: GraphViewport,
  samples: number
): GraphPolygon[] => {
  const [firstId, secondId] = shading.lineIds
  if (!firstId || !secondId) return []

  const firstLine = lines.find((line) => line.id === firstId)
  const secondLine = lines.find((line) => line.id === secondId)
  if (!firstLine || !secondLine) return []
  if (firstLine.type !== 'cartesian' || secondLine.type !== 'cartesian') return []

  const compiledA = compileExpression(firstLine.expression)
  const compiledB = compileExpression(secondLine.expression)
  if (compiledA.error || compiledB.error) return []

  const domain = getDomain(firstLine, viewport)
  const step = (domain.max - domain.min) / samples

  const top: GraphPoint[] = []
  const bottom: GraphPoint[] = []

  for (let i = 0; i <= samples; i += 1) {
    const x = domain.min + step * i
    const yA = evaluateCompiledExpression(compiledA, { x })
    const yB = evaluateCompiledExpression(compiledB, { x })
    if (isValidNumber(yA)) top.push({ x, y: yA })
    if (isValidNumber(yB)) bottom.push({ x, y: yB })
  }

  if (top.length < 2 || bottom.length < 2) return []

  const polygon: GraphPolygon = {
    id: `shade-${shading.id}`,
    shadingId: shading.id,
    color: shading.color,
    opacity: shading.opacity,
    points: [...top, ...bottom.reverse()],
  }

  return [polygon]
}

const buildShading = (
  shading: GraphShading[],
  lines: GraphLine[],
  viewport: GraphViewport,
  samples: number
) => {
  const polygons: GraphPolygon[] = []
  shading.forEach((item) => {
    if (item.kind === 'between-lines') {
      polygons.push(
        ...buildBetweenLinesShading(item, lines, viewport, samples)
      )
    }
  })
  return polygons
}

export const useGraphingEngine = ({
  lines,
  shading,
  viewport,
  recomputeKey = 0,
  samples = DEFAULT_SAMPLES,
}: UseGraphingEngineArgs): UseGraphingEngineResult => {
  return useMemo(() => {
    const gridLines = buildGridLines(viewport)
    const lineRenderData = lines.map((line) =>
      buildLinePolylines(line, viewport, samples)
    )
    const polylines = lineRenderData.flatMap((item) => item.polylines)
    const shadingPolygons = [
      ...buildShading(shading, lines, viewport, samples),
      ...lineRenderData.flatMap((item) => item.shadingPolygons),
    ]

    return { gridLines, polylines, shadingPolygons }
  }, [lines, shading, viewport, samples, recomputeKey])
}
const isValidNumber = (value: number | undefined): value is number =>
  value !== undefined && Number.isFinite(value)
