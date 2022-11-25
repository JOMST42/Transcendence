import { Component, OnInit } from '@angular/core';

// TODO To be changed
import { Response } from './interfaces';

import { AudioHandler } from './classes';
import { PlayService } from './play.service';
import { Score } from '../pong/data/interfaces';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [],
})
export class GameComponent implements OnInit {
  // @ViewChild("game")
  // private gameCanvas!: ElementRef;
  private context: any;
  private score: Score = {p1:0,p2:0};
  private audio: AudioHandler = new AudioHandler(0.3, 1);
  room_id: string = '';
  DebugTxt: string = '';
  RoomList: string = '';

  constructor(private server: PlayService) {}

  ngOnInit() {
    this.audio.setSoundColPad('assets/sound/hit_paddle.m4a');
    this.audio.setSoundColWall('assets/sound/hit_wall.m4a');
    this.audio.setSoundScore('assets/sound/score.m4a');
    this.audio.setMusicGame('assets/music/game.mp3');
    this.audio.setMusicVictory('assets/music/victory.mp3');
  }

  ngAfterViewInit() {
    // this.context = this.gameCanvas.nativeElement.getContext("2d");
    this.setGameListener();
  }

  // connect() {

  // }

  setGameListener() {

		this.server.listen('queue-success').subscribe((info: string)=> {
			this.log('queue success!');
		});

    this.server.listenGameStart().then((info: Response) => {
      this.log(info?.msg);
      // this.audio.playGame(true, true);
    });

    this.server.listen('player-ready').subscribe((info: Response) => {
      this.log(info?.msg);
    });
  }

  async readyToPlay() {
    this.server
      .emit('ready-to-play', {})
      .then((data: Response) =>
        this.log('Readying: ' + data.code + ' ' + data.msg)
      );
    this.log("Telling the server I'm ready to play...");
  }

  async joinGameRoom() {
    this.server
      .emit('join-room', this.room_id)
      .then((data: Response) =>
        this.log('Join room: ' + data.code + ' ' + data.msg)
      );
    this.log('attempting to join room id ' + this.room_id);
  }

  async leaveGameRoom() {
    this.server
      .emit('leave-room', {})
      .then((data: Response) => this.leaveGameRoomResponse(data));
    this.log('attempting to join room id ' + this.room_id);
  }

  private leaveGameRoomResponse(data: Response) {
    this.log('Leave room: ' + data.code + ' ' + data.msg);
    // this.refresh();
  }

  handleEvents(events: any[]) {
    if (events.length > 0) {
      for (var i = 0; i < events.length; i++) {
        this.log('Event type: ' + events[i].type);
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

  playSound(audio: HTMLAudioElement) {
    audio.play();
  }

  log(msg: string) {
    this.DebugTxt = msg + '<br/>' + this.DebugTxt;
    console.log(msg);
  }

  // private refresh() {
  // 	this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
  // 	for (let i = 10; i < 400;i += 40)
  // 	{
  // 		this.context.fillRect(297, i, 6, 20);
  // 	}
  // };
}
