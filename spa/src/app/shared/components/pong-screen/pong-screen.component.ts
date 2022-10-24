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
import { GameInfo } from '../../../../../../api/src/pong-game/interfaces';
import { AudioHandler } from '../../../play/class';
import { PlayService } from '../../../play/play.service';

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
  score: number[] = [0, 0];
  countdown: number = 0;
  countdownId?: NodeJS.Timer;
  animDisabled?: boolean = true;
  private audio: AudioHandler = new AudioHandler(0.3, 1);

  constructor(private server: PlayService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.context = this.gameCanvas.nativeElement.getContext('2d');
    this.setGameListener();
    this.animDisabled = false;
  }

  setGameListener() {
    this.server.listenGameUpdate().subscribe((info: GameInfo) => {
      this.refresh();
      this.context.fillStyle = '#FFFFFF';
      // this.context.fillText(this.score[0], 250, 50);
      // this.context.fillText(this.score[1], 350, 50);
      this.context.fillRect(
        info.p1_pos.x,
        info.p1_pos.y,
        info.p1_size.x,
        info.p1_size.y
      );
      this.context.fillRect(
        info.p2_pos.x,
        info.p2_pos.y,
        info.p2_size.x,
        info.p2_size.y
      );
      this.context.fillRect(
        info.b_pos.x - info.b_rad / 2,
        info.b_pos.y - info.b_rad,
        info.b_rad,
        info.b_rad
      );
      if (info.events) this.handleEvents(info.events);
    });

    // this.server.listenGameStart().then((info: string) => {
    // 	this.log(info + ' (game-start)');
    // 	// this.audio.playGame(true, true);
    // });

    // this.server.listen("player-ready").subscribe((info: string) => {
    // 	this.log('player ' + info + ' is ready!');
    // });
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
