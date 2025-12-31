export type GraphingCalculatorOperator = "+" | "-" | "*" | "/" | "^" | "(" | ")" | ",";

export type GraphFunctionType = "cartesian" | "parametric" | "polar" | "implicit";

export interface GraphLineDomain {
  min?: number;
  max?: number;
}

export interface GraphLineStyle {
  color: string;
  width: number;
  opacity: number;
  dashed: boolean;
}

export interface GraphLineBase {
  id: string;
  label: string;
  visible: boolean;
  domain?: GraphLineDomain;
  style: GraphLineStyle;
}

export interface GraphCartesianLine extends GraphLineBase {
  type: "cartesian";
  expression: string;
}

export interface GraphParametricLine extends GraphLineBase {
  type: "parametric";
  xExpression: string;
  yExpression: string;
}

export interface GraphPolarLine extends GraphLineBase {
  type: "polar";
  rExpression: string;
}

export interface GraphImplicitLine extends GraphLineBase {
  type: "implicit";
  expression: string;
}

export type GraphLine = GraphCartesianLine | GraphParametricLine | GraphPolarLine | GraphImplicitLine;

export interface GraphViewport {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export type GraphShadingKind = "between-lines" | "inequality" | "above" | "below";

export interface GraphShading {
  id: string;
  kind: GraphShadingKind;
  lineIds: string[];
  color: string;
  opacity: number;
  expression?: string;
}

export interface GraphingCalculatorState {
  lines: GraphLine[];
  shading: GraphShading[];
  viewport: GraphViewport;
  selectedLineId?: string;
}

export interface GraphPoint {
  x: number;
  y: number;
}

export interface GraphPolyline {
  id: string;
  lineId: string;
  points: GraphPoint[];
  style: GraphLineStyle;
}

export interface GraphGridLine {
  id: string;
  points: GraphPoint[];
  isAxis: boolean;
}

export interface GraphPolygon {
  id: string;
  shadingId: string;
  points: GraphPoint[];
  color: string;
  opacity: number;
}

export interface GraphRenderData {
  gridLines: GraphGridLine[];
  polylines: GraphPolyline[];
  shadingPolygons: GraphPolygon[];
}
