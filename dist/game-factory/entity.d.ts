export default class Entity {
    rule: Record<string, unknown>;
    entityId: number;
    state: Record<string, unknown>;
    constructor(options: {
        fromBank?: boolean;
        initialStateGroups?: Record<string, string>;
    } | undefined, rule: Record<string, unknown>, id: number);
    get attributes(): {
        [x: string]: unknown;
    } & this & Record<string, unknown>;
}
//# sourceMappingURL=entity.d.ts.map