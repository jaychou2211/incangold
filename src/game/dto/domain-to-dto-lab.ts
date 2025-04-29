import 'reflect-metadata';
import { Camp } from '@game/domain/camp';
import { Decision } from '@game/domain/explorer';
import { ExplorerPosition } from '@game/domain/explorer';
import { Explorer } from '@game/domain/explorer';
import { createGame } from '@game/domain/tests/game-helper';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { GameHistoryResponseDto } from './game-history-response.dto';

const explorers: [Explorer, Explorer, Explorer] = [
  new Explorer('explorer1', 1, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp),
  new Explorer('explorer2', 2, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp),
  new Explorer('explorer3', 3, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp),
];

const game = createGame({
  id: 'game-1745854380720',
  round: 3,
  turn: 1,
  explorers,
});

game.makeDecision(explorers[0].id, Decision.Adventure);
game.makeDecision(explorers[1].id, Decision.Adventure);
game.makeDecision(explorers[2].id, Decision.Retreat);
game.makeDecision(explorers[0].id, Decision.Adventure);
game.makeDecision(explorers[1].id, Decision.Adventure);
game.makeDecision(explorers[0].id, Decision.Adventure);
game.makeDecision(explorers[1].id, Decision.Adventure);
game.makeDecision(explorers[0].id, Decision.Retreat);
game.makeDecision(explorers[1].id, Decision.Retreat);

const plainGame = instanceToPlain(game);
const dto = plainToInstance(GameHistoryResponseDto, plainGame, {
  excludeExtraneousValues: true,
});

console.dir(dto, { depth: Infinity });