import { Game } from '../index';

type GameOptions = 
  Partial<Game> & 
  Pick<Game, 'id' | 'round' | 'turn' | 'explorers'> & {
    suffuleDeck?: boolean;
  };

/**
 * Create a game instance
 * @param options - The options for the game
 * @param options.suffuleDeck - Whether to shuffle the deck when creating the game, default is true
 * @returns A game instance
 */
export function createGame(options: GameOptions) {
  const game = Game.initialize(options.id, []);
  game.explorers = options.explorers;
  game.round = options.round;
  game.turn = options.turn;
  if (options.artifactCards) {
    game.artifactCards = options.artifactCards;
  }
  if (options.deck) {
    game.deck = options.deck;
  }
  if (options.corridor) {
    game.corridor = options.corridor;
  }
  if (options.suffuleDeck ?? true) {
    game.shuffleDeck();
  }
  return game;
}
