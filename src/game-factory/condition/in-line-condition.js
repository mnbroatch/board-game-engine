import Condition from "./condition.js";
import gridContainsSequence from "../../utils/grid-contains-sequence.js";


export default class InLineCondition extends Condition {
  checkCondition(bgioArguments, rule, payload, context) {
    const { G } = bgioArguments;
    const { target } = payload;
    const parent = G.bank.findParent(payload.target);
    
    const { matches: allMatches } = gridContainsSequence(bgioArguments, parent, rule.sequence, context);
    
    const matches = allMatches.filter(sequence => 
      sequence.some(space => space === target)
    );

    return { matches, conditionIsMet: !!matches.length };
  }
}
