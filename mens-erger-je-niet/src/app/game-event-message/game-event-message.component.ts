import { Component, Input } from '@angular/core';
import { GameEvent, GameEventInfo } from 'app/game-event-message';

@Component({
  selector: 'app-game-event-message[event][info]',
  templateUrl: './game-event-message.component.html',
  styleUrls: ['./game-event-message.component.scss'],
})
export class GameEventMessageComponent {
  public readonly GameEvent = GameEvent;

  @Input()
  public event!: GameEvent;

  @Input()
  public info!: GameEventInfo;
}
