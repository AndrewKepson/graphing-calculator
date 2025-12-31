import { useCallback, useEffect, useMemo, useState } from "react";
import type { GraphLine, GraphShading, GraphViewport } from "../../types";
import type { UseGraphingCalculatorResult } from "./use-graphing-calculator.interface";

const DEFAULT_VIEWPORT: GraphViewport = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

const STORAGE_KEY = "graphing-calculator.lines";

const loadStoredLines = (): GraphLine[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GraphLine[]) : [];
  } catch {
    return [];
  }
};

const persistLines = (lines: GraphLine[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Ignore storage failures (quota/private mode).
  }
};

export const useGraphingCalculator = (): UseGraphingCalculatorResult => {
  const [lines, setLines] = useState<GraphLine[]>(() => loadStoredLines());
  const [shading, setShading] = useState<GraphShading[]>([]);
  const [viewport, setViewport] = useState<GraphViewport>(DEFAULT_VIEWPORT);
  const [selectedLineId, setSelectedLineId] = useState<string | undefined>(undefined);
  const [recomputeKey, setRecomputeKey] = useState(0);

  const addLine = useCallback((line: GraphLine) => {
    setLines((prev) => [...prev, line]);
  }, []);

  const resetCalculator = useCallback(() => {
    setLines([]);
    setShading([]);
    setViewport(DEFAULT_VIEWPORT);
    setSelectedLineId(undefined);
    setRecomputeKey(0);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const updateLine = useCallback((lineId: string, changes: Partial<GraphLine>) => {
    setLines((prev) =>
      prev.map((line) => (line.id === lineId ? ({ ...line, ...changes, id: line.id } as GraphLine) : line))
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((line) => line.id !== lineId));
  }, []);

  const addShading = useCallback((item: GraphShading) => {
    setShading((prev) => [...prev, item]);
  }, []);

  const updateShading = useCallback((shadingId: string, changes: Partial<GraphShading>) => {
    setShading((prev) =>
      prev.map((item) => (item.id === shadingId ? ({ ...item, ...changes, id: item.id } as GraphShading) : item))
    );
  }, []);

  const removeShading = useCallback((shadingId: string) => {
    setShading((prev) => prev.filter((item) => item.id !== shadingId));
  }, []);

  const setViewportSafe = useCallback((next: GraphViewport) => {
    setViewport(next);
  }, []);

  const selectLine = useCallback((lineId?: string) => {
    setSelectedLineId(lineId);
  }, []);

  const recompute = useCallback(() => {
    setRecomputeKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    persistLines(lines);
  }, [lines]);

  const actions = useMemo(
    () => ({
      addLine,
      updateLine,
      removeLine,
      resetCalculator,
      addShading,
      updateShading,
      removeShading,
      setViewport: setViewportSafe,
      selectLine,
      recompute,
    }),
    [
      addLine,
      updateLine,
      removeLine,
      resetCalculator,
      addShading,
      updateShading,
      removeShading,
      setViewportSafe,
      selectLine,
      recompute,
    ]
  );

  return {
    lines,
    shading,
    viewport,
    selectedLineId,
    recomputeKey,
    actions,
  };
};
