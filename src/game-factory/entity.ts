export default class Entity {
  rule: Record<string, unknown>;
  entityId: number;
  state: Record<string, unknown>;

  constructor (
    options: { fromBank?: boolean; initialStateGroups?: Record<string, string> } | undefined,
    rule: Record<string, unknown>,
    id: number
  ) {
    if (!options?.fromBank) {
      throw new Error(`Do not create entities directly. Go through the Bank. rule: ${JSON.stringify(rule)}`);
    }
    this.rule = rule;
    this.entityId = id;
    this.state = {};
    if (this.rule.stateGroups) {
      Object.entries(this.rule.stateGroups as Record<string, Record<string, Record<string, unknown>>>)
        .forEach(([stateGroupName, stateGroupValues]) => {
          const stateGroupValueName = options?.initialStateGroups?.[stateGroupName]
            ?? Object.keys(stateGroupValues)[0];
          Object.assign(this.state, stateGroupValues[stateGroupValueName]);
        });
    }
    if (this.rule.state) {
      Object.assign(this.state, this.rule.state as Record<string, unknown>);
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
