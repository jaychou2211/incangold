import { describe, it, expect, beforeEach } from 'vitest';
import { 
  Camp,
  CardType,
  Corridor,
  Explorer,
  Decision,
  ExplorerPosition,
  HazardCard,
  HazardType,
  TreasureCard,
} from '../index';
import { createGame } from './game-helper';

describe('Hazard Handling', () => {
  let explorers: [Explorer, Explorer, Explorer];

  beforeEach(() => {
    explorers = [
      new Explorer('explorer1', 1, 0, ExplorerPosition.Corridor, Decision.Adventure, new Camp),
      new Explorer('explorer2', 2, 0, ExplorerPosition.Corridor, Decision.Adventure, new Camp),
      new Explorer('explorer3', 3, 0, ExplorerPosition.Corridor, Decision.Adventure, new Camp),
    ];
  });

  it('should end the round when the same type of hazard appears twice', () => {
    // arrange
    const game = createGame({
      id: '',
      round: 1,
      turn: 1,
      deck: [new TreasureCard(CardType.Treasure, 10), new HazardCard(CardType.Hazard, HazardType.Spider)],
      corridor: new Corridor(0, [], [new HazardCard(CardType.Hazard, HazardType.Spider)]),
      explorers,
      suffuleDeck: false,
    });
    // act
    (game as any).nextTurn();
    // assert
    expect(game.round).toBe(2);
    expect(game.turn).toBe(1);
  });
  it('should not trigger round end for different types of hazards', () => {
    // arrange
    const game = createGame({
      id: '',
      round: 1,
      turn: 1,
      deck: [new TreasureCard(CardType.Treasure, 10), new HazardCard(CardType.Hazard, HazardType.Flame)],
      corridor: new Corridor(0, [], [new HazardCard(CardType.Hazard, HazardType.Spider)]),
      explorers,
      suffuleDeck: false,
    });
    // act
    (game as any).nextTurn();
    // assert
    expect(game.round).toBe(1);
    expect(game.turn).toBe(2);
  });
  it('should cause explorers to lose all points from the current round when a hazard ends the round', () => {
    // arrange
    explorers.forEach(explorer => explorer.points = 10);
    const explorerWithCamp = new Explorer('explorer4', 4, 0, ExplorerPosition.Camp, Decision.Retreat, new Camp(10));
    const game = createGame({
      id: '',
      round: 1,
      turn: 1,
      deck: [new TreasureCard(CardType.Treasure, 10), new HazardCard(CardType.Hazard, HazardType.Flame)],
      corridor: new Corridor(0, [], [new HazardCard(CardType.Hazard, HazardType.Flame)]),
      explorers: [...explorers, explorerWithCamp],
      suffuleDeck: false,
    });
    // act
    (game as any).nextTurn();
    // assert
    expect(game.round).toBe(2);
    expect(game.turn).toBe(1);
    explorers.forEach(explorer => {
      expect(explorer.camp.points).toBe(0);
      expect(explorer.camp.artifacts.length).toBe(0);
    });
    expect(explorerWithCamp.camp.points).toBe(10);
  });
});
