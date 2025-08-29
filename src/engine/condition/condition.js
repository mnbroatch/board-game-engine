import Serializable from "../serializable.js";

export default class Condition extends Serializable {
  constructor (rules, game) {
    super(rules, game)
    this.rules = rules;
    this.game = game;
  }

  isMet(actionPayload) {}
}
