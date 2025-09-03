import conditionFactory from "../condition/condition-factory.js";
import Serializable from "../serializable.js";

export default class Action extends Serializable {
  constructor(rules, game) {
    super(rules, game);
    this.game = game;
    this.rules = rules;

    const invariantConditionRules = [
      { type: "actionTypeMatches", actionRule: this.rules },
      { type: "pieceMatches", actionRule: this.rules },
      { type: "isValidPlayer" },
    ];

    this.conditions = [
      ...invariantConditionRules,
      ...(this.rules.conditions || []),
    ].map((conditionRule) => conditionFactory(conditionRule, game));
  }

  assertIsValid(actionPayload) {
    const unmetConditions = this.conditions.filter(
      (condition) => !condition.isMet(actionPayload),
    );
    if (unmetConditions.length) {
      console.log("==================");
      console.log("unmetConditions", unmetConditions);
      console.log("actionPayload", actionPayload);
      throw new Error("conditions not met ^");
    }
  }

  do() {}
}
