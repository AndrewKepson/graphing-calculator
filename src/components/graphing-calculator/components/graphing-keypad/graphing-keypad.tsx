import BackspaceIcon from "@mui/icons-material/Backspace";
import { Typography } from "@mui/material";
import { GraphingKeypadGrid, GraphingKeypadWrapper } from "./graphing-keypad.styles";
import { CalculatorButton } from "../calculator-button";
import { KEYS } from "./graphing-keypad.constants";
import type { GraphingKeypadProps } from "./graphing-keypad.interface";

export const GraphingKeypad = ({ onInsert, onReset, onBackspace }: GraphingKeypadProps) => {
  return (
    <GraphingKeypadWrapper>
      <Typography variant="h6">Keypad</Typography>
      <GraphingKeypadGrid>
        <CalculatorButton onClick={onReset}>Reset</CalculatorButton>
        <CalculatorButton onClick={onBackspace} aria-label="Backspace">
          <BackspaceIcon fontSize="small" />
        </CalculatorButton>
        {KEYS.map((key) => (
          <CalculatorButton key={key} onClick={() => onInsert(key)}>
            {key}
          </CalculatorButton>
        ))}
      </GraphingKeypadGrid>
    </GraphingKeypadWrapper>
  );
};
