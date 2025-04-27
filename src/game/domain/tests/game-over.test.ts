import { describe, it, expect, beforeEach } from 'vitest';
import { 
  Explorer, 
  Decision, 
  ExplorerPosition,
  Camp,
  GameEventName,
  CardType,
  TreasureCard
} from '../index';
import { createGame } from './game-helper';
import { GameDomainException } from '../exception/domain-exception';

describe('Game Over Tests', () => {
  let explorers: [Explorer, Explorer, Explorer];
  
  beforeEach(() => {
    explorers = [
      new Explorer('explorer1', 1, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp()),
      new Explorer('explorer2', 2, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp()),
      new Explorer('explorer3', 3, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp()),
    ];
  });

  it('game ends after 5 rounds', () => {
    // Create a game in round 5
    const game = createGame({
      id: '',
      round: 5,
      turn: 1,
      explorers
    });
    
    // Make all explorers retreat to end the round
    game.makeDecision('explorer1', Decision.Retreat);
    game.makeDecision('explorer2', Decision.Retreat);
    game.makeDecision('explorer3', Decision.Retreat);
    
    // Verify game over event was triggered
    const gameOverEvent = game.events.find(
      event => event.name === GameEventName.GameOverEvent
    );
    expect(gameOverEvent).toBeDefined();
  });

  it("can't start new round after game over", () => {
    const game = createGame({
      id: '',
      round: 6,
      turn: 1,  
      explorers
    });
    expect(() => game.startRound()).toThrowError(GameDomainException);
  });
  
  it('does not end before 5 rounds are completed', () => {
    // Create games in rounds 1-4
    const rounds = [1, 2, 3, 4];
    
    for (const round of rounds) {
      const game = createGame({
        id: `game-test-${round}`,
        round,
        turn: 1,
        deck: [new TreasureCard(CardType.Treasure, 10)], // mock no hazard card 連續出現2次導致意外結束遊戲
        explorers: [...explorers],
      });
      
      // Make all explorers retreat to end the round
      game.makeDecision('explorer1', Decision.Retreat);
      game.makeDecision('explorer2', Decision.Retreat);
      game.makeDecision('explorer3', Decision.Retreat);
      
      // Verify game continues (no game over event)
      const gameOverEvent = game.events.find(
        event => event.name === GameEventName.GameOverEvent
      );
      expect(gameOverEvent).toBeUndefined();
      
      // Verify round incremented but game continues
      expect(game.round).toBe(round + 1);
    }
  });
}); 