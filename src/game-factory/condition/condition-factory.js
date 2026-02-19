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

export default function conditionFactory(rule) {
  if (rule.conditionType === "Is") {
    return new Is(rule);
  } else if (rule.conditionType === "Not") {
    return new Not(rule);
  } else if (rule.conditionType === "Or") {
    return new Or(rule);
  } else if (rule.conditionType === "Some") {
    return new Some(rule);
  } else if (rule.conditionType === "Contains") {
    return new ContainsCondition(rule);
  } else if (rule.conditionType === "ContainsSame") {
    return new ContainsSameCondition(rule);
  } else if (rule.conditionType === "Every") {
    return new Every(rule);
  } else if (rule.conditionType === "InLine") {
    return new InLine(rule);
  } else if (rule.conditionType === "HasLine") {
    return new HasLine(rule);
  } else if (rule.conditionType === "IsFull") {
    return new IsFull(rule);
  } else if (rule.conditionType === "Would") {
    return new Would(rule);
  } else if (rule.conditionType === "NoPossibleMoves") {
    return new NoPossibleMoves(rule);
  } else if (rule.conditionType === "Evaluate") {
    return new Evaluate(rule);
  } else if (rule.conditionType === "Position") {
    return new Position(rule);
  // } else if (rule.conditionType === "bingo") {
    // return new BingoCondition(rule);
  // } else if (rule.conditionType === "relativeMove") {
  //   return new RelativeMoveCondition(rule);
  }
}
