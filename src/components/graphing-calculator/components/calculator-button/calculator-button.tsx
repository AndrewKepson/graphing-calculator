import { StyledCalculatorButton } from "./calculator-button.styles";
import type { CalculatorButtonProps } from "./calculator-button.interface";

export const CalculatorButton = ({ children, ...buttonProps }: CalculatorButtonProps) => {
  return <StyledCalculatorButton {...buttonProps}>{children}</StyledCalculatorButton>;
};
