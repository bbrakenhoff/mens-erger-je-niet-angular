import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Board } from 'models/board';
import { Color } from 'models/color';
import { Pawn } from 'models/pawn';

@Component({
  selector: 'app-board[board]',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() public board!: Board;

  @Output()
  public pawnClicked = new EventEmitter<Pawn>();

  public readonly Color = Color;

  public onClickPawn(pawn: Pawn): void {
    console.log(
      `%cBijoya board.component.ts[ln:20] onClickPawn`,
      'color: limegreen'
    );
    this.pawnClicked.emit(pawn);
  }
}
