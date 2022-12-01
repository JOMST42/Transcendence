import { Component, OnInit } from '@angular/core';

// TODO To be changed
import { Response } from '../../interfaces';

import { AudioHandler } from '../../classes';
import { PlayService } from '../../play.service';
import { Score } from '../../../pong/interfaces';
import { PlayGuard } from '../../play-guard';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [],
})
export class GameComponent implements OnInit {

  constructor(private server: PlayService) {}

  ngOnInit() {
  }


}
