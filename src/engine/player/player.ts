import type { PlayerRule } from "../../types";
import Serializable from "../serializable.js";

class Player extends Serializable {
  rule: PlayerRule;
  index: number;
  constructor(rule: PlayerRule, index: number) {
    super(rule, index);
    this.rule = rule;
    this.index = index;
  }
}

export default Player;
