import { GameEvent, GameEventName } from './game-event';
import { ArtifactCard } from '../cards';

export interface ArtifactCardRevealedEvent extends GameEvent {
  readonly name: GameEventName.ArtifactCardRevealedEvent;
  readonly artifact: ArtifactCard;
}
