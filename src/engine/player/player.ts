import type { PlayerRule } from "../../types";

class Player {
  rule: PlayerRule;
  id: string;
  index: number;
  constructor(rule: PlayerRule, index: number) {
    this.rule = rule;
    this.id = `${Math.random()}`;
    this.index = index;
  }
}

export default Player;
