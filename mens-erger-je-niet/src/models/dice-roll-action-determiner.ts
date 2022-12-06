import { DiceRollAction } from './dice-roll-action';
import { Player } from './player';

export class DiceRollActionDeterminer {
  public constructor() {}

  public determineAction(currentPlayer:Player): DiceRollAction {
    if (this.playerShouldMovePawnToStartField()) {
      return DiceRollAction.MovePawnToStart;
    } 
    // else if (this.player.isPlayerPuttingPawnOnStartField) {
    //   return DiceRollAction.MovePawnFromStart;
    // }
     else if (currentPlayer.hasPawnsToMove()) {
      return DiceRollAction.MovePawn;
    } else {
      return DiceRollAction.DoNothing;
    }
  }

  private playerShouldMovePawnToStartField(): boolean {
    // return (
    //   this.player.latestDiceRoll === 6 &&
    //   !!this.player.findPawnOnHomeField() &&
    //   !this.player.isPlayerPuttingPawnOnStartField
    // );

    return false;
  }
}
