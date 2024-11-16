import React from "react";
import GridComponent from "./grid.js";
import Grid from "../../engine/board/grid.js";
import StackComponent from "./stack.js";
import Stack from "../../engine/board/stack.js";

export default function Board(props) {
  if (props.board instanceof Grid) {
    return <GridComponent {...props} />;
  } else if (props.board instanceof Stack) {
    return <StackComponent {...props} />;
  } else {
    return null;
  }
}
