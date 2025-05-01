import { gameApiTags, gameIdParam } from '@game/api-doc';
import { GameHistoryResponseDto } from '@game/dto';
import { getApiResponseMetadataFromDto } from '@helper/api-doc/api-response';
import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function GetHistoryApiDoc() {
  return applyDecorators(
    gameApiTags,
    ApiOperation({
      description: 'Get the history of cards discarded in each round of the game',
    }),
    gameIdParam,
    ApiOkResponse(getApiResponseMetadataFromDto(GameHistoryResponseDto)),
  );
}
