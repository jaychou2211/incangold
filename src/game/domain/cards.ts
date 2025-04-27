export enum CardType {
  Treasure = 'Treasure',
  Artifact = 'Artifact',
  Hazard = 'Hazard'
};

export type Card = {
  readonly type: CardType;
}
// -------------------------------------------------------------------------
// Treasure Card
// -------------------------------------------------------------------------
export class TreasureCard implements Card {
  constructor(
    public readonly type: CardType.Treasure,
    public readonly points: number
  ) {}
}
// -------------------------------------------------------------------------
// Artifact Card
// -------------------------------------------------------------------------
export class ArtifactCard implements Card {
  constructor(
    public readonly type: CardType.Artifact,
    public readonly points: number,
  ) {}
}
// -------------------------------------------------------------------------
// Hazard Card
// -------------------------------------------------------------------------
export enum HazardType {
  Spider = 'Spider',
  Snake = 'Snake',
  Flame = 'Flame',
  Rockslide = 'Rockslide',
  Mummy = 'Mummy'
}

export class HazardCard implements Card {
  constructor(
    public readonly type: CardType.Hazard,
    public readonly hazard: HazardType
  ) {}
} 