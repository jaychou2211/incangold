export type GameExceptionKey = 
  | 'NO_ARTIFACT_CARD_IN_DECK' 
  | 'EXPLORER_NOT_FOUND'
  | 'EXPLORER_ALREADY_MADE_DECISION'
  | 'EXPLORER_NOT_IN_CORRIDOR'
  | 'NO_CARD_IN_DECK'
  | 'UNKNOWN_CARD_TYPE'
  | 'GAME_ALREADY_ENDED';

export class GameDomainException extends Error {
  readonly name: string;
  readonly detail: Record<string, unknown>;

  constructor(
    message: GameExceptionKey,
    detail: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = GameDomainException.name;
    this.detail = { ...detail };
  }
}
