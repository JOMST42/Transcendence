import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { PlayService } from '../../../play/play.service';
import { Response } from '../../../play/interfaces';
import { ToastService } from 'src/app/core/services';
import { Router } from '@angular/router';

enum ButtonState {
	ACTIVE = 0,
	PROCESS = 1,
	DISABLED = 2,
}

@Component({
  selector: 'app-join-game-dialog',
  templateUrl: './join-game-dialog.component.html',
  styles: [`
      :host ::ng-deep .p-button {
          margin: 0 .5rem 0 0;
          min-width: 10rem;
      }

      p {
          margin: 0;
      }

      .confirmation-content {
          display: flex;
          align-items: center;
          justify-content: center;
      }

      :host ::ng-deep .p-dialog .p-button {
          min-width: 6rem;
      }
  `]
})
export class JoinGameDialogComponent { 

	displayPosition: boolean;
	position: string;
	labelJoin = "Join";
	labelProcess = "...";
	labelLeave = "Leave";
	labelDisabled = "-";
	defaultStyle = "p-button-raised p-button-outlined"
	private processStyle = "p-button-raised p-button-outlined p-button-secondary"
	private disabledStyle = "p-button-raised p-button-outlined p-button-danger"
	state: ButtonState;
	labelJoinButton: string | undefined;
	labelLeaveButton: string | undefined;
	disabled: boolean;
	isProcessing: boolean = false;
	classStyle: string = this.defaultStyle;

	constructor(private server: PlayService,
		 private primengConfig: PrimeNGConfig,
		 private toast: ToastService,
		 private readonly router: Router,
		 ) {
		this.handleLabels();
		this.handleState();
	}

	ngOnInit() {
		this.primengConfig.ripple = true;
		this.setListeners();
	}

	setListeners() {
		this.server.listenGameWaiting().then(() => {
			this.showPositionDialog('bottom');
		});
	}

	joinGame() {
		this.server.emit('join-game', () => {});
	}

	leaveGame() {
	}

	showPositionDialog(position: string) {
			this.position = position;
			this.displayPosition = true;
	}

	async handleJoin(event: any) {
		if (this.state === ButtonState.ACTIVE) {
			this.changeToProcess();
			await this.delay(1000); // TODO test purpose
			await this.join();
		}
	}

	async handleLeave(event: any) {
		if (this.state === ButtonState.ACTIVE) {
			this.changeToProcess();
			await this.delay(1000); // TODO test purpose
			await this.leave();
		}
	}

	async join() {
    this.server
      .emit('join-game', {})
      .then((data: Response) => {
				this.changeToDisabled();
				this.router.navigate(['play/classic']);
				this.toast.showSuccess('Join success', 'You joined the game');
			}, (data: Response | undefined) => {
				this.changeToActive();
				this.toast.showError('Join error', data?.msg);
			});
  }

  async leave() {
		console.log('Attempting to leave queue...');
    await this.server
      .emit('leave-game', {})
      .then((data: Response) => {
        this.changeToDisabled();
				this.toast.showSuccess('Leave success', 'You left the game');
			}, (data: Response | undefined) => {
				this.changeToActive();
				this.toast.showError('Leave error', data?.msg);
			});
		return;
  }

	private changeToActive() {
		this.disabled = false;
		this.isProcessing = false;
		this.labelJoinButton = this.labelJoin;
		this.labelLeaveButton = this.labelLeave;
		this.state = ButtonState.ACTIVE;
		this.classStyle = this.defaultStyle;
	}

	private changeToProcess() {
		// this.disabled = true;
		this.isProcessing = true;
		this.labelJoinButton = this.labelProcess;
		this.labelLeaveButton = this.labelProcess;
		this.state = ButtonState.PROCESS;
		this.classStyle = this.processStyle;
	}

	private changeToDisabled() {
		this.disabled = true;
		this.isProcessing = false;
		this.displayPosition = false;
		this.labelJoinButton = this.labelDisabled;
		this.labelLeaveButton = this.labelDisabled;
		this.state = ButtonState.DISABLED;
		this.classStyle = this.defaultStyle;
	}

	handleLabels() {
		this.labelJoinButton = this.labelJoin;
		this.labelLeaveButton = this.labelLeave;
		this.disabled = false;
	}

	handleState() {
		this.state = 0;
	}

	delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
	}
}
