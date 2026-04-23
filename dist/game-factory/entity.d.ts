import type { RuntimeEntityRule } from "../types/runtime-entity.js";
export default class Entity {
    rule: RuntimeEntityRule;
    entityId: number;
    state: Record<string, unknown>;
    constructor(options: {
        fromBank?: boolean;
        initialStateGroups?: Record<string, string>;
    } | undefined, rule: RuntimeEntityRule, id: number);
    get attributes(): ({
        [x: string]: unknown;
        [x: number]: unknown;
        variants?: never;
        perPlayer?: never;
        index?: number;
        hideLength?: boolean;
        stateGroups?: import("../types/runtime-entity.js").RuntimeStateGroups;
    } & this & Record<string, unknown>) | ({
        [x: string]: unknown;
        [x: number]: unknown;
        variants?: never;
        perPlayer?: never;
        index?: number;
        hideLength?: boolean;
        stateGroups?: import("../types/runtime-entity.js").RuntimeStateGroups;
    } & this & Record<string, unknown>) | ({
        [x: string]: unknown;
        [x: number]: unknown;
        variants?: never;
        perPlayer?: never;
        index?: number;
        hideLength?: boolean;
        stateGroups?: import("../types/runtime-entity.js").RuntimeStateGroups;
    } & this & Record<string, unknown>) | ({
        [x: string]: unknown;
        [x: number]: unknown;
        variants?: never;
        perPlayer?: never;
        index?: number;
        hideLength?: boolean;
        stateGroups?: import("../types/runtime-entity.js").RuntimeStateGroups;
    } & this & Record<string, unknown>);
}
//# sourceMappingURL=entity.d.ts.map