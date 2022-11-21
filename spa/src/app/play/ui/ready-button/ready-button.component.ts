import { Component } from '@angular/core';
import { PlayService } from '../../play.service';
import { Response } from '../../interfaces';
import {ButtonModule} from 'primeng/button'
import { ToastService } from 'src/app/core/services';
import { PongService } from 'src/app/pong/services/pong.service';

enum ButtonState {
	READY = 0,
	PROCESS = 1,
	DISABLED = 2
}

@Component({
  selector: 'app-ready-button',
  templateUrl: './ready-button.component.html',
	styleUrls: ['./ready-button.component.scss'],
})
export class ReadyButtonComponent {

	labelReady = "Ready";
	labelProcess = "processing...";
	labelUnready = "Unready";
	defaultStyle = "p-button-raised p-button-outlined"
	private processStyle = "p-button-raised p-button-outlined p-button-secondary"
	private cancelStyle = "p-button-raised p-button-outlined p-button-danger"
	state: ButtonState;
	label: string | undefined;
	disabled: boolean;
	isProcessing: boolean = false;
	classStyle: string = this.defaultStyle;


  constructor(private server: PlayService, private toast: ToastService) {
		this.handleLabel();
		this.handleState();
	}

	ngOnInit(): void {
		// this.changeToDisabled();
		this.server.listen("ready-check").subscribe((info: number) => {
			this.changeToReady();
		});
  }

	async handleReady(event: any) {
		if (this.state === ButtonState.READY) {
			// this.changeToProcess();
			await this.ready();
		}
	}

	async ready() {
    this.server
      .emit('ready-to-play', {})
      .then((data: Response) => {
				// this.changeToDisabled();
				this.toast.showSuccess('Ready success', 'You are now ready');
			}, (data: Response | undefined) => {
				this.changeToReady();
				this.toast.showError('Ready error', data?.msg);
			});
  }

	private changeToReady() {
		this.disabled = false;
		this.isProcessing = false;
		this.label = this.labelReady;
		this.state = ButtonState.READY;
		this.classStyle = this.defaultStyle;
	}

	private changeToProcess() {
		this.isProcessing = true;
		this.label = this.labelProcess;
		this.state = ButtonState.PROCESS;
		this.classStyle = this.processStyle;
	}

	private changeToDisabled() {
		this.disabled = true;
		this.isProcessing = false;
		this.label = this.labelReady;
		this.state = ButtonState.DISABLED;
		this.classStyle = this.cancelStyle;
	}

	handleLabel() {
		this.label = this.labelReady;
		this.disabled = false;
	}

	handleState() {
		this.state = 0;
	}

	delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
	}

}
