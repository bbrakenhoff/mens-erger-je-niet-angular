export enum GameEvent {
  CurrentPlayerMovedPawn,
  CurrentPlayerHasNoPawnsToMove,
  CurrentPlayerMovedPawnFromStartField,
  CurrentPlayerMovedPawnToStartField,
  DetermineFirstPlayerFailed,
  FirstPlayerDetermined,
  GameNotStartedYet,
}

export interface GameEventInfo {
  currentPlayerIndex: number;
  nextPlayerIndex?: number;
  latestDiceRoll?: number;
}
