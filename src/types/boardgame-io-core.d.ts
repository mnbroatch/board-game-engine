/**
 * Subpath used by this package; @types/boardgame.io may not cover `dist/cjs/core.js`.
 */
declare module "@mnbroatch/boardgame.io/dist/cjs/core.js" {
  /** Sentinel returned by moves to signal an illegal move. */
  export const INVALID_MOVE: unique symbol;
}
