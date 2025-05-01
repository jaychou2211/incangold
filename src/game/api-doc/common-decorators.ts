import { ApiParam, ApiTags } from '@nestjs/swagger';

export const gameIdParam = ApiParam({
  name: 'gameId',
  description: 'Game identifier',
  required: true,
  type: 'uuid',
});

export const gameApiTags = ApiTags('Game API');
