import type { Card } from '@game/domain';
import { addApiResponseExample, addApiResponseSchema } from '@helper/api-doc/api-response';
import { Expose, Transform } from 'class-transformer';

type TrashDeck = {
  [round: string]: Card[];
}

class GameHistoryResponseDto {
  @Expose()
  @Transform(({ obj }) => {
    const result:TrashDeck = {};
    Object.entries(obj.trashDeck || {}).forEach(([round , cards]) => {
      result[round] = (cards as Card[]).map(card => ({
        type: card.type,
        points: 'points' in card ? card.points : undefined,
        hazard: 'hazard' in card ? card.hazard : undefined
      }));
    });
    return result;
  })
  history: TrashDeck;
}

addApiResponseSchema(GameHistoryResponseDto, {
  type: 'object',
  properties: {
    history: { 
      type: 'object',
      properties: Object.fromEntries([1, 2, 3, 4, 5].map(round => [
        String(round), 
        {
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              type: { type: 'string' },
              points: { type: 'number', nullable: true },
              hazard: { type: 'string', nullable: true }
            }
          }
        }
      ])),
      additionalProperties: false
    }
  },
});

addApiResponseExample(GameHistoryResponseDto, {
  history: {
    '1': [
      { type: 'Hazard', hazard: 'Mummy', points: undefined },
      { type: 'Treasure', points: 11, hazard: undefined },
      { type: 'Hazard', hazard: 'Spider', points: undefined },
      { type: 'Artifact', points: 5, hazard: undefined },
      { type: 'Hazard', hazard: 'Snake', points: undefined },
      { type: 'Treasure', points: 5, hazard: undefined }
    ],
    '2': [
      { type: 'Treasure', points: 15, hazard: undefined },
      { type: 'Hazard', hazard: 'Spider', points: undefined },
      { type: 'Hazard', hazard: 'Rockslide', points: undefined },
      { type: 'Treasure', points: 2, hazard: undefined },
      { type: 'Treasure', points: 9, hazard: undefined }
    ],
    '3': [
      { type: 'Treasure', points: 3, hazard: undefined },
      { type: 'Hazard', hazard: 'Flame', points: undefined },
      { type: 'Treasure', points: 5, hazard: undefined },
      { type: 'Treasure', points: 13, hazard: undefined },
      { type: 'Treasure', points: 7, hazard: undefined },
      { type: 'Hazard', hazard: 'Snake', points: undefined },
      { type: 'Treasure', points: 9, hazard: undefined }
    ],
    '4': [
      { type: 'Treasure', points: 3, hazard: undefined },
      { type: 'Hazard', hazard: 'Rockslide', points: undefined }
    ],
    '5': [
      { type: 'Treasure', points: 7, hazard: undefined },
      { type: 'Hazard', hazard: 'Spider', points: undefined },
      { type: 'Treasure', points: 17, hazard: undefined },
      { type: 'Artifact', points: 10, hazard: undefined },
      { type: 'Treasure', points: 5, hazard: undefined }
    ]
  }
});
export { GameHistoryResponseDto };
