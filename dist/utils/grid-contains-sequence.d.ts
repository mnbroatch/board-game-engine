import type { Condition } from "../types/bagel-types.js";
export type SequenceChunk = {
    count?: number;
    minCount?: number;
    maxCount?: number;
    conditions?: Condition[];
};
type GridEntity = {
    entities?: unknown[];
    [k: string]: unknown;
};
type GridSpace = {
    entities?: GridEntity[];
    [k: string]: unknown;
};
export type GridLike = {
    attributes: {
        width: number;
        height: number;
    };
    entities?: GridSpace[];
    areCoordinatesValid: (c: number[]) => boolean;
    getSpace: (c: number[]) => unknown;
};
export default function gridContainsSequence(bgioArguments: unknown, grid: GridLike, sequencePattern: SequenceChunk[], context: Record<string, unknown>): unknown;
export {};
//# sourceMappingURL=grid-contains-sequence.d.ts.map