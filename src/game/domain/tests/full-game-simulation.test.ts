import { describe, it } from 'vitest';
import { 
  Game,
  Explorer,
  Decision,
  ExplorerPosition,
  GameEventName,
} from '../index';

describe('Full Game Automation', () => {
  const makeSmartDecision = (explorer: Explorer, game: Game): Decision => {
    // Count hazard cards in corridor
    const hazardCounts = new Map<string, number>();
    game.corridor.cards.forEach(card => {
      if (card.type === 'Hazard') {
        const hazardType = (card as any).hazardType;
        hazardCounts.set(hazardType, (hazardCounts.get(hazardType) || 0) + 1);
      }
    });
    
    // Check if any hazard type has appeared once
    const hazardRisk = Array.from(hazardCounts.values()).some(count => count === 1);
    
    // Consider points already collected
    const pointsRisk = explorer.points > 10;
    
    // Consider round and turn progress
    const roundRisk = game.round >= 4 && game.turn >= 5;
    
    // Calculate overall risk factor
    const riskFactor = (hazardRisk ? 0.4 : 0) + 
                       (pointsRisk ? 0.3 : 0) + 
                       (roundRisk ? 0.2 : 0);
    
    return Math.random() < riskFactor ? Decision.Retreat : Decision.Adventure;
  };
  const makeRandomDecision = (): Decision => ( Math.random() < 0.5 ? Decision.Retreat : Decision.Adventure);

  it('should complete a full game with 3-8 random players', () => {
    const playerCount = Math.floor(Math.random() * 6) + 3; // Generate 3-8 random players
    const explorerIds = Array.from({ length: playerCount }, (_, i) => `explorer${i + 1}`);
    const gameId = `game-${Date.now()}`;
    const game = Game.initialize(gameId, explorerIds);
    
    game.startRound();
    while (game.events.at(-1)?.name !== GameEventName.GameOverEvent && game.round <= 5) {
      game.explorers
        .filter(explorer => explorer.position === ExplorerPosition.Corridor && explorer.decision === Decision.NotYet)
        .forEach(explorer => {
          const decision = Math.random() < 0.5 ? makeSmartDecision(explorer, game) : makeRandomDecision();
          game.makeDecision(explorer.id, decision);
        });
    }

    /**
     * Debug
     */
    // console.dir(game.trashDeck, { depth: Infinity });
    // console.dir(game.events, { depth: Infinity });

    // console.log('Game over!');
    // console.log(`Number of players: ${playerCount}`);
    // console.log('Final scores:', finalScores);

    // const finalScores = game.explorers.map(explorer => ({
    //   id: explorer.id,
    //   totalPoints: explorer.camp.points + explorer.camp.artifacts.reduce((acc, artifact) => acc + artifact.points, 0),
    //   artifacts: explorer.camp.artifacts
    // }));
    // expect(finalScores.length).toBeGreaterThan(0);
    // const winner = finalScores.sort((a, b) => b.totalPoints - a.totalPoints)[0] as (typeof finalScores)[0];
    // console.log(`Winner: ${winner.id} Score: ${winner.totalPoints}`);
  });
});