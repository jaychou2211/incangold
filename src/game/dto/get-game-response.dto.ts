import { addApiResponseExample, addApiResponseSchema } from '@helper/api-doc/api-response';
import { Expose, Type, Transform } from 'class-transformer';

class ArtifactCardDto {
  @Expose()
  type: string;

  @Expose()
  points: number;
}

class CardDto {
  @Expose()
  type: string;

  @Expose()
  points?: number;

  @Expose()
  hazard?: string;
}

class ExplorerDto {
  @Expose()
  id: string;

  @Expose()
  no: number;

  @Expose()
  position: string;
}

class CorridorDto {
  @Expose()
  remainingPoints: number;

  @Expose()
  @Type(() => ArtifactCardDto)
  artifacts: ArtifactCardDto[];

  @Expose()
  @Type(() => CardDto)
  cards: CardDto[];
}

class GetGameResponseDto {
  @Expose()
  id: string;

  @Expose()
  round: number;

  @Expose()
  turn: number;

  @Expose()
  @Type(() => ArtifactCardDto)
  artifactCards: ArtifactCardDto[];

  @Expose()
  @Type(() => CorridorDto)
  corridor: CorridorDto;

  @Expose()
  @Type(() => ExplorerDto)
  explorers: ExplorerDto[];

  @Expose()
  @Transform(({ obj }) => obj.deck?.length || 0)
  deckLength?: number;
}

addApiResponseSchema(GetGameResponseDto, {
  type: 'object',
  properties: {
    id: { type: 'string' },
    round: { type: 'number' },
    turn: { type: 'number' },
    artifactCards: { type: 'array', items: { type: 'object', properties: {
      type: { type: 'string' },
      points: { type: 'number' },
    } } },
    corridor: { type: 'object', properties: {
      remainingPoints: { type: 'number' },
      artifacts: { type: 'array', items: { type: 'object', properties: {
        type: { type: 'string' },
        points: { type: 'number' },
      } } },
      cards: { type: 'array', items: { type: 'object', properties: {
        type: { type: 'string' },
        points: { type: 'number' },
        hazard: { type: 'string' },
      } } },
    } },
    explorers: { type: 'array', items: { type: 'object', properties: {
      id: { type: 'string' },
      no: { type: 'number' },
      position: { type: 'string' },
    } } },
  },
});

addApiResponseExample(GetGameResponseDto, {
  id: 'game-1745854380720',
  round: 3,
  turn: 2,
  artifactCards: [
    { type: 'Artifact', points: 10 },
    { type: 'Artifact', points: 12 }
  ],
  corridor: {
    remainingPoints: 1,
    artifacts: [],
    cards: [{ type: 'Treasure', points: 5 }]
  },
  explorers: [
    {
      id: 'explorer1',
      no: 1,
      position: 'Corridor',
    },
    {
      id: 'explorer2',
      no: 2,
      position: 'Corridor',
    },
    {
      id: 'explorer3',
      no: 3,
      position: 'Camp',
    }
  ],
  deckLength: 29
});

export { GetGameResponseDto };