import { GameEvent, GameEventName } from './game-event';
import { Decision } from '../explorer';

export interface AllExplorersMadeDecisionEvent extends GameEvent {
  readonly name: GameEventName.AllExplorersMadeDecisionEvent;
  readonly explorersMadDecisions: {
    [explorerId: string]: Decision;
  };
}
