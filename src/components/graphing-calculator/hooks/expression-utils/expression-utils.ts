export type ExpressionTokenType = "number" | "operator" | "identifier" | "function" | "paren" | "comma";

export interface ExpressionToken {
  type: ExpressionTokenType;
  value: string;
  index: number;
}

export interface ExpressionParseError {
  message: string;
  index: number;
}

export interface CompiledExpression {
  rpn: ExpressionToken[];
  error?: ExpressionParseError;
}

const OPERATORS: Record<string, { precedence: number; associativity: "left" | "right"; argCount: number }> = {
  "+": { precedence: 1, associativity: "left", argCount: 2 },
  "-": { precedence: 1, associativity: "left", argCount: 2 },
  "*": { precedence: 2, associativity: "left", argCount: 2 },
  "/": { precedence: 2, associativity: "left", argCount: 2 },
  "^": { precedence: 3, associativity: "right", argCount: 2 },
  neg: { precedence: 4, associativity: "right", argCount: 1 },
};

const readUnaryArg = (args: number[]) => args[0] ?? NaN;

const FUNCTIONS: Record<string, (args: number[]) => number> = {
  sin: (args) => Math.sin(readUnaryArg(args)),
  cos: (args) => Math.cos(readUnaryArg(args)),
  tan: (args) => Math.tan(readUnaryArg(args)),
  asin: (args) => Math.asin(readUnaryArg(args)),
  acos: (args) => Math.acos(readUnaryArg(args)),
  atan: (args) => Math.atan(readUnaryArg(args)),
  sqrt: (args) => Math.sqrt(readUnaryArg(args)),
  abs: (args) => Math.abs(readUnaryArg(args)),
  ln: (args) => Math.log(readUnaryArg(args)),
  log: (args) => Math.log10(readUnaryArg(args)),
  exp: (args) => Math.exp(readUnaryArg(args)),
  floor: (args) => Math.floor(readUnaryArg(args)),
  ceil: (args) => Math.ceil(readUnaryArg(args)),
  round: (args) => Math.round(readUnaryArg(args)),
  sign: (args) => Math.sign(readUnaryArg(args)),
};

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

const isDigit = (char: string) => char >= "0" && char <= "9";
const isAlpha = (char: string) => (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");

export const tokenizeExpression = (expression: string): ExpressionToken[] => {
  const tokens: ExpressionToken[] = [];
  let index = 0;

  while (index < expression.length) {
    const char = expression.charAt(index);

    if (char === " " || char === "\t" || char === "\n") {
      index += 1;
      continue;
    }

    const nextChar = expression.charAt(index + 1);
    if (isDigit(char) || (char === "." && isDigit(nextChar))) {
      const start = index;
      let value = char;
      index += 1;
      while (index < expression.length) {
        const next = expression.charAt(index);
        if (isDigit(next) || next === ".") {
          value += next;
          index += 1;
        } else {
          break;
        }
      }
      tokens.push({ type: "number", value, index: start });
      continue;
    }

    if (isAlpha(char)) {
      const start = index;
      let value = char;
      index += 1;
      while (index < expression.length) {
        const next = expression.charAt(index);
        if (isAlpha(next) || isDigit(next) || next === "_") {
          value += next;
          index += 1;
        } else {
          break;
        }
      }
      tokens.push({ type: "identifier", value, index: start });
      continue;
    }

    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char, index });
      index += 1;
      continue;
    }

    if (char === ",") {
      tokens.push({ type: "comma", value: char, index });
      index += 1;
      continue;
    }

    if (OPERATORS[char]) {
      tokens.push({ type: "operator", value: char, index });
      index += 1;
      continue;
    }

    tokens.push({ type: "identifier", value: char, index });
    index += 1;
  }

  return tokens;
};

const insertImplicitMultiplication = (tokens: ExpressionToken[]) => {
  const result: ExpressionToken[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const current = tokens[i];
    const previous = result[result.length - 1];
    if (!previous) {
      result.push(current);
      continue;
    }

    const prevIsValue =
      previous.type === "number" ||
      previous.type === "identifier" ||
      (previous.type === "paren" && previous.value === ")");
    const nextIsValue =
      current.type === "number" || current.type === "identifier" || (current.type === "paren" && current.value === "(");

    const isFunctionCall =
      previous.type === "identifier" &&
      current.type === "paren" &&
      current.value === "(" &&
      Boolean(FUNCTIONS[previous.value]);

    if (prevIsValue && nextIsValue && !isFunctionCall) {
      result.push({
        type: "operator",
        value: "*",
        index: current.index,
      });
    }

    result.push(current);
  }
  return result;
};

