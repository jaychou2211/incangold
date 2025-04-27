import { GameEvent, GameEventName } from './game-event';
import { HazardType } from '../cards';

export interface HazardCardRevealedEvent extends GameEvent {
  readonly name: GameEventName.HazardCardRevealedEvent;
  readonly hazard: HazardType;
}
