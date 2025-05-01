import { Decision } from '@game/domain/explorer';
import { ExplorerPosition } from '@game/domain/explorer';
import { addApiResponseExample, addApiResponseSchema } from '@helper/api-doc/api-response';
import { Expose, Type } from 'class-transformer';

class ArtifactCardDto {
  @Expose()
  type: string;

  @Expose()
  points: number;
}

class CampDto {
  @Expose()
  points: number;

  @Expose()
  @Type(() => ArtifactCardDto)
  artifacts: ArtifactCardDto[];
}

class GetMyStatusDto {
  @Expose()
  id: string;

  @Expose()
  no: number;

  @Expose()
  points: number;

  @Expose()
  position: ExplorerPosition;

  @Expose()
  decision: Decision;

  @Expose()
  @Type(() => CampDto)
  camp: CampDto;
}

addApiResponseSchema(GetMyStatusDto, {
  type: 'object',
  properties: {
    id: { type: 'string' },
    no: { type: 'number' },
    points: { type: 'number' },
    position: { type: 'string', enum: Object.values(ExplorerPosition) },
    decision: { type: 'string', enum: Object.values(Decision) },
    camp: { 
      type: 'object', 
      properties: {
        points: { type: 'number' },
        artifacts: { 
          type: 'array', 
          items: { 
            type: 'object',
            properties: {
              type: { type: 'string' },
              points: { type: 'number' }
            }
          } 
        }
      }
    }
  }
});

addApiResponseExample(GetMyStatusDto, {
  id: 'explorer1',
  no: 1,
  points: 5,
  position: ExplorerPosition.Corridor,
  decision: Decision.NotYet,
  camp: {
    points: 12,
    artifacts: [
      { type: 'Artifact', points: 7 },
      { type: 'Artifact', points: 5 }
    ]
  }
});

export { GetMyStatusDto };
