import { serialize, deserialize } from "wackson";
import { registry } from "../registry.js";
import type { BgioResolveState } from "./bgio-resolve-types.js";

export default function simulateMove (
  bgioArguments: BgioResolveState,
  payload: { arguments: Record<string, { abstract?: boolean; entityId?: unknown } | number> },
  context: { moveInstance: { doMove: (...args: unknown[]) => unknown } }
) {
  const simulatedG = deserialize(serialize(bgioArguments.G) as string, registry) as {
    bank: { locate: (id: unknown) => unknown };
  };
  const newBgioArguments = {
    ...bgioArguments,
    G: simulatedG,
  };
  const simulatedPayload = { ...payload, arguments: {} as Record<string, unknown> };
  Object.entries(payload.arguments).forEach(([argName, arg]) => {
    simulatedPayload.arguments[argName] = (arg as { abstract?: boolean }).abstract
      ? arg
      : simulatedG.bank.locate(typeof arg === "number" ? arg : (arg as { entityId: unknown }).entityId);
  });

  context.moveInstance.doMove(
    newBgioArguments,
    simulatedPayload,
    context,
    { skipCheck: true }
  );

  return simulatedG;
}
