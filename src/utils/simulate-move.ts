import { cloneBoardgameEngineGWacksonRoundtrip } from "./engine-serde-boundary.js";
import type { BoardgameEngineG, BgioReadonlyState, BgioResolveState } from "./bgio-resolve-types.js";
import type { MoveArgumentsMap } from "../types/move-arguments.js";
import type Move from "../game-factory/move/move.js";
import type {
  AbstractPickArgument,
  PreparedMovePayload,
  SimulatedMoveArgumentsMap,
  SimulatedMovePayload,
} from "../types/move-payload.js";
import type { ResolutionContext } from "../types/resolution-context.js";

function isAbstractPick (arg: unknown): arg is AbstractPickArgument {
  return Boolean(
    arg
      && typeof arg === "object"
      && "abstract" in arg
      && (arg as { abstract?: boolean }).abstract
  );
}

function getEntityId (arg: unknown): unknown {
  if (typeof arg === "number") return arg;
  if (arg && typeof arg === "object") return (arg as { entityId?: unknown }).entityId;
}

export type SimulatePreparedArguments = {
  [argumentName: string]: number | AbstractPickArgument | undefined;
};

export default function simulateMove (
  bgioArguments: BgioReadonlyState | BgioResolveState,
  payload: PreparedMovePayload<SimulatePreparedArguments> & {
    arguments: SimulatePreparedArguments;
  },
  context: ResolutionContext & { moveInstance: Pick<Move<MoveArgumentsMap>, "doMove"> }
): BoardgameEngineG {
  const simulatedG = cloneBoardgameEngineGWacksonRoundtrip(bgioArguments.G);
  const newBgioArguments = {
    ...bgioArguments,
    G: simulatedG,
  };
  const simulatedPayload: SimulatedMovePayload = {
    ...payload,
    arguments: {} as SimulatedMoveArgumentsMap,
  };
  Object.entries(payload.arguments).forEach(([argName, arg]) => {
    if (arg === undefined) return;
    if (isAbstractPick(arg)) {
      simulatedPayload.arguments[argName] = arg;
      return;
    }
    const id = getEntityId(arg);
    if (typeof id === "number") {
      simulatedPayload.arguments[argName] = simulatedG.bank.locate(id);
    }
  });

  context.moveInstance.doMove(
    newBgioArguments,
    simulatedPayload,
    context,
    { skipCheck: true }
  );

  return simulatedG;
}
