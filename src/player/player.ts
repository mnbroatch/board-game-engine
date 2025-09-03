import type { PlayerRule } from "../../types";
import Serializable from "../serializable.js";

class Player extends Serializable {
  rule: PlayerRule;
  index: number;
  constructor(rule: PlayerRule, index: number, id: string) {
    super(rule, index, id);
    this.rule = rule;
    this.index = index;
    if (id) {
      this.id = id;
    }
  }
}

export default Player;
