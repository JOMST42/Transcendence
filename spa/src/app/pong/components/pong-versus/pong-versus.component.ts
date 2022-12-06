import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Response } from 'src/app/play/interfaces';
import { User } from 'src/app/user/models';
import { UserService } from 'src/app/user/services';
import { AudioHandler } from '../../../play/classes';
import { PlayService } from '../../../play/play.service';
import { EndState, Winner } from '../../enums';
import { GameInfo, RoomInfo, Score } from '../../interfaces';

@Component({
  selector: 'app-pong-versus',
  templateUrl: './pong-versus.component.html',
  styleUrls: ['./pong-versus.component.scss'],
})
export class PongVersusComponent implements OnInit {

	
  @Input() user1: User;
	@Input() user2: User;

  constructor(
	private server: PlayService,
	public readonly userService: UserService
	) {}

  ngOnInit(): void {}

}
