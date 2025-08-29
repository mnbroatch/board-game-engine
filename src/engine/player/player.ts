import type { PlayerRule } from "../../types";
import Serializable from "../serializable.js";

class Player extends Serializable {
  rule: PlayerRule;
  id: string;
  index: number;
  constructor(rule: PlayerRule, index: number) {
    super(rule, index);
    this.rule = rule;
    this.id = `${Math.random()}`;
    this.index = index;
  }
}

export default Player;
