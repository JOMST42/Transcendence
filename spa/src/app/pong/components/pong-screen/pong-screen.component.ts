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
import { GameInfo, RoomInfo, Score, Vector3 } from '../../interfaces';

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

	p1Ready: boolean = false;
	p2Ready: boolean = false;
	p1Joined: boolean = false;
	p2Joined: boolean = false;

	afterImage: Vector3[] = [];
	afterTimer = {frames:0, reset:5};

	roomInfo?: RoomInfo; 

  constructor(
	private server: PlayService,
	public readonly userService: UserService
	) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.context = this.gameCanvas.nativeElement.getContext('2d');
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
    });

    this.server.listenGameStart().then((info: string) => {
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
}
