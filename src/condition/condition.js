export default class Condition {
  constructor (rules, game) {
    this.id = `${Math.random()}`
    this.rules = rules;
    this.game = game;
  }

  isMet(actionPayload) {}
}
