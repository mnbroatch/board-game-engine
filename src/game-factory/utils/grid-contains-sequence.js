// claude ai did most of this
import _matches from "lodash/matches.js";
import checkConditions from "./check-conditions.js";

// We'll check reverse directions along each line
const directions = [
  [1, 0],   // horizontal
  [0, 1],   // vertical
  [1, 1],   // diagonal down-right
  [-1, 1],  // diagonal down-left
];

const sequenceCache = new WeakMap();

function getSequenceKey(sequencePattern, context) {
  const contextKey = {
    moveInstance: context.moveInstance?.id,
    moveArguments: context.moveArguments,
    // Add other context properties that conditions might use
  };
  return JSON.stringify({ pattern: sequencePattern, context: contextKey });
}

// todo: use stable hash library that we're using for game rules hash
function getGridStateKey(grid) {
  const spaces = grid.entities || [];
  
  return spaces.map(space => {
    const entities = space.entities || [];
    if (entities.length === 0) return 'empty';
    
    return entities.map(entity => {
      const sortedKeys = Object.keys(entity).sort();
      const stateObj = {};
      sortedKeys.forEach(key => {
        stateObj[key] = entity[key];
      });
      return JSON.stringify(stateObj);
    }).sort().join('|');
  }).join(',');
}

function findSequencesInLine(bgioArguments, lineSpaces, sequencePattern, minSequenceLength, context, reverse = false) {
  const matches = [];
  
  // Use original array or iterate in reverse without creating new array
  const length = lineSpaces.length;
  let startIndex = 0;
  
  while (startIndex <= length - minSequenceLength) {
    const matchedSpaces = tryMatchSequence(
      bgioArguments, 
      lineSpaces, 
      startIndex, 
      sequencePattern,
      context,
      reverse
    );
    
    if (matchedSpaces) {
      matches.push(matchedSpaces);
      startIndex++; // Move one space forward to find overlapping matches
    } else {
      startIndex++;
    }
  }
  
  return matches;
}

function getLineStartingPoints(grid, dx, dy) {
  const { width, height } = grid.attributes;
  const starts = [];
  
  if (dx === 1 && dy === 0) {
    // Horizontal: start at leftmost column
    for (let y = 0; y < height; y++) starts.push([0, y]);
  } else if (dx === 0 && dy === 1) {
    // Vertical: start at top row
    for (let x = 0; x < width; x++) starts.push([x, 0]);
  } else if (dx === 1 && dy === 1) {
    // Diagonal down-right: start from top row and left column
    for (let x = 0; x < width; x++) starts.push([x, 0]);
    for (let y = 1; y < height; y++) starts.push([0, y]);
  } else if (dx === -1 && dy === 1) {
    // Diagonal down-left: start from top row and right column
    for (let x = 0; x < width; x++) starts.push([x, 0]);
    for (let y = 1; y < height; y++) starts.push([width - 1, y]);
  }
  
  return starts;
}

function getLineSpaces(grid, startX, startY, dx, dy) {
  const spaces = [];
  let [x, y] = [startX, startY];
  
  while (grid.areCoordinatesValid([x, y])) {
    spaces.push(grid.getSpace([x, y]));
    x += dx;
    y += dy;
  }
  return spaces;
}

function tryMatchSequence(bgioArguments, lineSpaces, startIndex, sequencePattern, context, reverse = false) {
  let spaceIndex = startIndex;
  const matchedSpaces = [];
  const length = lineSpaces.length;
  
  for (const chunk of sequencePattern) {
    const { count, minCount, maxCount, conditions } = chunk;
    
    let min, max;
    if (count !== undefined) {
      min = max = count;
    } else if (minCount !== undefined || maxCount !== undefined) {
      min = minCount || 0;
      max = maxCount || Infinity;
    } else {
      min = max = 1;
    }
    
    let matchedCount = 0;
    const chunkMatches = [];
    
    // Greedy: try to match as many as possible up to max
    while (matchedCount < max && spaceIndex < length) {
      // Access space directly or in reverse without creating new array
      const space = reverse 
        ? lineSpaces[length - 1 - spaceIndex]
        : lineSpaces[spaceIndex];
      
      // Pass all previously matched spaces in this chunk
      if (checkSpaceConditions(bgioArguments, space, conditions, chunkMatches, context)) {
        chunkMatches.push(space);
        matchedCount++;
        spaceIndex++;
      } else {
        break;
      }
    }
    
    // Check if we met the minimum requirement
    if (matchedCount < min) {
      return null;
    }
    
    matchedSpaces.push(...chunkMatches);
  }
  
  return matchedSpaces.length > 0 ? matchedSpaces : null;
}

function checkSpaceConditions(bgioArguments, space, conditions, chunkMatches = [], context) {
  // Early exit if no conditions
  if (!conditions || conditions.length === 0) {
    return true;
  }
  
  return checkConditions(
    bgioArguments,
    { conditions },
    {
      target: space,
      targets: [space, ...chunkMatches] // for ContainsSame, other group conditions
    },
    context
  ).conditionsAreMet
}

export default function gridContainsSequence(bgioArguments, grid, sequencePattern, context) {
  const cacheKey = getSequenceKey(sequencePattern, context);
  let gridCache = sequenceCache.get(grid);
  
  if (!gridCache) {
    gridCache = new Map();
    sequenceCache.set(grid, gridCache);
  }
  
  const gridStateKey = getGridStateKey(grid);
  const cacheEntry = gridCache.get(cacheKey);
  
  if (cacheEntry && cacheEntry.stateKey === gridStateKey) {
    return cacheEntry.result;
  }
  
  const matches = [];
  
  const minSequenceLength = sequencePattern.reduce((sum, chunk) => 
    sum + (chunk.minCount || chunk.count || 1), 0
  );
  
  // For each direction, scan each row/column/diagonal once
  for (const [dx, dy] of directions) {
    const lines = getLineStartingPoints(grid, dx, dy);
    
    for (const [startX, startY] of lines) {
      const lineSpaces = getLineSpaces(grid, startX, startY, dx, dy);
      
      if (lineSpaces.length < minSequenceLength) {
        continue;
      }
      
      // todo: this forward/backward logic seems jank. why split them up?

      const forwardMatches = findSequencesInLine(bgioArguments, lineSpaces, sequencePattern, minSequenceLength, context);
      matches.push(...forwardMatches);
      
      // Only reverse if needed (avoid creating new arrays unnecessarily)
      if (forwardMatches.length === 0 || sequencePattern.length > 1) {
        const reverseMatches = findSequencesInLine(bgioArguments, lineSpaces, sequencePattern, minSequenceLength, context, true);
        matches.push(...reverseMatches);
      }
    }
  }
  
  const result = { matches, conditionIsMet: !!matches.length };
  
  gridCache.set(cacheKey, {
    stateKey: gridStateKey,
    result
  });
  
  return result;
}
