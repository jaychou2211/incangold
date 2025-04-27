export interface GameEvent {
  readonly name: string
  readonly round: number
  readonly turn: number
}

export enum GameEventName {
  TreasureCardRevealedEvent = 'TreasureCardRevealedEvent',
  HazardCardRevealedEvent = 'HazardCardRevealedEvent',
  ArtifactCardRevealedEvent = 'ArtifactCardRevealedEvent',
  OneExplorerMadeDecisionEvent = 'OneExplorerMadeDecisionEvent',
  AllExplorersMadeDecisionEvent = 'AllExplorersMadeDecisionEvent',
  ReturnedToCampEvent = 'ReturnedToCampEvent',
  RoundEndEvent = 'RoundEndEvent',
  GameOverEvent = 'GameOverEvent',
}
