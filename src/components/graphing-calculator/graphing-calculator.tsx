import {
  GraphingCalculatorContainer,
  GraphingCalculatorLayout,
  GraphingPanel,
  GraphingSidebar,
} from "./graphing-calculator.styles";
import { GraphingCalculatorProvider } from "./context";
import { useGraphingCalculatorUi, useGraphingEngine } from "./hooks";
import { GraphCanvas, GraphLineList, GraphingKeypad, ViewportPanel } from "./components";

export const GraphingCalculator = () => {
  return (
    <GraphingCalculatorProvider>
      <GraphingCalculatorContent />
    </GraphingCalculatorProvider>
  );
};

const GraphingCalculatorContent = () => {
  const {
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
  } = useGraphingCalculatorUi();
  const renderData = useGraphingEngine({
    lines,
    shading,
    viewport,
    recomputeKey,
  });

  return (
    <GraphingCalculatorContainer>
      <GraphingCalculatorLayout>
        <GraphingSidebar>
            <GraphLineList
              lines={lines}
              selectedLineId={selectedLineId}
              onAddLine={addCartesianLine}
              onExpressionChange={setLineExpression}
              onSelectLine={selectLine}
              onToggleLine={toggleLineVisibility}
              onDeleteLine={deleteLine}
              onDeleteAll={deleteAllLines}
            />
          <GraphingKeypad
            onInsert={insertIntoSelectedLine}
            onReset={resetSelectedLine}
            onBackspace={backspaceSelectedLine}
          />
          <ViewportPanel viewport={viewport} onViewportChange={updateViewport} onRecompute={recompute} />
        </GraphingSidebar>
        <GraphingPanel>
          <GraphCanvas viewport={viewport} renderData={renderData} />
        </GraphingPanel>
      </GraphingCalculatorLayout>
    </GraphingCalculatorContainer>
  );
};
