import { gameApiTags } from '@game/api-doc';
import { StartGameDto } from '@game/dto';
import { getApiBodySchemaHostFromDto } from '@helper/api-doc';
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

export function StartGameApiDoc() {
  return applyDecorators(
    gameApiTags,
    ApiOperation({
      description: 'Start a new game with the given explorer id list.',
    }),
    ApiBody(getApiBodySchemaHostFromDto(StartGameDto)),
  );
}
