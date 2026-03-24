import type { Condition as ConditionRule } from "../../types/bagel-types.js";
import type ConditionBase from "./condition.js";
import Is from "./is-condition.js";
import Not from "./not-condition.js";
import Or from "./or-condition.js";
import Some from "./some-condition.js";
import Every from "./every-condition.js";
import ContainsCondition from "./contains-condition.js";
import ContainsSameCondition from "./contains-same-condition.js";
import InLine from "./in-line-condition.js";
import HasLine from "./has-line-condition.js";
import IsFull from "./is-full-condition.js";
import Would from "./would-condition.js";
import NoPossibleMoves from "./no-possible-moves-condition.js";
import Evaluate from "./evaluate-condition.js";
import Position from "./position-condition.js";
// import BingoCondition from "./bingo-condition.js";
// import RelativeMoveCondition from "./relative-move-condition.js";

export default function conditionFactory (rule: ConditionRule): ConditionBase | undefined {
  if (typeof rule !== "object" || rule === null || !("conditionType" in rule)) {
    return undefined;
  }
  const r = rule as { conditionType: string; [k: string]: unknown };
  if (r.conditionType === "Is") {
    return new Is(r);
  } else if (r.conditionType === "Not") {
    return new Not(r);
  } else if (r.conditionType === "Or") {
    return new Or(r);
  } else if (r.conditionType === "Some") {
    return new Some(r);
  } else if (r.conditionType === "Contains") {
    return new ContainsCondition(r);
  } else if (r.conditionType === "ContainsSame") {
    return new ContainsSameCondition(r);
  } else if (r.conditionType === "Every") {
    return new Every(r);
  } else if (r.conditionType === "InLine") {
    return new InLine(r);
  } else if (r.conditionType === "HasLine") {
    return new HasLine(r);
  } else if (r.conditionType === "IsFull") {
    return new IsFull(r);
  } else if (r.conditionType === "Would") {
    return new Would(r);
  } else if (r.conditionType === "NoPossibleMoves") {
    return new NoPossibleMoves(r);
  } else if (r.conditionType === "Evaluate") {
    return new Evaluate(r);
  } else if (r.conditionType === "Position") {
    return new Position(r);
  // } else if (rule.conditionType === "bingo") {
    // return new BingoCondition(rule);
  // } else if (rule.conditionType === "relativeMove") {
  //   return new RelativeMoveCondition(rule);
  }
  return undefined;
}
