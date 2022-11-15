import { Component, OnInit } from '@angular/core';
import { PlayService } from '../../play.service';
import { Response } from '../../interfaces';
import {ButtonModule} from 'primeng/button'
import { ToastService } from 'src/app/core/services';

enum ButtonState {
	JOIN = 0,
	PROCESS = 1,
	LEAVE = 2
}

@Component({
  selector: 'app-queue-button',
  templateUrl: './queue-button.component.html',
	styles: ['#joinQueueButton { min-width: 200px; }'],
})
export class QueueButtonComponent implements OnInit {

	labelJoin = "Join";
	labelProcess = "processing...";
	labelLeave = "Leave";
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
  }

	async handleQueue(event: any) {
		if (this.state === ButtonState.JOIN) {
			this.changeToProcess();
			// await this.delay(1000); // TODO test purpose
			await this.joinQueue();
		}
		else if (this.state === ButtonState.LEAVE) {
			this.changeToProcess();
			// await this.delay(1000); // TODO test purpose
			await this.leaveQueue();
		}

	}

	async joinQueue(){
		console.log('Attempting to join queue...');
		
    await this.server
      .emit('join-queue', {})
      .then((data:Response) => {
        this.changeToLeave();
				this.toast.showSuccess('Queue joined', data.msg);
			}, (data: Response | undefined) => {
				this.changeToJoin();
				this.toast.showError('Queue error', data?.msg);
			});
		return;
  }

  async leaveQueue() {
		console.log('Attempting to leave queue...');
    await this.server
      .emit('leave-queue', {})
      .then((data:Response) => {
        this.changeToJoin();
				this.toast.showSuccess('Queue left', data.msg);
			}, (data: Response | undefined) => {
				this.changeToLeave();
				this.toast.showError('Queue error', data?.msg);
			});
		return;
  }

  // private async leaveQueueResponse(data: Response) {
  //   console.log('leave queue: ' + data.code + ' ' + data.msg);
  // }

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
