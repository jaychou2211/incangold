import { HazardType } from '@game/domain/cards';
import { GameEventName, RoundEndReason } from '@game/domain/events';
import { Decision } from '@game/domain/explorer';
import { Schema } from '@helper/api-doc';
import { ApiResponseMetadata } from '@nestjs/swagger';

const EXPLORER_IDS = {
  EXPLORER_1: '9e8e5ea3-9964-4f3c-8329-32a0d5f63ce9',
  EXPLORER_2: 'b6a4f4c8-7269-4d7f-93d2-aac68f96ed4c',
  EXPLORER_3: 'c1b30acf-e39c-4d08-838e-615647b38cf2',
  EXPLORER_4: 'd2c4bfc3-5316-4f6e-9052-8a636e193149'
};

const gameEventProperties: Record<string, Schema> = {
  name: { type: 'string' },
  round: { type: 'number' },
  turn: { type: 'number' },
};

const artifactCardRevealedEventSchema: Schema = {
  type: 'object',
  title: GameEventName.ArtifactCardRevealedEvent,
  properties: {
    ...gameEventProperties,
    name: { type: 'string', enum: [GameEventName.ArtifactCardRevealedEvent] },
    artifact: { type: 'object', properties: {
      type: { type: 'string' , enum: ['artifact']},
      points: { type: 'number' },
    } },
  },
  example: {
    name: GameEventName.ArtifactCardRevealedEvent,
    round: 1,
    turn: 3,
    artifact: { type: 'artifact', points: 7 },
  },
};

const treasureCardRevealedEventSchema: Schema = {
  type: 'object',
  title: GameEventName.TreasureCardRevealedEvent,
  properties: {
    ...gameEventProperties,
    name: { type: 'string', enum: [GameEventName.TreasureCardRevealedEvent] },
    points: { type: 'number' },
    remainingPoints: { type: 'number' },
    explorerIds: { type: 'array', items: { type: 'string' } },
    distributedPointsPerExplorer: { type: 'number' },
  },
  example: {
    name: GameEventName.TreasureCardRevealedEvent,
    round: 1,
    turn: 4,
    points: 15,
    remainingPoints: 3,
    explorerIds: [
      EXPLORER_IDS.EXPLORER_1, 
      EXPLORER_IDS.EXPLORER_2, 
      EXPLORER_IDS.EXPLORER_3, 
      EXPLORER_IDS.EXPLORER_4
    ],
    distributedPointsPerExplorer: 3,
  },
};

const hazardCardRevealedEventSchema: Schema = {
  type: 'object',
  title: GameEventName.HazardCardRevealedEvent,
  properties: {
    ...gameEventProperties,
    name: { type: 'string', enum: [GameEventName.HazardCardRevealedEvent] },
    hazard: { type: 'string', enum: Object.values(HazardType) },
  },
  example: {
    name: GameEventName.HazardCardRevealedEvent,
    round: 1,
    turn: 5,
    hazard: HazardType.Snake,
  },
};

const oneExplorerMadeDecisionEventSchema: Schema = {
  type: 'object',
  title: GameEventName.OneExplorerMadeDecisionEvent,
  properties: {
    ...gameEventProperties,
    name: { type: 'string', enum: [GameEventName.OneExplorerMadeDecisionEvent] },
    explorerId: { type: 'string' },
  },
  example: {
    name: GameEventName.OneExplorerMadeDecisionEvent,
    round: 1,
    turn: 5,
    explorerId: EXPLORER_IDS.EXPLORER_3,
  },
};

const allExplorersMadeDecisionEventSchema: Schema = {
  type: 'object',
  title: GameEventName.AllExplorersMadeDecisionEvent,
  properties: {
    ...gameEventProperties,
    name: { type: 'string', enum: [GameEventName.AllExplorersMadeDecisionEvent] },
    explorersMadDecisions: { 
      type: 'object',
      additionalProperties: { 
        type: 'string', 
        enum: Object.values(Decision) 
      },
    },
  },
  example: {
    name: GameEventName.AllExplorersMadeDecisionEvent,
    round: 1,
    turn: 5,
    explorersMadDecisions: {
      [EXPLORER_IDS.EXPLORER_1]: Decision.Adventure,
      [EXPLORER_IDS.EXPLORER_2]: Decision.Retreat,
      [EXPLORER_IDS.EXPLORER_3]: Decision.Adventure,
      [EXPLORER_IDS.EXPLORER_4]: Decision.Adventure,
    },
  },
};

const returnedToCampEventSchema: Schema = {
  type: 'object',
  title: GameEventName.ReturnedToCampEvent,
  properties: {
    ...gameEventProperties,
    name: { type: 'string', enum: [GameEventName.ReturnedToCampEvent] },
    remainingPointsInCorridor: { type: 'number' },
    explorersMap: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          pointsCarried: { type: 'number' },
          pointsFromCorridor: { type: 'number' },
          artifacts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['artifact'] },
                points: { type: 'number' },
              },
            },
          },
        },
      },
    },
  },
  example: {
    name: GameEventName.ReturnedToCampEvent,
    round: 1,
    turn: 5,
    remainingPointsInCorridor: 5,
    explorersMap: {
      [EXPLORER_IDS.EXPLORER_2]: {
        pointsCarried: 12,
        pointsFromCorridor: 5,
        artifacts: [{ type: 'artifact', points: 5 }],
      }
    },
  },
};

const roundEndEventSchema: Schema = {
  type: 'object',
  title: GameEventName.RoundEndEvent,
  properties: {
    ...gameEventProperties,
    name: { type: 'string', enum: [GameEventName.RoundEndEvent] },
    reason: { type: 'string', enum: Object.values(RoundEndReason) },
    hazard: { type: 'string', enum: Object.values(HazardType) },
  },
  example: {
    name: GameEventName.RoundEndEvent,
    round: 1,
    turn: 7,
    reason: RoundEndReason.SecondSameHazard,
    hazard: HazardType.Snake,
  },
};

const gameOverEventSchema: Schema = {
  type: 'object',
  title: GameEventName.GameOverEvent,
  properties: {
    ...gameEventProperties,
    name: { type: 'string', enum: [GameEventName.GameOverEvent] },
  },
  example: {
    name: GameEventName.GameOverEvent,
    round: 5,
    turn: 3,
  },
};

export const eventsResponseMetadata = {
  isArray: true,
  content: {
    'application/json': {
      schema: { 
        type: 'array', 
        items: { 
          type: 'object', 
          anyOf: [
            artifactCardRevealedEventSchema,
            treasureCardRevealedEventSchema,
            hazardCardRevealedEventSchema,
            oneExplorerMadeDecisionEventSchema,
            allExplorersMadeDecisionEventSchema,
            returnedToCampEventSchema,
            roundEndEventSchema,
            gameOverEventSchema,
          ],
        },
      },
    },
  },
} satisfies ApiResponseMetadata;

export type GameEventDto = {
  name: GameEventName;
  round: number;
  turn: number;
}
