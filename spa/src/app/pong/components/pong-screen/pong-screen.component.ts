import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  animation,
  useAnimation,
} from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/user/services';
import { AudioHandler } from '../../../play/classes';
import { PlayService } from '../../../play/play.service';
import { GameInfo, RoomInfo, Score, Vector3 } from '../../data/interfaces';

export interface EntityInfo {
  pos: Vector3;
  size: Vector3;
}

export enum Winner {
  PLAYER1,
  PLAYER2,
  NONE,
}

@Component({
  selector: 'app-pong-screen',
  templateUrl: './pong-screen.component.html',
  styleUrls: ['./pong-screen.component.scss'],
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
export class PongScreenComponent implements OnInit {

  @ViewChild('game')
  private gameCanvas!: ElementRef;
  private context: any;
	dimension = {w:600, h:400};

  score: Score = {p1:0, p2:0};
	p1Ready: boolean = false;
	p2Ready: boolean = false;
	p1Joined: boolean = false;
	p2Joined: boolean = false;
	timer: number = 0;

  countdown: number = 0;
	countdownLabel: string = '';
  countdownId?: NodeJS.Timer;
  animDisabled?: boolean = false;

	afterImage: Vector3[] = [];
	afterTimer = {frames:0, reset:5};

	roomInfo?: RoomInfo; 



  private audio: AudioHandler = new AudioHandler(0, 0);

  constructor(
	private server: PlayService,
	public readonly userService: UserService
	) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.context = this.gameCanvas.nativeElement.getContext('2d');
		this.audio.setSoundColPad('assets/sound/hit_paddle.m4a');
    this.audio.setSoundColWall('assets/sound/hit_wall.m4a');
    this.audio.setSoundScore('assets/sound/score.m4a');
    this.audio.setMusicGame('assets/music/game.mp3');
    this.audio.setMusicVictory('assets/music/victory.mp3');
		this.refresh();
    this.setGameListener();
		this.setRoomListener();
    // this.animDisabled = false;
  }

  setGameListener() {
    this.server.listenGameUpdate().subscribe((info: GameInfo | undefined | null) => {
			if (!info) return;
      this.refresh();
      this.context.fillStyle = '#FFFFFF';
			let width = this.gameCanvas.nativeElement.width
			let height = this.gameCanvas.nativeElement.height
			this.score.p1 = info.score.p1;
			this.score.p2 = info.score.p2;
			this.timer = Math.floor(info.time);

			if (this.afterImage.length >= 10){
				this.afterImage.shift();
			}
			this.afterImage.push(info.ball.pos);
			this.drawAfterImage(info.ball.size.x); // TODO

			if (!this.p1Joined) this.context.fillStyle = "#FF0000";
			else if (!this.p1Ready) this.context.fillStyle = "#FFFF00";
			else this.context.fillStyle = "#FFFFFF";
      this.context.fillRect(
        info.pad1.pos.x * width,
        info.pad1.pos.y * height - info.pad1.size.y / 2,
        info.pad1.size.x,
        info.pad1.size.y
      );

			if (!this.p2Joined) this.context.fillStyle = "#FF0000";
			else if (!this.p2Ready) this.context.fillStyle = "#FFFF00";
			else this.context.fillStyle = "#FFFFFF";
      this.context.fillRect(
        info.pad2.pos.x * width,
        info.pad2.pos.y * height - info.pad1.size.y / 2,
        info.pad2.size.x,
        info.pad2.size.y
      );

			this.context.fillStyle = "#FFFFFF";
      this.context.fillRect(
				info.ball.pos.x * width - (info.ball.size.x) / 2,
				info.ball.pos.y * height - (info.ball.size.y) / 2,
        info.ball.size.x,
        info.ball.size.y
      );

      if (info.events) this.handleEvents(info.events);
    });

    this.server.listenGameStart().then((info: string) => {
    	this.audio.playGame(true, true);
    });

    this.server.listen("player-ready").subscribe((info: number) => {
			console.log(info);
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
			// TODO
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
	}

	drawAfterImage(size: number) {
		let width = this.gameCanvas.nativeElement.width
		let height = this.gameCanvas.nativeElement.height
		let afterCount = this.afterImage.length;
		let i: number = 0;
		while (i < afterCount)
		{
			this.context.fillRect(
        this.afterImage[i].x * width - size / 2,
        this.afterImage[i].y * height - size / 2,
        size * (i / afterCount),
        size * (i / afterCount)
      );
			i++;
		}
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
    this.audio.playScore(true);
  }
  collisionEvent(payload: any) {
    if (payload.type === 'Wall') this.audio.playColWall(true);
    if (payload.type === 'Pad') this.audio.playColPad(true);
  }

  private refresh() {
    this.context.clearRect(
      0,
      0,
      this.gameCanvas.nativeElement.width,
      this.gameCanvas.nativeElement.height
    );
    for (let i = 10; i < this.dimension.h; i += this.dimension.h / 10) {
      this.context.fillRect(this.dimension.w / 2 - 3, i, 6, 20);
    }
  }

  testCountdown() {
    clearInterval(this.countdownId);
    this.countdown = 3;
    this.countdownId = setInterval(() => this.tickCountdown(), 1000);
  }

  tickCountdown() {
    if (this.countdown - 1 === 0) {
      clearInterval(this.countdownId);
      return;
    }
    this.countdown--;
    console.log('ticking');
  }

}
