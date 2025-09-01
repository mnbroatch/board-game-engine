import React from "react";
import GridComponent from "./grid.tsx";
import StackComponent from "./stack.js";

export default function Board(props) {
  if (props.board.constructorName === 'Grid') {
    return <GridComponent {...props} />;
  } else if (props.board.constructorName === 'Stack') {
    return <StackComponent {...props} />;
  } else {
    return null;
  }
}
