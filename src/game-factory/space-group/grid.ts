import chunk from "lodash/chunk.js";
import SpaceGroup from "./space-group.js";

export default class Grid extends SpaceGroup {
  declare rule: Record<string, unknown> & { width: number; height: number };

  getSpacesCount () {
    return (this.rule.width as number) * (this.rule.height as number);
  }

  getRows () {
    return chunk(this.spaces, this.rule.width as number);
  }

  getCoordinates (index: number) {
    const { width } = this.rule;
    return [
      index % width,
      Math.floor(index / width),
    ];
  }

  getIndex ([x, y]: [number, number]) {
    const { width } = this.rule;
    return y * width + x;
  }

  override getSpace (arg: number | [number, number]) {
    if (Array.isArray(arg)) {
      return this.spaces[this.getIndex(arg)];
    }
    return this.spaces[arg];
  }

  getRelativeCoordinates ([oldX, oldY]: [number, number], [relativeX, relativeY]: [number, number]) {
    const newCoordinates: [number, number] = [oldX + relativeX, oldY + relativeY];
    return this.areCoordinatesValid(newCoordinates)
      ? newCoordinates
      : null;
  }

  areCoordinatesValid ([x, y]: [number, number]) {
    return x >= 0
      && y >= 0
      && x < (this.rule.width as number)
      && y < (this.rule.height as number);
  }
}
