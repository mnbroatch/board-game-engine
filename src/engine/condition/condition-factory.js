import DoesNotContainCondition from "./does-not-contain-condition.js";
import ContainsCondition from "./contains-condition.js";
import BingoCondition from "./bingo-condition.js";
import BlackoutCondition from "./blackout-condition.js";
import SomeCondition from "./some-condition.js";
import RelativeMoveCondition from "./relative-move-condition.js";
import ActionTypeMatchesCondition from "./action-type-matches-condition.js";
import IsValidPlayerCondition from "./is-valid-player-condition.js";
import PieceMatchesCondition from "./piece-matches-condition.js";

export default function conditionFactory(conditionRule, game) {
  if (conditionRule.type === "contains") {
    return new ContainsCondition(conditionRule, game);
  } else if (conditionRule.type === "doesNotContain") {
    return new DoesNotContainCondition(conditionRule, game);
  } else if (conditionRule.type === "bingo") {
    return new BingoCondition(conditionRule, game);
  } else if (conditionRule.type === "blackout") {
    return new BlackoutCondition(conditionRule, game);
  } else if (conditionRule.type === "some") {
    return new SomeCondition(conditionRule, game);
  } else if (conditionRule.type === "relativeMove") {
    return new RelativeMoveCondition(conditionRule, game);
  } else if (conditionRule.type === "actionTypeMatches") {
    return new ActionTypeMatchesCondition(conditionRule, game);
  } else if (conditionRule.type === "isValidPlayer") {
    return new IsValidPlayerCondition(conditionRule, game);
  } else if (conditionRule.type === "pieceMatches") {
    return new PieceMatchesCondition(conditionRule, game);
  }
}
