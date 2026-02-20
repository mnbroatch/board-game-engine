import Board from "./game-factory/board.js";
import SpaceGroup from "./game-factory/space-group/space-group.js";
import Space from "./game-factory/space/space.js";
import Grid from "./game-factory/space-group/grid.js";
import Bank from "./game-factory/bank/bank.js";
import BankSlot from "./game-factory/bank/bank-slot.js";
import Entity from "./game-factory/entity.js";

export const registry = {
  Board,
  SpaceGroup,
  Space,
  Grid,
  Bank,
  BankSlot,
  Entity,
};
