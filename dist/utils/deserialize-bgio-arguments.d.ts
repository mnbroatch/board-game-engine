import type { BoardgameEngineG } from "./bgio-resolve-types.js";
export default function deserializeBgioArguments<T extends {
    G: unknown;
}>(bgioArguments: T): T & {
    G: BoardgameEngineG;
};
//# sourceMappingURL=deserialize-bgio-arguments.d.ts.map