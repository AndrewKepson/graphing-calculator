import { compileExpression, evaluateExpression } from "../expression-utils";

export interface ValidationIssue {
  label: string;
  message: string;
}

const nearlyEqual = (a: number, b: number, epsilon = 1e-6) => Math.abs(a - b) <= epsilon;

export const runExpressionUtilsValidation = (): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  const cases: Array<{
    label: string;
    expression: string;
    variables?: Record<string, number>;
    expected: number;
  }> = [
    { label: "Linear", expression: "2*x+1", variables: { x: 3 }, expected: 7 },
    { label: "Unary minus", expression: "-x", variables: { x: 4 }, expected: -4 },
    { label: "Exponent", expression: "x^2", variables: { x: 5 }, expected: 25 },
    { label: "Pi constant", expression: "pi", expected: Math.PI },
    { label: "Trig", expression: "sin(pi/2)", expected: 1 },
  ];

  cases.forEach((testCase) => {
    const value = evaluateExpression(testCase.expression, testCase.variables ?? {});
    if (value === undefined || !nearlyEqual(value, testCase.expected)) {
      issues.push({
        label: testCase.label,
        message: `Expected ${testCase.expected} for "${testCase.expression}", got ${String(value)}`,
      });
    }
  });

  const mismatch = compileExpression("(");
  if (!mismatch.error) {
    issues.push({
      label: "Mismatched parentheses",
      message: 'Expected parse error for "("',
    });
  }

  const unsupportedArgs = compileExpression("max(1,2)");
  if (!unsupportedArgs.error) {
    issues.push({
      label: "Multiple arguments",
      message: "Expected parse error for multi-arg function",
    });
  }

  return issues;
};
