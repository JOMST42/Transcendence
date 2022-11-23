import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
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

export interface Pad3D {
	x:number,
	y:number,
	w:number,
	h:number,
	depth:number,
}

export interface Ball3D {
	x:number,
	y:number,
	rad:number,
}

export interface GameInfo3D {
	pad1?: Pad3D,
	pad2?: Pad3D,
	ball?: Ball3D,
}

@Component({
  selector: 'app-pong-3dscreen',
  templateUrl: './pong-3dscreen.component.html',
  styleUrls: ['./pong-3dscreen.component.scss'],
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
export class Pong3DScreenComponent implements OnInit {

  @ViewChild('game')
  private gameCanvas!: ElementRef;
  private context: any;
	dimension = {w:600, h:400};
	width: number = 0;
	height: number = 0;
	perspective: number = 0.60;
	depthMod: number = 0.70;

  score: Score = {p1:0, p2:0};
	p1Ready: boolean = false;
	p2Ready: boolean = false;
	p1Joined: boolean = false;
	p2Joined: boolean = false;
	timer: number = 0;

  countdown: number = 0;
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
			this.width = this.gameCanvas.nativeElement.width
			this.height = this.gameCanvas.nativeElement.height
      this.refresh();
			let info3D: GameInfo3D = {};
			info3D.pad1 = this.applyPerspectivePad(info.pad1);
			info3D.pad2 = this.applyPerspectivePad(info.pad2);
			info3D.ball = this.applyPerspectiveBall(info.ball);
      
			this.score.p1 = info.score.p1;
			this.score.p2 = info.score.p2;
			this.timer = Math.floor(info.time);

			this.draw3D(info3D);

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
  }

	draw3D(info: GameInfo3D) {
			
		this.context.fillStyle = '#FFFFFF';
		this.context.strokeStyle = '#FFFFFF';
		// if (this.afterImage.length >= 10){
		// 	this.afterImage.shift();
		// }
		// this.afterImage.push(info.ball.pos);
		// this.drawAfterImage(info.ball.size.x); // TODO

		
		this.drawPad(info.pad1, this.p1Joined, this.p1Ready);

		this.context.fillStyle = "#FFFFFF";
		this.drawBall(info.ball);

		this.drawPad(info.pad2, this.p2Joined, this.p2Ready);
		
		this.context.strokeStyle = '#FFFFFF';
		this.context.moveTo(0, info.pad2.y);
		this.context.lineTo(this.width, info.pad2.y);
		this.context.stroke();

		
	}

	drawPad(pad: Pad3D, ready: boolean, joined: boolean) {
		const saveStroke = this.context.strokeStyle;
		const saveFill = this.context.fillStyle;

		this.context.strokeStyle = "#000000";
		if (!joined) this.context.fillStyle = "#FF0000";
		else if (!ready) this.context.fillStyle = "#FFFF00";
		else this.context.fillStyle = "#FFFFFF";
    this.context.beginPath();
    this.context.moveTo(pad.x + pad.w / 2, pad.y);
    this.context.lineTo(pad.x - pad.w / 2, pad.y);
    this.context.lineTo(pad.x - pad.w / 2, pad.y - pad.depth);
    this.context.lineTo(pad.x + pad.w / 2, pad.y - pad.depth);
    this.context.closePath();
    this.context.stroke();
    this.context.fill();

    // center face
		
    this.context.beginPath();
    this.context.moveTo(pad.x + pad.w / 2, pad.y);
		this.context.lineTo(pad.x - pad.w / 2, pad.y);
    this.context.lineTo(pad.x - pad.w / 2, pad.y + pad.h);
    this.context.lineTo(pad.x + pad.w / 2, pad.y + pad.h);
    this.context.closePath();
    this.context.fillStyle = "#AAAAAA";
    this.context.stroke();
    this.context.fill();

		this.context.strokeStyle = saveStroke;
		this.context.fillStyle = saveFill;	
	}

	drawBall(ball: Ball3D) {
		const saveStroke = this.context.strokeStyle;
		const saveFill = this.context.fillStyle;

		var grd = this.context.createRadialGradient(ball.x, ball.y - ball.rad / 2, 0, ball.x, ball.y, ball.rad);
		grd.addColorStop(0, "white");
		grd.addColorStop(1, "#444444");

		this.context.fillStyle = grd;
		this.context.strokeStyle = "#000000";

		this.context.beginPath();
		this.context.arc(ball.x - ball.rad / 2, ball.y, ball.rad, 0, 2 * Math.PI);
		this.context.stroke();
		this.context.fill();

		this.context.strokeStyle = saveStroke;
		this.context.fillStyle = saveFill;	
	}

	applyPerspectivePad(pad: EntityInfo): Pad3D {
		let pad3D: Pad3D = {x:0, y:0, w:0, h:0, depth:0}
		let depthMagnitude = this.depthMod * (pad.pos.x);
		let midOffset = Math.abs(1 - pad.pos.x) / (1 + depthMagnitude) * this.width;
		pad3D.x = pad.pos.y * this.width;
		pad3D.x = pad3D.x / (1 + depthMagnitude) + midOffset;

		// pad3D.x = (pad.pos.y + (0.5 - pad.pos.y) * this.depthMod) * this.width;
		pad3D.y = pad.pos.x * this.height * this.perspective;
		// pad3D.w = pad.size.y * (this.width);
		// pad3D.h = pad.size.x * (this.height);
		pad3D.w = Math.ceil(pad.size.y * (1 - (this.depthMod * (1 - pad.pos.x))));
		pad3D.h = Math.ceil(pad.size.x * (1 - (this.depthMod * (1 - pad.pos.x))));
		pad3D.depth = pad3D.h;

		return pad3D;
	}

	applyPerspectiveBall(ball: EntityInfo): Ball3D {
		let ball3D: Ball3D = {x:0, y:0, rad:0}
		let depthMagnitude = this.depthMod * (1 - ball.pos.x);
		let midOffset = Math.abs(1 - ball.pos.x) * (this.depthMod * this.width);
		ball3D.x = ball.pos.y * this.width;
		ball3D.x = ball3D.x * depthMagnitude + midOffset;
		// ball3D.x = (ball.pos.y + (0.5 - ball.pos.x) * this.depthMod) * this.width;
		ball3D.y = ball.pos.x * this.height * this.perspective;
		ball3D.rad = Math.ceil(ball.size.x * (1 - (this.depthMod * (1 - ball.pos.x))));

		return ball3D;
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

    // for (let i = 10; i < this.dimension.h; i += this.dimension.h / 10) {
    //   this.context.fillRect(this.dimension.w / 2 - 3, i, 6, 20);
    // }
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
  }

}
