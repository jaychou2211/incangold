import { gameApiTags, gameIdParam } from '@game/api-doc';
import { MakeDecisionDto } from '@game/dto';
import { getApiBodySchemaHostFromDto } from '@helper/api-doc';
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

export function MakeDecisionApiDoc() {
  return applyDecorators(
    gameApiTags,
    ApiOperation({
      description: 'Make a decision for an explorer to continue the adventure or retreat to camp',
    }),
    gameIdParam,
    ApiBody(getApiBodySchemaHostFromDto(MakeDecisionDto)),
  );
}
