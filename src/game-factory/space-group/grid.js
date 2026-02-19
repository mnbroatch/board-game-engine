import chunk from "lodash/chunk.js";
import SpaceGroup from "../space-group/space-group.js";

export default class Grid extends SpaceGroup {
  getSpacesCount () {
    return this.rule.width * this.rule.height
  }

  getRows () {
    return chunk(this.spaces, this.rule.width)
  }

  getCoordinates (index) {
    const { width } = this.rule
    return [
      index % width,
      Math.floor(index/width)
    ]
  }

  getIndex ([ x, y ]) {
    const { width } = this.rule
    return y * width + x
  }

  getSpace (coordinates) {
    return this.spaces[this.getIndex(coordinates)]
  }

  getRelativeCoordinates ([oldX, oldY], [relativeX, relativeY]) {
    const newCoordinates = [oldX + relativeX, oldY + relativeY]
    return this.areCoordinatesValid(newCoordinates)
      ? newCoordinates
      : null
  }

  areCoordinatesValid([x, y]) {
    return x >= 0 
      && y >= 0 
      && x < this.rule.width
      && y < this.rule.height
  }
}
