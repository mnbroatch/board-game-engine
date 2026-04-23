import type { RuntimeEntityRule } from "../../types/runtime-entity.js";
import SpaceGroup from "./space-group.js";
export default class Grid extends SpaceGroup {
    rule: RuntimeEntityRule & {
        width: number;
        height: number;
    };
    getSpacesCount(): number;
    getRows(): (import("../../index.js").EngineEntity & import("../../types/runtime-entity.js").EngineSpaceMethods)[][];
    getCoordinates(index: number): number[];
    getIndex([x, y]: [number, number]): number;
    getSpace(arg: number | [number, number]): import("../../index.js").EngineEntity & import("../../types/runtime-entity.js").EngineSpaceMethods;
    getRelativeCoordinates([oldX, oldY]: [number, number], [relativeX, relativeY]: [number, number]): [number, number] | null;
    areCoordinatesValid([x, y]: [number, number]): boolean;
}
//# sourceMappingURL=grid.d.ts.map