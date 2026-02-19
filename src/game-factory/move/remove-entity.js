import Move from "./move.js";

export default class RemoveEntity extends Move {
  do(bgioArguments, rule, { arguments: { entity } }) {
    bgioArguments.G.bank.returnToBank(bgioArguments, entity)
  }
}
