import { getApiBodySchemaHostFromDto } from '@helper/api-doc';
import { getApiResponseMediaTypeObjectFromDto } from '@helper/api-doc/api-response';
import { Controller, Post, Put, Get, Body, Param } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { StartGameDto } from './dto';
import { GameHistoryResponseDto } from './dto/game-history-response.dto';
import { GetGameResponseDto } from './dto/get-game-response.dto';
import { MakeDecisionDto } from './dto/make-decision.dto';

@Controller('game')
export class GameController {
  @Post()
  @ApiBody(getApiBodySchemaHostFromDto(StartGameDto))
  startGame(@Body() startGameDto: StartGameDto) {
    console.log(startGameDto);
    // throw new Error('Not implemented');
  }

  @Put(':gameId/make-decision')
  @ApiBody(getApiBodySchemaHostFromDto(MakeDecisionDto))
  makeDecision(
    @Param('gameId') gameId: string,
    @Body() decisionData: MakeDecisionDto
  ) {
    console.log(gameId);
    console.dir(decisionData, { depth: null });
    // throw new Error('Not implemented');
  }

  @Get(':gameId')
  @ApiOkResponse({
    content: {
      'application/json': getApiResponseMediaTypeObjectFromDto(GetGameResponseDto)
    }})
  getGame(@Param('gameId') gameId: string) {
    console.log(gameId);
    // throw new Error('Not implemented');
  }

  @Get(':gameId/events')
  getEvents(@Param('gameId') gameId: string) {
    console.log(gameId);
    // throw new Error('Not implemented');
  }

  @Get(':gameId/history')
  @ApiOkResponse({
    content: {
      'application/json': getApiResponseMediaTypeObjectFromDto(GameHistoryResponseDto)
    }})
  getHistory(@Param('gameId') gameId: string) {
    console.log(gameId);
    // throw new Error('Not implemented');
  }
}
