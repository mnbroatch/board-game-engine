export { default as gameFactory } from "./game-factory/game-factory.js";
export { Client } from "./client/client.js";
export type { ClientOptions } from "./client/client.js";
export type {
  BoardgameEngineG,
  BoardgameEngineMeta,
  BoardgameIoGame,
} from "./game-factory/game-factory.js";
export type { BoardgameEngineMove } from "./game-factory/move/move-factory.js";
export type * from "./types/index.js";

export type { SimulatePreparedArguments } from "./utils/simulate-move.js";

export { default as resolveRef } from "./utils/resolve-ref.js";
export {
  expectResolvedEngineEntity,
  expectResolvedEngineEntityContainer,
  expectResolvedGrid,
  resolveFieldAsEngineEntity,
  resolveFieldAsGrid,
} from "./utils/resolve-typed-value.js";
