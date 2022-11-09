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
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/user/services';
import { AudioHandler } from '../../../play/classes';
import { PlayService } from '../../../play/play.service';

export interface Score {
	p1: number,
	p2: number,
}

export interface Vector3 {
	x: number,
	y: number,
	z?: number,
}

export interface EntityInfo {
  pos: Vector3;
  size: Vector3;
}

export interface GameInfo {
  ball: EntityInfo;
  pad1: EntityInfo;
  pad2: EntityInfo;
  score: Score;
  state: any;
  events: Event[];
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
  score: Score = {p1:0, p2:0};
  countdown: number = 0;
  countdownId?: NodeJS.Timer;
  animDisabled?: boolean = false;

	afterImage: Vector3[] = [];
	afterTimer = {frames:0, reset:5}; 


  private audio: AudioHandler = new AudioHandler(0.3, 1);

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
    this.setGameListener();
    // this.animDisabled = false;
  }

  setGameListener() {
    this.server.listenGameUpdate().subscribe((info: GameInfo | undefined | null) => {
			if (!info) return;
      this.refresh();
      this.context.fillStyle = '#FFFFFF';
      // this.context.fillText(this.score[0], 250, 50);
      // this.context.fillText(this.score[1], 350, 50);
			// this.afterImage.push(info.ball.pos);
			// this.drawAfterImage(info.ball.size.x);
			// if (this.afterTimer.frames-- <= 0){
				
			// 		this.afterTimer.frames = this.afterTimer.reset;
			// 	}
				
			// }
			if (this.afterImage.length >= 10){
				this.afterImage.shift();
			}
			this.afterImage.push(info.ball.pos);
			this.drawAfterImage(info.ball.size.x); // TODO

      this.context.fillRect(
        info.pad1.pos.x * 600,
        info.pad1.pos.y * 400,
        info.pad1.size.x,
        info.pad1.size.y
      );
      this.context.fillRect(
        info.pad2.pos.x * 600,
        info.pad2.pos.y * 400,
        info.pad2.size.x,
        info.pad2.size.y
      );
      this.context.fillRect(
        // info.ball.pos.x - info.ball.size.x / 2,
        // info.ball.pos.y - info.ball.size.x,
				info.ball.pos.x * 600 - info.ball.size.x / 2,
				info.ball.pos.y * 400 - info.ball.size.x / 2,
        info.ball.size.x,
        info.ball.size.x
      );
			this.score.p1 = info.score.p1;
			this.score.p2 = info.score.p2;
      if (info.events) this.handleEvents(info.events);
    });

    this.server.listenGameStart().then((info: string) => {
    	this.audio.playGame(true, true);
    });

    // this.server.listen("player-ready").subscribe((info: string) => {
    // 	this.log('player ' + info + ' is ready!');
    // });
  }

	drawAfterImage(size: number) {
		let multi = 1;
		let afterCount = this.afterImage.length;
		let i: number = 0;
		while (i < afterCount)
		{
			this.context.fillRect(
        this.afterImage[i].x * 600 - size / 2,
        this.afterImage[i].y * 400 - size / 2,
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
    this.score[0] = payload.p1;
    this.score[1] = payload.p2;
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
    for (let i = 10; i < 400; i += 40) {
      this.context.fillRect(297, i, 6, 20);
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
