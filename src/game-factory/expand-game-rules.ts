import find from "lodash/find.js";
import type {
  Entity,
  EntityAttributes,
  EntityMatcher,
  InitialPlacement,
  PhaseConfig,
} from "../types/bagel-types.js";
import type {
  AuthoredGameRules,
  GameRules,
  MoveDefinition,
  MoveForEach,
  MovePlaceNew,
} from "../types/expanded-game-types.js";
import transformJSON from "../utils/json-transformer.js";
import { AuthoredGameRulesSchema, parseOrThrow } from "../types/schemas/index.js";
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
    // Always ensure a single shared board is available for setup-time allocation.
    count: 1,
  },
  {
    name: "playerMarker",
    perPlayer: true,
    count: "Infinity",
  },
] as Entity[];

function isInvariantEntity (entity: Entity): boolean {
  // Keep this intentionally small + stable: these are engine-injected definitions used to bootstrap
  // bank slots / markers. They must not participate in default `sharedBoard` auto-placement, or
  // we'll try to "place sharedBoard onto sharedBoard" and exhaust the bank slot during setup.
  if ((entity as { entityType?: unknown }).entityType === "Space" && (entity as { name?: unknown }).name == null) {
    return true;
  }
  if ((entity as { entityType?: unknown }).entityType === "Board" && (entity as { name?: unknown }).name === "sharedBoard") {
    return true;
  }
  if ((entity as { name?: unknown }).name === "playerMarker") {
    return true;
  }
  return false;
}

function expandEntities (entities: Entity[] | undefined): Entity[] {
  return [
    ...invariantEntities,
    ...(entities || []),
  ];
}

type RulesWithPlacements = {
  sharedBoard?: EntityMatcher<EntityAttributes<Entity>>[];
  personalBoard?: EntityMatcher<EntityAttributes<Entity>>[];
  initialPlacements?: InitialPlacement[];
  initialMoves?: MoveDefinition[];
};

type PhaseRuleWithPlacements = PhaseConfig & RulesWithPlacements;

function expandInitialPlacements (
  rules: AuthoredGameRules | PhaseRuleWithPlacements,
  entities: Entity[]
): Record<string, unknown> {
  const next: Record<string, unknown> = { ...rules };

  if (next.sharedBoard) {
    const sharedBoard = next.sharedBoard as NonNullable<RulesWithPlacements["sharedBoard"]>;
    const sharedBoardPlacements: InitialPlacement[] = sharedBoard.map((matcher) => ({
      entity: matcher as InitialPlacement["entity"],
      destination: { name: "sharedBoard" },
    }));
    if (!next.initialPlacements) next.initialPlacements = [];
    next.initialPlacements = [
      ...sharedBoardPlacements,
      ...(next.initialPlacements as InitialPlacement[]),
    ];
  }

  if (next.personalBoard) {
    entities.push({
      entityType: "Board",
      name: "personalBoard",
      perPlayer: true,
    });
    const personalBoard = next.personalBoard as NonNullable<RulesWithPlacements["personalBoard"]>;
    const personalBoardPlacements: InitialPlacement[] = personalBoard.map((matcher) => ({
      entity: matcher as InitialPlacement["entity"],
      destination: {
        name: "personalBoard",
      },
    }));
    if (!next.initialPlacements) next.initialPlacements = [];
    next.initialPlacements = [
      ...personalBoardPlacements,
      ...(next.initialPlacements as InitialPlacement[]),
    ];
  }

  if (next.initialPlacements) {
    const initialPlacementMoves = (next.initialPlacements as InitialPlacement[]).map((placement) => {
      const { state, ...matcher } = placement.entity;
      const entityDefinition = find(entities, matcher) as Entity | undefined;

      if (placement.destination.name === "personalBoard") {
        return {
          moveType: "ForEach" as const,
          arguments: {
            targets: {
              type: "ctxPath",
              path: ["playOrder"],
            },
          },
          move: {
            moveType: "PlaceNew" as const,
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
        } satisfies MoveForEach;
      } else {
        return {
          moveType: "PlaceNew" as const,
          entity: {
            state,
            conditions: [{
              conditionType: "Is",
              matcher: matcher as EntityMatcher<EntityAttributes<Entity>>,
            }],
          },
          arguments: {
            destination: {
              conditions: [{
                conditionType: "Is",
                matcher: placement.destination as EntityMatcher<EntityAttributes<Entity>>,
              }],
            },
          },
        } satisfies MovePlaceNew;
      }
    });
    if (!next.initialMoves) next.initialMoves = [];
    next.initialMoves = [
      ...initialPlacementMoves,
      ...((next.initialMoves ?? []) as MoveDefinition[]),
    ];
    delete next.initialPlacements;
  }

  return next;
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

export default function expandGameRules (gameRules: AuthoredGameRules): GameRules {
  // Validate at the earliest authoring boundary so failures are actionable.
  parseOrThrow(AuthoredGameRulesSchema, gameRules, "expandGameRules: invalid authored game rules");
  const rules = transformJSON(gameRules, transformationRules);

  const entities = expandEntities(rules.entities);

  const sharedBoard = (rules.sharedBoard ??
    // Default: place authored entities onto the shared board at setup.
    // Do not include invariant engine entities (bank slot templates), or setup will try to
    // allocate/placement-drive engine scaffolding incorrectly.
    entities.filter((e) => !isInvariantEntity(e))
  ) as EntityMatcher<EntityAttributes<Entity>>[];
  const turn = rules.turn ?? { minMoves: 1, maxMoves: 1 };

  const expandedTopLevel = expandInitialPlacements(
    {
      ...rules,
      entities,
      sharedBoard,
      turn,
    },
    entities
  ) as Omit<AuthoredGameRules, "initialPlacements">;

  const expandedPhases = expandedTopLevel.phases
    ? Object.fromEntries(
        Object.entries(expandedTopLevel.phases).map(([phaseName, phaseRule]) => {
          const expandedPhase = expandInitialPlacements(
            phaseRule as PhaseRuleWithPlacements,
            entities
          ) as Omit<PhaseConfig, "initialPlacements">;
          return [phaseName, expandedPhase] as const;
        })
      )
    : undefined;

  const baseExpanded = {
    ...expandedTopLevel,
    entities,
    sharedBoard,
    turn,
    phases: expandedPhases,
  } as GameRules;

  if (gameRules.numPlayers) {
    baseExpanded.minPlayers = baseExpanded.maxPlayers = gameRules.numPlayers;
  }

  return baseExpanded;
}
