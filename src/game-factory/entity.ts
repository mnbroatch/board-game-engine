import type { RuntimeEntityRule } from "../types/runtime-entity.js";

export default class Entity {
  rule: RuntimeEntityRule;
  entityId: number;
  state: Record<string, unknown>;

  constructor (
    options: { fromBank?: boolean; initialStateGroups?: Record<string, string> } | undefined,
    rule: RuntimeEntityRule,
    id: number
  ) {
    if (!options?.fromBank) {
      throw new Error(`Do not create entities directly. Go through the Bank. rule: ${JSON.stringify(rule)}`);
    }
    this.rule = rule;
    this.entityId = id;
    this.state = {};
    if (this.rule.stateGroups) {
      Object.entries(this.rule.stateGroups)
        .forEach(([stateGroupName, stateGroupValues]) => {
          const stateGroupValueName = options?.initialStateGroups?.[stateGroupName]
            ?? Object.keys(stateGroupValues)[0];
          Object.assign(this.state, stateGroupValues[stateGroupValueName]);
        });
    }
    if (this.rule.state) {
      Object.assign(this.state, this.rule.state);
    }
  }

  get attributes () {
    return {
      ...this.rule,
      ...this,
      ...this.state,
    };
  }
}
