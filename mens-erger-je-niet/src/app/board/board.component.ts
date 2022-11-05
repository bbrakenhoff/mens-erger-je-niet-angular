import { Component, Input } from '@angular/core';
import { Board } from 'models/board';

@Component({
  selector: 'app-board[board]',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() public board!: Board;
}
