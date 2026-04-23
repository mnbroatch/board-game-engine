import type { MoveArgumentValue } from "./resolution-context.js";
/**
 * Open map of move argument names (from authored rules) to values.
 * Replaces `Record<string, unknown>` for payload `arguments` typing.
 */
export type MoveArgumentsMap = {
    [argumentName: string]: MoveArgumentValue | undefined;
};
//# sourceMappingURL=move-arguments.d.ts.map