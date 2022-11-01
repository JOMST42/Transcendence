import { Component, Input, OnInit } from '@angular/core';
import { PlayService } from '../../play.service';
import { Response } from '../../interfaces';
import {ButtonModule} from 'primeng/button'
import { ToastService } from 'src/app/core/services';

enum ButtonState {
	DEFAULT = 0,
	PROCESS = 1,
	CANCEL = 2
}

@Component({
  selector: 'app-pong-button',
  templateUrl: './pong-button.component.html',
  styleUrls: ['./pong-button.component.scss']
})
export class QueueButtonComponent implements OnInit {

	@Input() defaultLabel!: any;
	@Input() processLabel!: any;
	@Input() cancelLabel!: any;

	@Input() defaultFct!: (...args: any) => Promise<any>;
	@Input() cancelFct!: (...args: any) => Promise<any>;

	label: string;

	defaultStyle = "p-button-raised p-button-outlined"
	private processStyle = "p-button-raised p-button-outlined p-button-secondary"
	private cancelStyle = "p-button-raised p-button-outlined p-button-danger"

	disabled: boolean;
	isProcessing: boolean = false;
	classStyle: string = this.defaultStyle;

	state: ButtonState;
	private previousState: ButtonState;

  constructor(private toast: ToastService) {
		this.handleLabel();
		this.handleState();
	}

  ngOnInit(): void {
  }

	async doFunction() {
		switch(this.state) {
			case ButtonState.DEFAULT:
				this.changeToProcess();
				await this.defaultFct().then(() => {
					this.changeToLeave();
				}).catch(() => {
					this.changeToDefault();
				});
				break;
			case ButtonState.CANCEL:
				this.changeToProcess();
				await this.cancelFct();
				break;
		}
		console.log('doing function');

	}

	private changeState(state: ButtonState) {
		this.previousState = state
		this.state = state;
	}	

	private changeToDefault() {
		this.disabled = false;
		this.isProcessing = false;
		this.label = this.defaultLabel;
		this.state = ButtonState.DEFAULT;
		this.classStyle = this.defaultStyle;
	}

	private changeToProcess() {
		// this.disabled = true;
		this.isProcessing = true;
		this.label = this.processLabel;
		this.state = ButtonState.PROCESS;
		this.classStyle = this.processStyle;
	}

	private changeToLeave() {
		this.disabled = false;
		this.isProcessing = false;
		this.label = this.cancelLabel;
		this.state = ButtonState.CANCEL;
		this.classStyle = this.cancelStyle;
	}

	handleLabel() {
		this.label = this.defaultLabel;
		this.disabled = false;
	}

	handleState() {
		this.state = 0;
	}

	delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
}