const toOperatorToken = (value: string, index: number): ExpressionToken => ({
  type: "operator",
  value,
  index,
});

const shouldUseUnary = (previous: ExpressionToken | undefined) => {
  if (!previous) return true;
  if (previous.type === "operator" || previous.type === "comma") return true;
  if (previous.type === "paren" && previous.value === "(") return true;
  return false;
};

export const compileExpression = (expression: string): CompiledExpression => {
  const tokens = insertImplicitMultiplication(tokenizeExpression(expression));
  const output: ExpressionToken[] = [];
  const stack: ExpressionToken[] = [];

  let previous: ExpressionToken | undefined;
  let error: ExpressionParseError | undefined;

  for (const token of tokens) {
    if (token.type === "number") {
      output.push(token);
    } else if (token.type === "identifier") {
      if (FUNCTIONS[token.value]) {
        stack.push({ ...token, type: "function" });
      } else {
        output.push(token);
      }
    } else if (token.type === "comma") {
      error = {
        message: "Multiple arguments are not supported yet",
        index: token.index,
      };
      break;
    } else if (token.type === "operator") {
      let operatorToken = token;
      if (token.value === "-" && shouldUseUnary(previous)) {
        operatorToken = toOperatorToken("neg", token.index);
      }

      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        if (!top) break;
        const topOperator = OPERATORS[top.value];
        if (!topOperator) break;

        const currentOperator = OPERATORS[operatorToken.value];
        if (!currentOperator) break;

        const shouldPop =
          (currentOperator.associativity === "left" && currentOperator.precedence <= topOperator.precedence) ||
          (currentOperator.associativity === "right" && currentOperator.precedence < topOperator.precedence);

        if (shouldPop) {
          output.push(stack.pop()!);
        } else {
          break;
        }
      }
      stack.push(operatorToken);
    } else if (token.type === "paren" && token.value === "(") {
      stack.push(token);
    } else if (token.type === "paren" && token.value === ")") {
      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        if (!top || top.value === "(") break;
        output.push(stack.pop()!);
      }
      if (stack.length === 0) {
        error = { message: "Mismatched parenthesis", index: token.index };
        break;
      }
      stack.pop();
      const top = stack[stack.length - 1];
      if (top && top.type === "function") {
        output.push(stack.pop()!);
      }
    }

    previous = token;
  }

  if (!error) {
    while (stack.length > 0) {
      const next = stack.pop()!;
      if (next.type === "paren") {
        error = { message: "Mismatched parenthesis", index: next.index };
        break;
      }
      output.push(next);
    }
  }

  return { rpn: output, error };
};

export const evaluateCompiledExpression = (
  compiled: CompiledExpression,
  variables: Record<string, number>
): number | undefined => {
  if (compiled.error) return undefined;
  const stack: number[] = [];

  for (const token of compiled.rpn) {
    if (token.type === "number") {
      stack.push(Number(token.value));
      continue;
    }

    if (token.type === "identifier") {
      const lower = token.value.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(CONSTANTS, lower)) {
        const constant = CONSTANTS[lower];
        if (constant === undefined) return undefined;
        stack.push(constant);
        continue;
      }
      const variable = variables[token.value];
      if (variable === undefined) return undefined;
      stack.push(variable);
      continue;
    }

    if (token.type === "operator") {
      const operator = OPERATORS[token.value];
      if (!operator) return undefined;

      if (operator.argCount === 1) {
        const value = stack.pop();
        if (value === undefined) return undefined;
        if (token.value === "neg") {
          stack.push(-value);
        } else {
          return undefined;
        }
        continue;
      }

      const right = stack.pop();
      const left = stack.pop();
      if (left === undefined || right === undefined) return undefined;
      if (token.value === "+") stack.push(left + right);
      else if (token.value === "-") stack.push(left - right);
      else if (token.value === "*") stack.push(left * right);
      else if (token.value === "/") stack.push(left / right);
      else if (token.value === "^") stack.push(Math.pow(left, right));
      else return undefined;
      continue;
    }

    if (token.type === "function") {
      const fn = FUNCTIONS[token.value];
      if (!fn) return undefined;
      const value = stack.pop();
      if (value === undefined) return undefined;
      stack.push(fn([value]));
    }
  }

  if (stack.length !== 1) return undefined;
  return stack[0];
};

export const evaluateExpression = (expression: string, variables: Record<string, number>): number | undefined => {
  const compiled = compileExpression(expression);
  return evaluateCompiledExpression(compiled, variables);
};
