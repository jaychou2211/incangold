import { Controller, Post, Put, Get, Body, Param } from '@nestjs/common';
import { 
  GetEventsApiDoc, 
  GetGameApiDoc, 
  GetHistoryApiDoc,
  GetMyStatusApiDoc,
  MakeDecisionApiDoc,
  StartGameApiDoc
} from './api-doc';
import { 
  StartGameDto, 
  MakeDecisionDto, 
  GetMyStatusDto, 
  GameEventDto, 
  GameHistoryResponseDto, 
  GetGameResponseDto 
} from './dto';

@Controller('game')
export class GameController {
  @Post()
  @StartGameApiDoc()
  startGame(@Body() startGameDto: StartGameDto) {
    console.log(startGameDto);
    // throw new Error('Not implemented');
  }

  @Put(':gameId/make-decision')
  @MakeDecisionApiDoc()
  makeDecision(
    @Param('gameId') gameId: string,
    @Body() decisionData: MakeDecisionDto
  ) {
    console.log(gameId);
    console.dir(decisionData, { depth: null });
    // throw new Error('Not implemented');
  }

  @Get(':gameId')
  @GetGameApiDoc()
  getGame(@Param('gameId') gameId: string): GetGameResponseDto {
    console.log(gameId);
    // throw new Error('Not implemented');
    return null as unknown as GetGameResponseDto;
  }

  @Get(':gameId/explorer/me')
  @GetMyStatusApiDoc()
  getMyStatus(@Param('gameId') gameId: string): GetMyStatusDto {
    console.log(gameId);
    // throw new Error('Not implemented');
    return null as unknown as GetMyStatusDto;
  }

  @Get(':gameId/events')
  @GetEventsApiDoc()
  getEvents(@Param('gameId') gameId: string): GameEventDto[] {
    console.log(gameId);
    // throw new Error('Not implemented');
    return null as unknown as GameEventDto[];
  }

  @Get(':gameId/history')
  @GetHistoryApiDoc()
  getHistory(@Param('gameId') gameId: string): GameHistoryResponseDto {
    console.log(gameId);
    // throw new Error('Not implemented');
    return null as unknown as GameHistoryResponseDto;
  }
}
