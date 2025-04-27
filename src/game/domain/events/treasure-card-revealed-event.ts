import { GameEvent, GameEventName } from './game-event';

export interface TreasureCardRevealedEvent extends GameEvent {
  readonly name: GameEventName.TreasureCardRevealedEvent;
  readonly points: number;
  readonly remainingPoints: number;
  readonly explorerIds: string[];
  readonly distributedPointsPerExplorer: number;
}
