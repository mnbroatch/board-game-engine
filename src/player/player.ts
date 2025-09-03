import type { PlayerRule } from "../../types";

class Player {
  rule: PlayerRule;
  index: number;
  constructor(rule: PlayerRule, index: number, id: string) {
    this.rule = rule;
    this.index = index;
    this.id = id || `${Math.random()}`
  }
}

export default Player;
