import { Parser } from 'expr-eval'
import resolveProperties from "../utils/resolve-properties.js";

const parser = new Parser();
parser.functions.sum = array => array.reduce((acc, val) => acc + val, 0)

export default function resolveExpression (bgioArguments, rule, context) {
  const args = resolveProperties(bgioArguments, rule.arguments, context)
  return parser.evaluate(rule.expression, args)
}
