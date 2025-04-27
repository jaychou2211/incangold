import { describe, it, expect, beforeEach } from 'vitest';
import { 
  Corridor, 
  Camp, 
  Explorer, 
  Decision, 
  ExplorerPosition,
  CardType, 
  ArtifactCard,
  GameEventName
} from '../index';
import { createGame } from './game-helper';

describe('Artifact Tests', () => {
  let explorers: [Explorer, Explorer, Explorer];
  let artifactCard: ArtifactCard;
  
  beforeEach(() => {
    // Setup test explorers
    explorers = [
      new Explorer('explorer1', 1, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp()),
      new Explorer('explorer2', 2, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp()),
      new Explorer('explorer3', 3, 0, ExplorerPosition.Corridor, Decision.NotYet, new Camp()),
    ];
    // Create a test artifact
    artifactCard = new ArtifactCard(CardType.Artifact, 5);
  });
  
  it('only one explorer gets artifact when retreating alone (1)', () => {
    // Corridor with artifact
    const corridor = new Corridor(0, [artifactCard], []);
    const game = createGame({
      id: 'game-test-1',
      round: 1,
      turn: 1,
      explorers,
      corridor
    });
    
    // First explorer retreats, others stay
    game.makeDecision('explorer1', Decision.Retreat);
    game.makeDecision('explorer2', Decision.Adventure);
    game.makeDecision('explorer3', Decision.Adventure);

    // Check artifact was taken
    expect(explorers[0].camp.artifacts.length).toBe(1);
    expect(explorers[0].camp.artifacts[0]).toBe(artifactCard);
    expect(game.corridor.artifacts.length).toBe(0);
  });

  it('only one explorer gets artifact when retreating alone (2)', () => {
    // Create three artifacts
    const artifactCard2 = new ArtifactCard(CardType.Artifact, 7);
    const artifactCard3 = new ArtifactCard(CardType.Artifact, 10);
    
    // Put multiple artifacts in corridor
    const corridor = new Corridor(0, [artifactCard, artifactCard2, artifactCard3], []);
    const game = createGame({
      id: 'game-test-1',
      round: 1,
      turn: 1,
      explorers,
      corridor
    });
    
    // Only first explorer retreats
    game.makeDecision('explorer1', Decision.Retreat);
    game.makeDecision('explorer2', Decision.Adventure);
    game.makeDecision('explorer3', Decision.Adventure);

    // Check all artifacts were taken
    expect(game.corridor.artifacts.length).toBe(0);
    expect(explorers[0].camp.artifacts.length).toBe(3);
    expect(explorers[0].camp.artifacts[0]).toBe(artifactCard);
    expect(explorers[0].camp.artifacts[1]).toBe(artifactCard2);
    expect(explorers[0].camp.artifacts[2]).toBe(artifactCard3);
  });
  
  it('no one gets artifact when multiple explorers retreat', () => {
    // Corridor with artifact
    const corridor = new Corridor(0, [artifactCard], []);
    const game = createGame({
      id: 'game-test-1',
      round: 1,
      turn: 1,
      explorers,
      corridor
    });
    
    // Two explorers retreat
    game.makeDecision('explorer1', Decision.Retreat);
    game.makeDecision('explorer2', Decision.Retreat);
    game.makeDecision('explorer3', Decision.Adventure);
    
    // Check artifact stayed in corridor
    expect(explorers[0].camp.artifacts.length).toBe(0);
    expect(explorers[1].camp.artifacts.length).toBe(0);
    expect(game.corridor.artifacts.length).toBe(1);
  });
  
  it('artifacts disappear at end of round', () => {
    // Corridor with artifact
    const corridor = new Corridor(0, [artifactCard], []);
    const game = createGame({
      id: 'game-test-1',
      round: 1,
      turn: 1,
      explorers,
      corridor
    });

    // All explorers retreat to end round
    game.makeDecision('explorer1', Decision.Retreat);
    game.makeDecision('explorer2', Decision.Retreat);
    game.makeDecision('explorer3', Decision.Retreat);
    
    // Check round ended and artifacts gone
    expect(game.events.some(event => event.name === GameEventName.RoundEndEvent)).toBe(true);
    expect(game.corridor.artifacts.length).toBe(0);
  });
}); 