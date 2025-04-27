import { Camp } from './camp';
import { ArtifactCard, Card, HazardCard, CardType, TreasureCard, HazardType } from './cards';
import { Corridor } from './corridor';
import {
  GameEvent,
  GameEventName,
  HazardCardRevealedEvent,
  ReturnedToCampEvent,
  RoundEndEvent,
  RoundEndReason,
  TreasureCardRevealedEvent,
  GameOverEvent,
  ArtifactCardRevealedEvent,
  OneExplorerMadeDecisionEvent
} from './events';
import { GameDomainException } from './exception/domain-exception';
import { Explorer, Decision, ExplorerPosition } from './explorer';

export class Game {
  constructor(
    public readonly id: string,
    public round: number = 1,
    public turn: number = 0,
    // cards related
    public artifactCards: ArtifactCard[],
    public deck: Card[],
    public trashDeck: {
      [round: number]: Card[];
    },
    public corridor: Corridor,
    // explorers related
    public explorers: Explorer[],
    // events
    public events: GameEvent[]
  ) { }

  static initialize(
    id: string,
    explorerIds: string[],
  ) {
    // prepare artifacts cards
    const artifactPoints = [5, 7, 8, 10, 12];
    const artifactCards= artifactPoints.map(points => 
      new ArtifactCard(CardType.Artifact, points)
    );
    // prepare hazard cards 
    const hazardCards = Object.values(HazardType).flatMap(hazardType => Array(3)
      .fill(new HazardCard(CardType.Hazard, hazardType))
    ) satisfies HazardCard[];
    // prepare treasure cards
    const treasurePoints = [1, 2, 3, 4, 5, 5, 7, 7, 9, 11, 11, 13, 14, 15, 17];
    const treasureCards = treasurePoints.map(points => 
      new TreasureCard(CardType.Treasure, points)
    );

    // prepare deck
    const deck = [...treasureCards, ...hazardCards];
    // prepare trashDeck
    const trashDeck = {};
    // prepare corridor
    const corridor = new Corridor(0, [], []);
    // prepare explorers from explorerIds
    const explorers = explorerIds.map((explorerId, index) => {
      const camp = new Camp();
      return new Explorer(
        explorerId,
        index + 1,
        0,
        ExplorerPosition.Corridor,
        Decision.NotYet,
        camp,
      );
    });
    
    // prepare events
    const events: GameEvent[] = [];
    
    return new Game(
      id,
      1, // Starting from round 1
      0, // Turn starts at 0
      artifactCards,
      deck,
      trashDeck,
      corridor,
      explorers,
      events
    );
  }

  // -------------------------------------------------------------------------
  // public methods
  // -------------------------------------------------------------------------
  startRound() {
    if( this.round > 5) {
      throw new GameDomainException('GAME_ALREADY_ENDED');
    }
    // Draw an artifact card into the deck
    const artifactCard = this.artifactCards.shift();
    if (!artifactCard) {
      throw new GameDomainException('NO_ARTIFACT_CARD_IN_DECK');
    }
    this.deck.push(artifactCard);
    this.shuffleDeck();
    this.nextTurn();
  }

  makeDecision(explorerId: string, decision: Decision) {
    // validate
    const explorer = this.explorers.find(({ id }) => id === explorerId);
    if (!explorer) {
      throw new GameDomainException('EXPLORER_NOT_FOUND', { explorerId });
    }
    if (explorer.decision !== Decision.NotYet) {
      throw new GameDomainException('EXPLORER_ALREADY_MADE_DECISION', { explorerId, decision: explorer.decision });
    }
    if (explorer.position !== ExplorerPosition.Corridor) {
      throw new GameDomainException('EXPLORER_NOT_IN_CORRIDOR', { explorerId, position: explorer.position });
    }
    // make decision and generate event
    explorer.makeDecision(decision);
    this.events.push({
      name: GameEventName.OneExplorerMadeDecisionEvent,
      round: this.round,
      turn: this.turn,
      explorerId,
    } satisfies OneExplorerMadeDecisionEvent as GameEvent);

    if (this.isAllExploersMadeDecisions()) {
      this.someExplorersReturnToCamp();
      if (this.explorersInCorridor.length === 0) {
        const event = {
          name: GameEventName.RoundEndEvent,
          round: this.round,
          turn: this.turn,
          reason: RoundEndReason.AllExplorersRetrieved,
        } satisfies RoundEndEvent;
        this.events.push(event);
        return this.endRound();
      }
      return this.nextTurn();
    }
  }

