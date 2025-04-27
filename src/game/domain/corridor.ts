import { ArtifactCard, Card, CardType, HazardCard, HazardType, TreasureCard } from './cards';

/**
 * Corridor represents a passage in the Inca temple.
 * It contains :
 * 1. the remaining points(gems) that couldn't be evenly distributed among explorers,
 * 2. artifacts discovered within the temple, 
 * 3. all cards for the current round in sequence.
 */
export class Corridor {
  constructor(
    public remainingPoints: number,
    public artifacts: ArtifactCard[],
    public cards: Card[]
  ) { }

  addCard(card: Card) {
    this.cards.push(card);
  }

  hasDuplicateHazard(hazardType: HazardType) {
    return this.cards.filter(card => 
      card.type === CardType.Hazard &&
      (card as HazardCard).hazard === hazardType
    ).length > 1;
  }

  get treasureCards(): TreasureCard[] {
    return this.cards.filter(card => card.type === CardType.Treasure) as TreasureCard[];
  }

  clear() {
    this.cards = [];
    this.remainingPoints = 0;
    this.artifacts = [];
  }
} 