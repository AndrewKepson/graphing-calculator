import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useGraphingCalculator } from "../hooks";
import type { UseGraphingCalculatorResult } from "../hooks/use-graphing-calculator";

const GraphingCalculatorContext = createContext<UseGraphingCalculatorResult | undefined>(undefined);

export const GraphingCalculatorProvider = ({ children }: { children: ReactNode }) => {
  const value = useGraphingCalculator();
  return <GraphingCalculatorContext.Provider value={value}>{children}</GraphingCalculatorContext.Provider>;
};

export const useGraphingCalculatorContext = () => {
  const context = useContext(GraphingCalculatorContext);
  if (!context) {
    throw new Error("useGraphingCalculatorContext must be used within GraphingCalculatorProvider");
  }
  return context;
};
