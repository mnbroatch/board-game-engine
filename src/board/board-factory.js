import Grid from "./grid.js";
import Stack from "./stack.js";

export default function boardFactory(boardRule, options) {
  if (boardRule.type === "grid") {
    return new Grid(boardRule, options);
  } else if (boardRule.type === "stack") {
    return new Stack(boardRule, options);
  } else {
    console.log("missing board type:", boardRule);
  }
}
