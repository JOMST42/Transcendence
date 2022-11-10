import { Component } from '@angular/core';
import { PlayService } from '../../play.service';
import { Response } from '../../interfaces';
import {ButtonModule} from 'primeng/button'
import { ToastService } from 'src/app/core/services';

enum ButtonState {
	READY = 0,
	PROCESS = 1,
	UNREADY = 2
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


	async handleReady(event: any) {
		if (this.state === ButtonState.READY) {
			this.changeToProcess();
			await this.delay(1000); // TODO test purpose
			await this.ready();
		}
		else if (this.state === ButtonState.UNREADY) {
			this.changeToProcess();
			await this.delay(1000); // TODO test purpose
			await this.unready();
		}

	}

	async ready() {
    this.server
      .emit('ready-to-play', {})
      .then((data: Response) => {
				this.changeToUnready();
				this.toast.showSuccess('Ready success', 'You are now ready');
			}, (data: Response | undefined) => {
				this.changeToReady();
				this.toast.showError('Ready error', data?.msg);
			});
  }

  async unready() {
		console.log('Attempting to leave queue...');
    await this.server
      .emit('unready-to-play', {})
      .then((data:Response) => {
        this.changeToReady();
				this.toast.showSuccess('Unready success', 'You cancelled your ready check');
			}, (data: Response | undefined) => {
				this.changeToUnready();
				this.toast.showError('Unready error', data?.msg);
			});
		return;
  }

	private changeToReady() {
		this.disabled = false;
		this.isProcessing = false;
		this.label = this.labelReady;
		this.state = ButtonState.READY;
		this.classStyle = this.defaultStyle;
	}

	private changeToProcess() {
		// this.disabled = true;
		this.isProcessing = true;
		this.label = this.labelProcess;
		this.state = ButtonState.PROCESS;
		this.classStyle = this.processStyle;
	}

	private changeToUnready() {
		this.disabled = false;
		this.isProcessing = false;
		this.label = this.labelUnready;
		this.state = ButtonState.UNREADY;
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
