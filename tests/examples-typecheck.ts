import type { BagelGame } from "../src/types/bagel-types.js";

import checkers from "../examples/checkers.json";
import connectFour from "../examples/connect-four.json";
import eights from "../examples/eights.json";
import reversi from "../examples/reversi.json";
import ticTacToe from "../examples/tic-tac-toe.json";

// Compile-time only: if any example JSON stops matching `BagelGame`,
// `tsc -p tsconfig.examples-typecheck.json` will fail.
export const examples = {
  checkers: checkers satisfies BagelGame,
  connectFour: connectFour satisfies BagelGame,
  eights: eights satisfies BagelGame,
  reversi: reversi satisfies BagelGame,
  ticTacToe: ticTacToe satisfies BagelGame,
} as const;

