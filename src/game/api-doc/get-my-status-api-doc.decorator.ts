import { gameApiTags, gameIdParam } from '@game/api-doc';
import { GetMyStatusDto } from '@game/dto';
import { getApiResponseMetadataFromDto } from '@helper/api-doc/api-response';
import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function GetMyStatusApiDoc() {
  return applyDecorators(
    gameApiTags,
    ApiOperation({
      description: 'Get the authenticated player\'s own explorer status including points, position, decision, and camp information',
    }),
    gameIdParam,
    ApiOkResponse(getApiResponseMetadataFromDto(GetMyStatusDto)),
  );
}
