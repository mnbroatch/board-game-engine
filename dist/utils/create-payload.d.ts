import getSteps from "./get-steps.js";
import type { MovePayload } from "../types/move-payload.js";
import type { MoveArgumentsMap } from "../types/move-arguments.js";
import type { ResolutionContext } from "../types/resolution-context.js";
export default function createPayload(bgioState: Parameters<typeof getSteps>[0], moveRule: Parameters<typeof getSteps>[1], targets: readonly unknown[], _context: ResolutionContext): MovePayload<MoveArgumentsMap>;
//# sourceMappingURL=create-payload.d.ts.map