import { ArtifactCard } from '../cards';
import { GameEvent, GameEventName } from './game-event';

export interface ReturnedToCampEvent extends GameEvent {
  readonly name: GameEventName.ReturnedToCampEvent;
  readonly remainingPointsInCorridor: number;
  readonly explorersMap : {
    [ exploerId : string ] : {
      pointsCarried: number;
      pointsFromCorridor: number;
      artifacts: ArtifactCard[];
    }
  }
}
