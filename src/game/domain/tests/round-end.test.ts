import { describe, it, expect, beforeEach } from 'vitest';
import { 
  Explorer, 
  Decision, 
  ExplorerPosition, 
  Camp, 
  CardType, 
  HazardCard, 
  HazardType,
  GameEventName,
  RoundEndEvent,
  Corridor,
  TreasureCard,
  ArtifactCard,
  Game
} from '../index';
import { createGame } from './game-helper';

describe('Round End', () => {
  let explorers: [Explorer, Explorer, Explorer];
  
  beforeEach(() => {
    explorers = [
      new Explorer('explorer1', 1, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp),
      new Explorer('explorer2', 2, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp),
      new Explorer('explorer3', 3, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp),
    ];
  });

  it('should end round when all explorers retreat', () => {
    // arrange
    const game = createGame({
      id: 'game-test-1',
      round: 1,
      turn: 1,
      explorers
    });
    
    // act
    game.makeDecision('explorer1', Decision.Retreat);
    game.makeDecision('explorer2', Decision.Retreat);
    game.makeDecision('explorer3', Decision.Retreat);
    
    // assert
    expect(game.round).toBe(2);
    explorers.forEach(explorer => {
      expect(explorer.decision).toBe(Decision.NotYet);
      expect(explorer.position).toBe(ExplorerPosition.Corridor);
    });
    const roundEndEvent = game.events.find(
      event => event.name === GameEventName.RoundEndEvent
    );
    expect(roundEndEvent).toBeDefined();
  });
  it('should end round when same type of hazard appears twice', () => {
    // arrange
    const hazardCard1 = new HazardCard(CardType.Hazard, HazardType.Spider);
    const hazardCard2 = new HazardCard(CardType.Hazard, HazardType.Spider);
    const game = createGame({
      id: 'game-test-1',
      round: 1,
      turn: 2,
      explorers,
      corridor: new Corridor(0, [], [hazardCard1]),
      deck: [hazardCard2]
    });

    // act
    game.makeDecision('explorer1', Decision.Adventure);
    game.makeDecision('explorer2', Decision.Adventure);
    game.makeDecision('explorer3', Decision.Adventure);

    // assert round end event
    const roundEndEvent = game.events.find(
      event => event.name === GameEventName.RoundEndEvent
    ) as RoundEndEvent;
    expect(roundEndEvent.round).toBe(1);
    expect(roundEndEvent.turn).toBe(3);
    expect(roundEndEvent.hazard).toBe(HazardType.Spider);
    // assert explorers reset to new round
    expect(game.round).toBe(2);
    explorers.forEach(explorer => {
      expect(explorer.decision).toBe(Decision.NotYet);
      expect(explorer.position).toBe(ExplorerPosition.Corridor);
      expect(explorer.points).toBe(0);
    });
  });
  it('should clear all points and artifacts from corridor when round ends', () => {
    // arrange
    const game = createGame({
      id: 'game-test-1',
      round: 1,
      turn: 1,
      explorers,
      deck: [],
      corridor: new Corridor(1, [new ArtifactCard(CardType.Artifact, 11)], [new TreasureCard(CardType.Treasure, 10)]),
      suffuleDeck: false,
    });
    // Prevent deck shuffling when round starts
    // TODO: Consider a better approach
    Game.prototype.shuffleDeck = () => {};
    // act
    game.makeDecision('explorer1', Decision.Retreat);
    game.makeDecision('explorer2', Decision.Retreat);
    game.makeDecision('explorer3', Decision.Retreat); 
    // assert
    expect(game.corridor.remainingPoints).toBe(0);
    expect(game.corridor.artifacts.length).toBe(0);
    expect(game.corridor.cards.length).toBe(1);
    expect(game.corridor.cards[0]?.type).toBe(CardType.Artifact);
  });
  
}); 