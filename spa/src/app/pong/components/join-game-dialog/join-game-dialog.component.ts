import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { PlayService } from '../../../play/play.service';
import { Response } from '../../../play/interfaces';
import { ToastService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { PongService } from '../../services/pong.service';
import { Subscription, take } from 'rxjs';

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
	header: string;
	position: string;
	labelJoin = "Join";
	labelProcess = "...";
	labelLeave = "Leave";
	labelDisabled = "-";
	labelReconnect = "Reconnect"
	labelAbandon = "Abandon"
	defaultStyle = "p-button-raised p-button-outlined"
	private processStyle = "p-button-raised p-button-outlined p-button-secondary"
	private disabledStyle = "p-button-raised p-button-outlined p-button-danger"
	state: ButtonState;
	labelJoinButton: string | undefined;
	labelLeaveButton: string | undefined;
	disabled: boolean;
	isProcessing: boolean = false;
	classStyle: string = this.defaultStyle;

	private interval?: NodeJS.Timer;
	private updateSub: Subscription;

	constructor(private server: PlayService,
		 private primengConfig: PrimeNGConfig,
		 private toast: ToastService,
		 private readonly router: Router,
		 private readonly pongService: PongService,
		 ) {
		this.handleLabels();
		this.handleState();
	}

	ngOnInit() {
		this.primengConfig.ripple = true;
		this.setListeners();
		// this.refreshDialog();
		// this.interval = setInterval(() => this.refreshDialog(), 2500);
	}

	setListeners() {
		// this.server.listenGameWaiting().subscribe(() => {
		// 	this.showPositionDialog('bottom');
		// 	this.changeToActive();
		// });
		this.server.listen('join-prompt').subscribe(() => {
			this.showPositionDialog('bottom');
			this.changeToActive();
		});

		this.server.listen('reconnect-prompt').subscribe(() => {
			this.showPositionDialog('bottom');
			this.changeToReconnect();
		});

		this.server.listen('game-finished').subscribe(() => {
			if (this.state === ButtonState.ACTIVE)
				this.toast.showInfo('Game ended', 'A player has left the game');
			this.changeToDisabled();
		});
	}

	// async refreshDialog() {
	// 	await new Promise( resolve => setTimeout(resolve, 4000) );
		
	// 	if (!this.pongService.user) return ;
	// 	this.updateSub?.unsubscribe();
	// 	this.updateSub = this.pongService.canJoinGame(this.pongService.user.id).pipe(take(1)).subscribe({
  //     next: (data: Response) => {
  //       if (data.code === 0) {
	// 				this.showPositionDialog('bottom');
	// 			}
  //     },
  //     error: (err) => { 
	// 			this.displayPosition = false;
	// 		},
  //   });
	// }

	showPositionDialog(position: string) {
			this.position = position;
			this.displayPosition = true;
	}

	async handleJoin(event: any) {
		if (this.state === ButtonState.ACTIVE) {
			await this.join();
		}
	}

	async handleLeave(event: any) {
		if (this.state === ButtonState.ACTIVE) {
			await this.leave();
		}
	}

	async join() {
    this.server
      .emit('join-game', {})
      .then((data: Response) => {
				this.router.navigate(['play/classic']);
				this.toast.showSuccess('Join success', 'You joined the game');
			}, (data: Response | undefined) => {
				this.changeToActive();
				this.toast.showError('Join error', data?.msg);
			});
			this.changeToDisabled();
  }

  async leave() {
		this.server
      .emit('leave-game', {})
      .then((data: Response) => {
				this.toast.showSuccess('Leave success', 'You left the game');
			}, (data: Response | undefined) => {
				this.changeToActive();
				this.toast.showError('Leave error', data?.msg);
			});
		this.changeToDisabled();
		return;
  }

	private changeToActive() {
		this.disabled = false;
		this.isProcessing = false;
		this.header = "Your game is ready!";
		this.labelJoinButton = this.labelJoin;
		this.labelLeaveButton = this.labelLeave;
		this.state = ButtonState.ACTIVE;
		this.classStyle = this.defaultStyle;
	}

	private changeToReconnect() {
		this.disabled = false;
		this.isProcessing = false;
		this.header = "You have a game in progress!";
		this.labelJoinButton = this.labelReconnect;
		this.labelLeaveButton = this.labelAbandon;
		this.state = ButtonState.ACTIVE;
		this.classStyle = this.defaultStyle;
	}


	private changeToDisabled() {
		this.displayPosition = false;
		this.state = ButtonState.DISABLED;
		this.classStyle = this.defaultStyle;
	}

	handleLabels() {
		this.header = "Your game is ready!";
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
