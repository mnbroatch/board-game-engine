import { INVALID_MOVE } from "@mnbroatch/boardgame.io/dist/cjs/core.js";
import type { MoveDefinition } from "../../types/bagel-types.js";
export default class Move {
    rule: MoveDefinition;
    constructor(rule: MoveDefinition);
    checkValidity(bgioArguments: unknown, payload: {
        arguments: Record<string, unknown>;
    }, context: Record<string, unknown>): false | {
        argumentResults: Record<string, {
            results: unknown[];
            conditionsAreMet: boolean;
        }>;
        moveResults: {
            results: unknown[];
            failedAt: unknown;
            conditionsAreMet: boolean;
        };
        conditionsAreMet: boolean;
    };
    isValid(bgioArguments: unknown, payload: {
        arguments: Record<string, unknown>;
    }, context: Record<string, unknown>): boolean;
    doMove(bgioArguments: unknown, payload: {
        arguments?: Record<string, unknown>;
    } | undefined, context: Record<string, unknown>, { skipCheck }?: {
        skipCheck?: boolean | undefined;
    }): typeof INVALID_MOVE | {
        conditionResults: boolean | {
            argumentResults: Record<string, {
                results: unknown[];
                conditionsAreMet: boolean;
            }>;
            moveResults: {
                results: unknown[];
                failedAt: unknown;
                conditionsAreMet: boolean;
            };
            conditionsAreMet: boolean;
        } | undefined;
    };
    do(_bgioArguments: unknown, _rule: unknown, _resolvedPayload: unknown, _context: unknown): void;
    transformRule(rule: {
        arguments?: Record<string, {
            playerChoice?: boolean;
            resolveAsEntity?: boolean;
        }>;
    }): {
        arguments?: Record<string, {
            playerChoice?: boolean;
            resolveAsEntity?: boolean;
        }>;
    };
}
//# sourceMappingURL=move.d.ts.map