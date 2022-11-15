import { Component } from '@angular/core';
import { PlayService } from '../../play.service';
import { Response } from '../../interfaces';
import { ToastService } from 'src/app/core/services';

enum ButtonState {
	JOIN = 0,
	PROCESS = 1,
	LEAVE = 2
}

@Component({
  selector: 'app-join-game-button',
  templateUrl: './join-game-button.component.html',
	styles: ['#joinGameButton { min-width: 200px; }'],
})
export class JoinGameButtonComponent {

	labelJoin = "Join game";
	labelProcess = "processing...";
	labelLeave = "Leave game";
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


	async handleJoin(event: any) {
		if (this.state === ButtonState.JOIN) {
			this.changeToProcess();
			// await this.delay(1000); // TODO test purpose
			await this.join();
		}
		else if (this.state === ButtonState.LEAVE) {
			this.changeToProcess();
			// await this.delay(1000); // TODO test purpose
			await this.unjoin();
		}

	}

	async join() {
    this.server
      .emit('join-game', {})
      .then((data: Response) => {
				this.changeToLeave();
				this.toast.showSuccess('Join success', 'You joined the game');
			}, (data: Response | undefined) => {
				this.changeToJoin();
				this.toast.showError('Join error', data?.msg);
			});
  }

  async unjoin() {
		console.log('Attempting to leave queue...');
    await this.server
      .emit('leave-game', {})
      .then((data: Response) => {
        this.changeToJoin();
				this.toast.showSuccess('Leave success', 'You left the game');
			}, (data: Response | undefined) => {
				this.changeToLeave();
				this.toast.showError('Leave error', data?.msg);
			});
		return;
  }

	private changeToJoin() {
		this.disabled = false;
		this.isProcessing = false;
		this.label = this.labelJoin;
		this.state = ButtonState.JOIN;
		this.classStyle = this.defaultStyle;
	}

	private changeToProcess() {
		// this.disabled = true;
		this.isProcessing = true;
		this.label = this.labelProcess;
		this.state = ButtonState.PROCESS;
		this.classStyle = this.processStyle;
	}

	private changeToLeave() {
		this.disabled = false;
		this.isProcessing = false;
		this.label = this.labelLeave;
		this.state = ButtonState.LEAVE;
		this.classStyle = this.cancelStyle;
	}

	handleLabel() {
		this.label = this.labelJoin;
		this.disabled = false;
	}

	handleState() {
		this.state = 0;
	}

	delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
	}

}
