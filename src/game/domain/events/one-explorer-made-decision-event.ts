import { GameEvent, GameEventName } from './game-event';

export interface OneExplorerMadeDecisionEvent extends GameEvent {
  readonly name: GameEventName.OneExplorerMadeDecisionEvent;
  readonly explorerId: string;
}
