import { Camp } from './camp';
import { ArtifactCard } from './cards';

export enum ExplorerPosition {
  Camp = 'Camp',
  Corridor = 'Corridor'
};

export enum Decision {
  Adventure = 'Adventure',
  Retreat = 'Retreat',
  NotYet = 'NotYet'
};

export class Explorer {
  constructor(
    public readonly id: string,
    public readonly no: number,
    public points: number,
    public position: ExplorerPosition,
    public decision: Decision,
    public camp: Camp,
  ) {}

  makeDecision(decision: Decision) {
    this.decision = decision;
  }

  returnToCamp(additionalPoints: number = 0, artifacts: ArtifactCard[] = []) {
    // Move current points(aka gems) and artifacts to camp
    this.camp.points += (this.points + additionalPoints);
    this.camp.artifacts.push(...artifacts);  
    // Change position to Camp
    this.position = ExplorerPosition.Camp;
    this.points = 0;
  }
}
