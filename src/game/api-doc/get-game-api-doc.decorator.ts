import { gameApiTags, gameIdParam } from '@game/api-doc';
import { GetGameResponseDto } from '@game/dto';
import { getApiResponseMetadataFromDto } from '@helper/api-doc/api-response';
import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function GetGameApiDoc() {
  return applyDecorators(
    gameApiTags,
    ApiOperation({
      description: 'Get the current game state including corridor, explorers, and deck information',
    }),
    gameIdParam,
    ApiOkResponse(getApiResponseMetadataFromDto(GetGameResponseDto)),
  );
}
