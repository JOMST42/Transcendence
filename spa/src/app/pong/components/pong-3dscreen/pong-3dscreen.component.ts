import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/user/services';
import { PlayService } from '../../../play/play.service';
import { EntityInfo, GameInfo, RoomInfo } from '../../interfaces';

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
})
export class Pong3DScreenComponent implements OnInit {

  @ViewChild('game')
  private gameCanvas!: ElementRef;
  private context: any;
	dimension = {w:600, h:400};
	width: number = 0;
	height: number = 0;
	perspective: number = 0.50;
	depthMod: number = 0.20;

	p1Ready: boolean = false;
	p2Ready: boolean = false;
	p1Joined: boolean = false;
	p2Joined: boolean = false;

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
			this.width = this.gameCanvas.nativeElement.width
			this.height = this.gameCanvas.nativeElement.height
      this.refresh();
			let info3D: GameInfo3D = {};
			info3D.pad1 = this.applyPerspectivePad(info.pad1);
			info3D.pad2 = this.applyPerspectivePad(info.pad2);
			info3D.ball = this.applyPerspectiveBall(info.ball);
      
			this.draw3D(info3D);
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
		let xOffset = (1 - this.depthMod) * this.width / 2;
		let yOffset = (1 - this.perspective) * this.height / 2;
		info.pad1.y += yOffset;
		info.pad2.y += yOffset;
		info.ball.y += yOffset;
		
		this.context.strokeStyle = '#FFFFFF';
		this.context.moveTo(0, info.pad2.y + 3);
		this.context.lineTo(xOffset, info.pad1.y);
		this.context.lineTo(this.width - xOffset, info.pad1.y);
		this.context.lineTo(this.width, info.pad2.y + 3);
		this.context.stroke();

		this.drawPad(info.pad1, this.p1Joined, this.p1Ready);
		this.drawPad(info.pad2, this.p2Joined, this.p2Ready);
		
		this.context.strokeStyle = '#FFFFFF';
		this.context.moveTo(0, info.pad2.y + 3);
		this.context.lineTo(this.width, info.pad2.y + 3);
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
		if (!joined) this.context.fillStyle = "#990000";
		else if (!ready) this.context.fillStyle = "#999900";
		else this.context.fillStyle = "#AAAAAA";
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
		let depthMagnitude = this.depthMod + (( 1 - this.depthMod) * pad.pos.x);
		let offset = (1 - depthMagnitude) * this.width / 2;
		pad3D.x = (1 - pad.pos.y) * this.width * depthMagnitude + offset;
		pad3D.y = pad.pos.x * this.height * this.perspective;
		pad3D.w = Math.ceil(pad.size.y * (depthMagnitude));
		pad3D.h = Math.ceil(pad.size.x * (depthMagnitude)) * 1.5;
		pad3D.depth = pad3D.h;

		return pad3D;
	}

	applyPerspectiveBall(ball: EntityInfo): Ball3D {
		let ball3D: Ball3D = {x:0, y:0, rad:0}
		let depthMagnitude = this.depthMod + (( 1 - this.depthMod) * ball.pos.x);
		let offset = (1 - depthMagnitude) * this.width / 2;
		ball3D.x = (1 - ball.pos.y) * this.width * depthMagnitude + offset;
		ball3D.y = (ball.pos.x * this.height * this.perspective) - 2;
		ball3D.rad = Math.ceil(ball.size.x * (depthMagnitude));

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
}
