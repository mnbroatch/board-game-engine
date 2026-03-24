declare module "expr-eval" {
  export class Parser {
    functions: Record<string, (...args: unknown[]) => unknown>;
    evaluate (expression: string, variables?: Record<string, unknown>): number;
  }
}
