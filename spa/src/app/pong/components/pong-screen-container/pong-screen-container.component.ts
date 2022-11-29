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
  selector: 'app-pong-screen-container',
  templateUrl: './pong-screen-container.component.html',
  styleUrls: ['./pong-screen-container.component.scss'],
  animations: [
    trigger('countdown', [
      state('*', style({ opacity: '0', 'font-size': '0px' })),
      transition(
        '*=>*',
        animate(
          '1s ease',
          keyframes([
            style({ opacity: '0', 'font-size': '0px', offset: 0.01 }),
            style({ opacity: '1', 'font-size': '0px', offset: 0.02 }),
            style({ opacity: '1', 'font-size': '75px', offset: 0.75 }),
            style({ opacity: '0', 'font-size': '100px', offset: 1 }),
          ])
        )
      ),
    ]),
  ],
})
export class PongScreenContainerComponent implements OnInit {

	
  score: Score = {p1:0, p2:0};
	@Input() isPlayer: boolean = false;
	playerIndex: 0 | 1 | 2;
	p1Ready: boolean = false;
	p2Ready: boolean = false;
	p1Joined: boolean = false;
	p2Joined: boolean = false;
	timer: number = 0;

  countdown: number = 0;
	countdownLabel: string = '';
  countdownId?: NodeJS.Timer;
  animDisabled?: boolean = false;

	threeD: boolean = false;

	roomInfo?: RoomInfo; 
	gameEnded: boolean = false;
	endState: EndState = EndState.CANCEL;
	winner?: User;

  private audio: AudioHandler = new AudioHandler(0.3, 0.8);
	

  constructor(
	private server: PlayService,
	public readonly userService: UserService
	) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
		this.audio.setSoundColPad('assets/sound/hit_paddle.m4a');
    this.audio.setSoundColWall('assets/sound/hit_wall.m4a');
    this.audio.setSoundScore('assets/sound/score.m4a');
    this.audio.setMusicGame('assets/music/game.mp3');
    this.audio.setMusicVictory('assets/music/victory.mp3');
    this.setGameListener();
		this.setRoomListener();
    // this.animDisabled = false;
  }

  setGameListener() {
    this.server.listenGameUpdate().subscribe((info: GameInfo | undefined | null) => {
			if (!info) return;
      if (info.events) this.handleEvents(info.events);
    });

    this.server.listenGameStart().then((info: string) => {
    	this.audio.playGame(true, true);
    });

    this.server.listen("player-ready").subscribe((info: number) => {
    	if (info === 1)
				this.p1Ready = true;
			if (info === 2)
				this.p2Ready = true;
    });

		this.server.listen("ready-check").subscribe((info: number) => {
				this.p1Ready = false;
				this.p2Ready = false;
    });

		this.server.listen("game-finished").subscribe((winner: Winner) => {
			switch (winner) {
				case Winner.NONE:
					this.endState = EndState.CANCEL;
					break;
				case Winner.PLAYER1:
					if (this.isPlayer) {
						if (this.playerIndex === 1) this.endState = EndState.WINNER;
						else if (this.playerIndex === 2) this.endState = EndState.LOSER
						else	this.endState = EndState.SPECTATOR
					}
					this.winner = this.roomInfo?.user1;
					break;
				case Winner.PLAYER2:
					if (this.isPlayer) {
						if (this.playerIndex === 2) this.endState = EndState.WINNER;
						else if (this.playerIndex === 1) this.endState = EndState.LOSER
						else	this.endState = EndState.SPECTATOR
					}
					this.winner = this.roomInfo?.user2;
					break;
			}
			this.gameEnded = true;
		});
  }

	setRoomListener() {
    this.server.listen('room-update').subscribe((info: RoomInfo | undefined | null) => {
			if (!info) return;
      if (info.roomId != this.roomInfo?.roomId) {
				this.updateRoomInfo(info);
			}
			this.updateRoom(info)
		});
	}

	updateRoomInfo(roomInfo : RoomInfo) {
		this.roomInfo = roomInfo;
		this.server.emit('am-i-player', {}).then((data:Response) => {
			if (data.code === 0) {
				this.isPlayer = true;
				this.playerIndex = data.payload;
			} else {
				this.isPlayer = false;
				this.playerIndex = 0;
			}
		}).catch(() => {
			this.isPlayer = false;
			this.playerIndex = 0;
		});
	}

	updateRoom(info: RoomInfo) {
		this.p1Ready = info.user1Ready;
		this.p2Ready = info.user2Ready;
		this.p1Joined = info.user1Joined;
		this.p2Joined = info.user2Joined;
		if (info.hasCountdown) {
			this.countdown = Math.ceil(info.countdownTime);
			this.countdownLabel = info.countdownLabel;
		} else {
			this.countdown = 0
			this.countdownLabel = '';
		}
		this.score.p1 = info.score.p1;
		this.score.p2 = info.score.p2;
	}

  handleEvents(events: any[]) {
    if (events.length > 0) {
      for (var i = 0; i < events.length; i++) {
        switch (events[i].type) {
          case 'COLLISION':
            this.collisionEvent(events[i].payload);
            break;
          case 'SCORE':
            this.scoreEvent(events[i].payload);
            break;
          case 'VICTORY':
            this.victoryEvent(events[i].payload);
            break;
        }
      }
    }
  }

  victoryEvent(payload: any) {
    this.audio.stopGame();
    this.audio.playVictory(true, true);
  }

  scoreEvent(payload: any) {
		this.score.p1 = payload.p1;
    this.score.p2 = payload.p2;
		console.log(this.score[0], this.score[1]);
    this.audio.playScore(true);
  }

  collisionEvent(payload: any) {
    if (payload.type === 'Wall') this.audio.playColWall(true);
    if (payload.type === 'Pad') this.audio.playColPad(true);
  }

	set3D(flag: boolean) {
		this.threeD = flag;
	}
}
