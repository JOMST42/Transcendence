import { Component, ElementRef, ViewChild } from '@angular/core';

export interface Ball {
	x:number, y:number, z:number, size:number
}

export interface Pad {
	x:number, y:number, z:number, sx:number, sy:number, sz:number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	@ViewChild('game')
  private gameCanvas!: ElementRef;
  private context: any;

	dimension = {x:400, y:600}

	distanceRatio: number =  0.8;
	perspectiveY: number = 0.7;
	ball: Ball = {x:0.5, y:0.5, z:0.5, size:15}
	pad1: Pad = {x:0.5, y:0.1, z:0, sx:100, sy:15, sz:12}
	pad2: Pad = {x:0.5, y:0.9, z:0, sx:100, sy:15, sz:12}

	ballI = 10;
	ballXI = 10;

  constructor(	) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.context = this.gameCanvas.nativeElement.getContext('2d');
		setInterval(() => this.update(), 1000 / 30);
		// this.context.translate(this.context.width/2,this.context.height/2);
		// this.context.rotate(20 * Math.PI / 180);
  }

  update() {
		this.refresh();
		this.context.fillStyle = '#FFFFFF';

		if (this.ball.y >= 1)
			this.ballI *= -1;
		else if (this.ball.y <= 0)
			this.ballI *= -1;
		this.ball.y += (this.ballI / this.dimension.y);

		if (this.ball.x >= 1)
			this.ballXI *= -1;
		else if (this.ball.x <= 0)
			this.ballXI *= -1;
		this.ball.x += (this.ballXI / this.dimension.x);
		
		this.drawPad(this.applyDistancePad(this.pad1))
		this.drawBall(
			this.ball.x * this.dimension.x + this.ball.size / 2,
			this.ball.y * ((this.dimension.y - this.ball.size / 2) * this.perspectiveY),
			this.ball.size * (1 - (this.distanceRatio * (1 - this.ball.y))),
		)
		this.drawPad(this.applyDistancePad(this.pad2))

	}

  refresh() {
    this.context.clearRect(
      0,
      0,
      this.gameCanvas.nativeElement.width,
      this.gameCanvas.nativeElement.height
    );
  }

	drawPad(pad: Pad) {
		const saveStroke = this.context.strokeStyle;
		const saveFill = this.context.fillStyle;

		this.context.strokeStyle = "#FF0000";
    this.context.beginPath();
    this.context.moveTo(pad.x, pad.y);
    this.context.lineTo(pad.x - pad.sx, pad.y);
    this.context.lineTo(pad.x - pad.sx, pad.y - pad.sz);
    this.context.lineTo(pad.x, pad.y - pad.sz);
    this.context.closePath();
    this.context.fillStyle = "#FFFFFF"
    this.context.stroke();
    this.context.fill();

    // center face
    this.context.beginPath();
    this.context.moveTo(pad.x, pad.y);
		this.context.lineTo(pad.x - pad.sx, pad.y);
    this.context.lineTo(pad.x - pad.sx, pad.y + pad.sy);
    this.context.lineTo(pad.x, pad.y + pad.sy);
    this.context.closePath();
    this.context.fillStyle = "#AAAAAA";
    this.context.stroke();
    this.context.fill();

		this.context.strokeStyle = saveStroke;
		this.context.fillStyle = saveFill;	
	}

	drawBall(x:number, y:number, size:number) {
		const saveStroke = this.context.strokeStyle;
		const saveFill = this.context.fillStyle;

		var grd = this.context.createRadialGradient(x, y - size / 2, 0, x, y, size);
		grd.addColorStop(0, "white");
		grd.addColorStop(1, "#444444");

		this.context.fillStyle = grd;
		this.context.strokeStyle = "#FF0000";

		this.context.beginPath();
		this.context.arc(x, y, size, 0, 2 * Math.PI);
		this.context.stroke();
		this.context.fill();

		this.context.strokeStyle = saveStroke;
		this.context.fillStyle = saveFill;	
	}

	applyDistancePad(pad: Pad): Pad {
		let warpedPad: Pad = {x:0, y:0, z:0, sx:0, sy:0, sz:0}

		warpedPad.sx = pad.sx * (1 - (this.distanceRatio * (1 - pad.y)));
		warpedPad.sy = pad.sy * (1 - (this.distanceRatio * (1 - pad.y)));
		warpedPad.sz = pad.sz * (1 - (this.distanceRatio * (1 - pad.y)));
		warpedPad.x = pad.x * (this.dimension.x + warpedPad.sx / 2);
		warpedPad.y = pad.y * ((this.dimension.y + warpedPad.sy / 2) * this.perspectiveY);
		warpedPad.z = pad.z;

		return warpedPad;
	}
}
