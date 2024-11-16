export default class Condition {
  constructor(rules, game) {
    this.rules = rules;
    this.game = game;
  }

  isMet(actionPayload) {}
}
