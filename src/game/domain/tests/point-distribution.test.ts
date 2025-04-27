import { describe, it, expect, beforeEach } from 'vitest';
import {
  Corridor,
  Camp,
  Explorer,
  Decision,
  ExplorerPosition,
  CardType,
  TreasureCard,
  HazardCard,
  HazardType
} from '../index';
import { createGame } from './game-helper';

describe('Point Distribution', () => {
  let explorers: [Explorer, Explorer, Explorer];

  beforeEach(() => {
    explorers = [
      new Explorer('explorer1', 1, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp()),
      new Explorer('explorer2', 2, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp()),
      new Explorer('explorer3', 3, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp()),
    ];
  });

  describe('Treasure Card Point Distribution', () => {
    it('Should evenly distribute points that can be divided equally among all explorers', () => {
      const game = createGame({
        id: '',
        round: 1,
        turn: 0,
        deck: [new TreasureCard(CardType.Treasure, 9)],
        corridor: new Corridor(0, [], []),
        explorers,
      });
      (game as any).nextTurn();
      
      expect(explorers[0]?.points).toBe(3);
      expect(explorers[1]?.points).toBe(3);
      expect(explorers[2]?.points).toBe(3);
      expect(game.corridor.remainingPoints).toBe(0);
    });
    
    it('Should leave the remainder in the corridor when points cannot be divided equally', () => {
      const game = createGame({
        id: '',
        round: 1,
        turn: 0,
        deck: [new TreasureCard(CardType.Treasure, 10)],
        corridor: new Corridor(0, [], []),
        explorers,
      });
      (game as any).nextTurn();
      
      expect(explorers[0]?.points).toBe(3);
      expect(explorers[1]?.points).toBe(3);
      expect(explorers[2]?.points).toBe(3);
      expect(game.corridor.remainingPoints).toBe(1);
    });
    
    it('Should give all points to the explorer when there is only one', () => {
      const game = createGame({
        id: '',
        round: 1,
        turn: 0,
        deck: [new TreasureCard(CardType.Treasure, 7)],
        corridor: new Corridor(0, [], []),
        explorers: [explorers[0]],
      });
      (game as any).nextTurn();
      expect(game.explorers[0]?.points).toBe(7);
    });
  });

  describe('Point Distribution When Retreating', () => {
    it('Should evenly distribute remaining corridor points among retreating explorers', () => {
      const game = createGame({
        id: '',
        round: 1,
        turn: 1,
        deck: [new HazardCard(CardType.Hazard, HazardType.Flame)],
        corridor: new Corridor(5, [], []),
        explorers,
      });
      game.makeDecision('explorer1', Decision.Retreat);
      game.makeDecision('explorer2', Decision.Retreat);
      game.makeDecision('explorer3', Decision.Adventure);
      
      expect(explorers[0]?.camp.points).toBe(2);
      expect(explorers[1]?.camp.points).toBe(2);
      expect(explorers[2]?.camp.points).toBe(0);
      expect(game.corridor.remainingPoints).toBe(1);
    });
  });
}); 