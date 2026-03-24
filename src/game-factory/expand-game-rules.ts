import find from "lodash/find.js";
import type { Entity, EntityMatcher, EntityAttributes, GameFactoryInput, ExpandedGameRules, MoveDefinition } from "../types/bagel-types.js";
import transformJSON from "../utils/json-transformer.js";

type TransformRule = {
  test: (val: unknown) => boolean;
  replace: (val: unknown) => unknown;
};

const invariantEntities = [
  {
    entityType: "Space",
    count: "Infinity",
  },
  {
    entityType: "Board",
    name: "sharedBoard",
  },
  {
    name: "playerMarker",
    perPlayer: true,
    count: "Infinity",
  },
] as Entity[];

function expandEntities (rules: { entities: Entity[] }) {
  rules.entities = [
    ...invariantEntities,
    ...(rules.entities || []),
  ];
}

function expandInitialPlacements (rules: Record<string, unknown>, entities: Entity[]) {
  if (rules.sharedBoard) {
    const sharedBoard = rules.sharedBoard as EntityMatcher<EntityAttributes<Entity>>[];
    const sharedBoardPlacements = sharedBoard.map((matcher) => ({ entity: matcher, destination: { name: "sharedBoard" } }));
    if (!rules.initialPlacements) rules.initialPlacements = [];
    (rules.initialPlacements as unknown[]).unshift(...sharedBoardPlacements);
  }

  if (rules.personalBoard) {
    entities.push({
      entityType: "Board",
      name: "personalBoard",
      perPlayer: true,
    });
    const personalBoard = rules.personalBoard as EntityMatcher<EntityAttributes<Entity>>[];
    const personalBoardPlacements = personalBoard.map((matcher) => ({
      entity: matcher,
      destination: {
        name: "personalBoard",
      },
    }));
    if (!rules.initialPlacements) rules.initialPlacements = [];
    (rules.initialPlacements as unknown[]).unshift(...personalBoardPlacements);
  }

  if (rules.initialPlacements) {
    const initialPlacementMoves = (rules.initialPlacements as Array<{ entity: Record<string, unknown>; destination: { index?: number; name?: string } }>).map((placement) => {
      const { state, ...matcher } = placement.entity;
      const entityDefinition = find(entities, matcher) as Entity | undefined;

      if (placement.destination.name === "personalBoard") {
        return {
          moveType: "ForEach",
          arguments: {
            targets: {
              type: "ctxPath",
              path: ["playOrder"],
            },
          },
          move: {
            moveType: "PlaceNew",
            entity: {
              state,
              conditions: [{
                conditionType: "Is",
                matcher: {
                  ...matcher,
                  ...(entityDefinition?.perPlayer
                    ? {
                        player: {
                          type: "contextPath",
                          path: ["loopTarget"],
                        },
                      }
                    : {}
                  ),
                },
              }],
            },
            arguments: {
              destination: {
                conditions: [{
                  conditionType: "Is",
                  matcher: {
                    ...placement.destination,
                    player: {
                      type: "contextPath",
                      path: ["loopTarget"],
                    },
                  },
                }],
              },
            },
          },
        } as MoveDefinition;
      } else {
        return {
          moveType: "PlaceNew",
          entity: {
            state,
            conditions: [{
              conditionType: "Is",
              matcher,
            }],
          },
          arguments: {
            destination: {
              conditions: [{
                conditionType: "Is",
                matcher: placement.destination,
              }],
            },
          },
        } as MoveDefinition;
      }
    });
    if (!rules.initialMoves) rules.initialMoves = [];
    (rules.initialMoves as MoveDefinition[]).unshift(...initialPlacementMoves);
    delete rules.initialPlacements;
  }
}

const keyMappings: [string, string][] = [];

const simpleReplacements: [string, unknown][] = [
  [
    "isCurrentPlayer",
    {
      conditionType: "Is",
      matcher: {
        player: {
          type: "ctxPath",
          path: ["currentPlayer"],
        },
      },
    },
  ],
  [
    "isEmpty",
    {
      conditionType: "Not",
      conditions: [{ conditionType: "Contains" }],
    },
  ],
  [
    "ownerOfFirstResultEntity",
    {
      type: "contextPath",
      path: ["results", 0, "matches", 0, 0, "entities", 0, "attributes", "player"],
    },
  ],
];

const transformationRules: TransformRule[] = [
  {
    test: (val) => Boolean(val && typeof val === "object"),
    replace: (val) => {
      const obj = val as Record<string, unknown>;
      keyMappings.forEach(([oldKey, newKey]) => {
        if (Object.prototype.hasOwnProperty.call(obj, oldKey)) {
          obj[newKey] = obj[oldKey];
          delete obj[oldKey];
        }
      });
      return val;
    },
  },
  {
    test: (val) => typeof val === "string",
    replace: (val) => {
      for (let i = 0, len = simpleReplacements.length; i < len; i++) {
        if (val === simpleReplacements[i][0]) {
          return simpleReplacements[i][1];
        }
      }
      return val;
    },
  },
  {
    test: (val) => Boolean(val && typeof val === "object" && (val as { conditions?: unknown }).conditions),
    replace: (val) => {
      const v = val as { conditions: unknown };
      if (!Array.isArray(v.conditions)) {
        v.conditions = [v.conditions];
      }
      return val;
    },
  },
  {
    test: (val) => Boolean(val && typeof val === "object" && (val as { conditions?: unknown }).conditions),
    replace: (val) => {
      const v = val as { conditions: Array<Record<string, unknown>> };
      for (let i = 0, len = v.conditions.length; i < len; i++) {
        if (!v.conditions[i].conditionType) {
          v.conditions[i] = {
            conditionType: "Is",
            matcher: v.conditions[i],
          };
        }
      }
      return val;
    },
  },
  {
    test: (val) => Boolean(val && typeof val === "object" && typeof (val as { target?: unknown }).target === "string"),
    replace: (val) => {
      const v = val as { target: string };
      return {
        ...v,
        target: {
          conditions: [{
            conditionType: "Is",
            matcher: {
              name: v.target,
            },
          }],
        },
      };
    },
  },
];

export default function expandGameRules (gameRules: GameFactoryInput): ExpandedGameRules {
  const rules = transformJSON(gameRules, transformationRules) as GameFactoryInput;

  if (!rules.sharedBoard) {
    rules.sharedBoard = rules.entities as unknown as GameFactoryInput["sharedBoard"];
  }

  if (!rules.turn) {
    rules.turn = {
      minMoves: 1,
      maxMoves: 1,
    };
  }

  expandEntities(rules);
  expandInitialPlacements(rules as unknown as Record<string, unknown>, rules.entities);

  if (rules.phases) {
    Object.entries(rules.phases).forEach((phaseRule) => {
      expandInitialPlacements(phaseRule as unknown as Record<string, unknown>, rules.entities);
    });
  }

  if (gameRules.numPlayers) {
    gameRules.minPlayers = gameRules.maxPlayers = gameRules.numPlayers;
  }

  return rules as ExpandedGameRules;
}
