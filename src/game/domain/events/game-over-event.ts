import { GameEvent, GameEventName } from './game-event';

export interface GameOverEvent extends GameEvent {
  readonly name: GameEventName.GameOverEvent;
}
