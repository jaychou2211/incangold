import { gameApiTags, gameIdParam } from '@game/api-doc';
import { eventsResponseMetadata } from '@game/dto';
import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function GetEventsApiDoc() {
  return applyDecorators(
    gameApiTags,
    ApiOperation({
      description: 'Get all events that have occurred during the game, such as card revelations, round endings, and explorer decisions',
    }),
    gameIdParam,
    ApiOkResponse(eventsResponseMetadata),
  );
}
