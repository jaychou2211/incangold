import { GameEvent, GameEventName } from './game-event';
import { HazardType } from '../cards';

export enum RoundEndReason {
  AllExplorersRetrieved = 'AllExplorersRetrieved',
  SecondSameHazard = 'SecondSameHazard'
}

export interface RoundEndEvent extends GameEvent {
  readonly name: GameEventName.RoundEndEvent;
  readonly reason: RoundEndReason;
  // only if reason is RoundEndReason.SecondSameHazard
  readonly hazard?: HazardType | null;
}
