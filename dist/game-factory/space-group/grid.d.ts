import SpaceGroup from "./space-group.js";
export default class Grid extends SpaceGroup {
    rule: Record<string, unknown> & {
        width: number;
        height: number;
    };
    getSpacesCount(): number;
    getRows(): unknown[][];
    getCoordinates(index: number): number[];
    getIndex([x, y]: [number, number]): number;
    getSpace(arg: number | [number, number]): unknown;
    getRelativeCoordinates([oldX, oldY]: [number, number], [relativeX, relativeY]: [number, number]): [number, number] | null;
    areCoordinatesValid([x, y]: [number, number]): boolean;
}
//# sourceMappingURL=grid.d.ts.map