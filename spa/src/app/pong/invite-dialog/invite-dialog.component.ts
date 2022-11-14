import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Response } from '../../play/interfaces';
import { ToastService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { GameInviteService } from '../services/game-invite.service';
import { PlayService } from 'src/app/play/play.service';

enum ButtonState {
	ACTIVE = 0,
	PROCESS = 1,
	DISABLED = 2,
}

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
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
export class InviteDialogComponent { 

	displayPosition: boolean;
	position: string;
	labelAccept = "Accept";
	labelProcess = "...";
	labelRefuse = "Refuse";
	labelDisabled = "-";
	defaultStyle = "p-button-raised p-button-outlined"
	private processStyle = "p-button-raised p-button-outlined p-button-secondary"
	private disabledStyle = "p-button-raised p-button-outlined p-button-danger"
	state: ButtonState;
	labelAcceptButton: string | undefined;
	labelRefuseButton: string | undefined;
	disabled: boolean;
	isProcessing: boolean = false;
	classStyle: string = this.defaultStyle;

	constructor(private inviteService: GameInviteService,
		 private primengConfig: PrimeNGConfig,
		 private toast: ToastService,
		 private readonly router: Router,
		 private playService: PlayService,
		 ) {
		this.handleLabels();
		this.handleState();
	}

	ngOnInit() {
		this.primengConfig.ripple = true;
		this.setListeners();
	}

	setListeners() {
		this.playService.listen('player-invite').subscribe({
			next: (id:number) => {
					this.showPositionDialog('bottom');
			},
			error: (err) => {
			},
		});
			
	}

	acceptInvite() {
		this.inviteService.acceptInvite();
	}

	refuseInvite() {
		this.inviteService.refuseInvite();
	}

	showPositionDialog(position: string) {
			this.position = position;
			this.displayPosition = true;
	}

	async handleAccept(event: any) {
		if (this.state === ButtonState.ACTIVE) {
			this.changeToProcess();
			await this.delay(1000); // TODO test purpose
			await this.accept();
		}
	}

	async handleRefuse(event: any) {
		if (this.state === ButtonState.ACTIVE) {
			this.changeToProcess();
			await this.delay(1000); // TODO test purpose
			await this.refuse();
		}
	}

	async accept() {
    // this.server
    //   .emit('accept-game', {})
    //   .then((data: Response) => {
		// 		this.changeToDisabled();
		// 		this.router.navigate(['play/classic']);
		// 		this.toast.showSuccess('Accept success', 'You accepted the game');
		// 	}, (data: Response | undefined) => {
		// 		this.changeToActive();
		// 		this.toast.showError('Accept error', data?.msg);
		// 	});
  }

  async refuse() {
		// console.log('Attempting to refuse queue...');
    // await this.server
    //   .emit('refuse-game', {})
    //   .then((data: Response) => {
    //     this.changeToDisabled();
		// 		this.toast.showSuccess('Refuse success', 'You left the game');
		// 	}, (data: Response | undefined) => {
		// 		this.changeToActive();
		// 		this.toast.showError('Refuse error', data?.msg);
		// 	});
		// return;
  }

	private changeToActive() {
		this.disabled = false;
		this.isProcessing = false;
		this.labelAcceptButton = this.labelAccept;
		this.labelRefuseButton = this.labelRefuse;
		this.state = ButtonState.ACTIVE;
		this.classStyle = this.defaultStyle;
	}

	private changeToProcess() {
		// this.disabled = true;
		this.isProcessing = true;
		this.labelAcceptButton = this.labelProcess;
		this.labelRefuseButton = this.labelProcess;
		this.state = ButtonState.PROCESS;
		this.classStyle = this.processStyle;
	}

	private changeToDisabled() {
		this.disabled = true;
		this.isProcessing = false;
		this.displayPosition = false;
		this.labelAcceptButton = this.labelDisabled;
		this.labelRefuseButton = this.labelDisabled;
		this.state = ButtonState.DISABLED;
		this.classStyle = this.defaultStyle;
	}

	handleLabels() {
		this.labelAcceptButton = this.labelAccept;
		this.labelRefuseButton = this.labelRefuse;
		this.disabled = false;
	}

	handleState() {
		this.state = 0;
	}

	delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
	}
}