  // -------------------------------------------------------------------------
  // private methods
  // -------------------------------------------------------------------------
  private someExplorersReturnToCamp() {
    const retreatingExplorers = this.explorersInCorridor
      .filter(explorer => explorer.decision === Decision.Retreat);
    if (retreatingExplorers.length === 0) {
      return; // No one is retreating
    }
    // Distribute remaining points in corridor
    const pointsPerExplorer = Math.floor(this.corridor.remainingPoints / retreatingExplorers.length);
    const remainingPointsAfterDistribution = this.corridor.remainingPoints % retreatingExplorers.length;
    // Process each retreating explorer
    const explorersMap = retreatingExplorers.reduce((partialPayload, explorer) => {
      const artifacts = retreatingExplorers.length === 1 ? this.corridor.artifacts : [];
      const returnedToCampEventPayload = {
        pointsCarried: explorer.points,
        pointsFromCorridor: pointsPerExplorer,
        artifacts,
      };
      explorer.returnToCamp(pointsPerExplorer, artifacts); // mutate explorer
      partialPayload[explorer.id] = returnedToCampEventPayload;
      return partialPayload;
    }, {}) satisfies ReturnedToCampEvent['explorersMap'];

    // Update remaining points in corridor
    this.corridor.remainingPoints = remainingPointsAfterDistribution;
    this.corridor.artifacts = retreatingExplorers.length === 1 ? [] : this.corridor.artifacts;
    // trigger ExplorersReturnToCampEvent
    const event = {
      name: GameEventName.ReturnedToCampEvent,
      round: this.round,
      turn: this.turn,
      remainingPointsInCorridor: this.corridor.remainingPoints,
      explorersMap,
    } satisfies ReturnedToCampEvent;
    this.events.push(event);
  }

  private nextTurn() {
    this.turn += 1;
    const card = this.deck.pop();
    if (!card) {
      throw new GameDomainException('NO_CARD_IN_DECK');
    }
    this.corridor.addCard(card);
    const originalRound = this.round;
    this.triggerCardEffect(card);
    if (originalRound !== this.round) {
      return;
    }
    this.explorersInCorridor.forEach(explorer => {
      explorer.decision = Decision.NotYet;
    });
  }

  private endRound() {
    const treasureCards = this.corridor.treasureCards;
    this.deck.push(...treasureCards);
    this.trashDeck[this.round] = this.corridor.cards;
    this.corridor.clear();
    this.round += 1;
    this.turn = 0;
    // Reset explorers' decisions and positions for the new round
    this.explorers.forEach(explorer => {
      explorer.points = 0;
      explorer.decision = Decision.NotYet;
      explorer.position = ExplorerPosition.Corridor;
    });
    if (this.round <= 5) {
      this.startRound();
    } else {
      const event = {
        name: GameEventName.GameOverEvent,
        round: this.round,
        turn: this.turn,
      } satisfies GameOverEvent;
      this.events.push(event);
    }
  }

  // -------------------------------------------------------------------------
  // card effects
  // -------------------------------------------------------------------------
  private triggerCardEffect(card: Card): void {
    switch (card.type) {
      case CardType.Treasure:
        this.treasureCardRevealed(card as TreasureCard);
        break;
      case CardType.Hazard:
        this.hazardCardRevealed(card as HazardCard);
        break;
      case CardType.Artifact:
        this.events.push({
          name: GameEventName.ArtifactCardRevealedEvent,
          round: this.round,
          turn: this.turn,
          artifact: card as ArtifactCard,
        } satisfies ArtifactCardRevealedEvent as GameEvent);
        break;
      default:
        throw new GameDomainException('UNKNOWN_CARD_TYPE', { type: card.type });
    }
  }

  private treasureCardRevealed(card: TreasureCard): void {
    const explorersInCorridor = this.explorersInCorridor;
    // Implement points distribution
    const distributedPointsPerExplorer = Math.floor(card.points / explorersInCorridor.length);
    explorersInCorridor.forEach(explorer => {
      explorer.points += distributedPointsPerExplorer;
    });
    // Add remaining points to the corridor
    const remainingPoints = card.points % explorersInCorridor.length;
    this.corridor.remainingPoints += remainingPoints;

    const event = {
      name: GameEventName.TreasureCardRevealedEvent,
      round: this.round,
      turn: this.turn,
      points: card.points,
      remainingPoints,
      distributedPointsPerExplorer,
      explorerIds: explorersInCorridor.map(explorer => explorer.id),
    } satisfies TreasureCardRevealedEvent;
    this.events.push(event);
  }

  private hazardCardRevealed(card: HazardCard): void {
    if (this.corridor.hasDuplicateHazard(card.hazard)) {
      const event = {
        name: GameEventName.RoundEndEvent,
        round: this.round,
        turn: this.turn,
        reason: RoundEndReason.SecondSameHazard,
        hazard: card.hazard,
      } satisfies RoundEndEvent;
      this.events.push(event);
      this.endRound();
    } else {
      // trigger HazardRevealedEvent
      const event = {
        name: GameEventName.HazardCardRevealedEvent,
        round: this.round,
        turn: this.turn,
        hazard: card.hazard,
      } satisfies HazardCardRevealedEvent;
      this.events.push(event);
    }
  }

  // -------------------------------------------------------------------------
  // helper methods
  // -------------------------------------------------------------------------
  public shuffleDeck() {
    // Fisher-Yates (Knuth)
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i] as Card, this.deck[j] as Card] = [this.deck[j] as Card, this.deck[i] as Card];
    }
  }
  
  private isAllExploersMadeDecisions() {
    return this.explorersInCorridor.every(explorer => explorer.decision !== Decision.NotYet);
  }

  private get explorersInCorridor() {
    return this.explorers.filter(explorer =>
      explorer.position === ExplorerPosition.Corridor
    );
  }
} 