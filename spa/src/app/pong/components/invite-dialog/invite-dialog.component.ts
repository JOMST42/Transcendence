import { Component } from "@angular/core";
import { PrimeNGConfig } from "primeng/api";
import { Subscription, take } from "rxjs";
import { ToastService, AuthService } from "src/app/core/services";
import { Response } from "src/app/play/interfaces";
import { PlayService } from "src/app/play/play.service";
import { UserService } from "src/app/user/services";
import { InviteState } from "../../enums";
import { GameInviteService } from "../../services/game-invite.service";
import { PongService } from "../../services/pong.service";


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

	private interval?: NodeJS.Timer;
	private updateSub: Subscription;

	constructor(private inviteService: GameInviteService,
		 private primengConfig: PrimeNGConfig,
		 private toast: ToastService,
		 private playService: PlayService,
		 private readonly pongService: PongService,
		 ) {
		this.handleLabels();
		this.handleState();
	}

	ngOnInit() {
		this.primengConfig.ripple = true;
		this.setListeners();
		this.refreshDialog();
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

	refreshDialog() {
		if (!this.pongService.user) return ;

		this.updateSub?.unsubscribe();
		this.updateSub = this.pongService.canJoinGame(this.pongService.user.id).pipe(take(1)).subscribe({
      next: (data: Response) => {
        if (data.code === 0) {
					this.showPositionDialog('bottom');
				}
      },
      error: (err) => { 
				this.displayPosition = false;
			},
    });
	}

	async acceptInvite() {
		this.inviteService.acceptInvite();
	}

	async refuseInvite() {
		this.inviteService.refuseInvite();
	}

	showPositionDialog(position: string) {
			this.position = position;
			this.displayPosition = true;
	}

	async handleAccept(event: any) {
		if (this.state === ButtonState.ACTIVE) {
			this.accept();
			this.displayPosition = false;
		}
	}

	async handleRefuse(event: any) {
		if (this.state === ButtonState.ACTIVE) {
			 this.refuse();
			 this.displayPosition = false;
		}
	}

	async accept() {
    this.inviteService.acceptInvite();
  }

  async refuse() {
    this.inviteService.refuseInvite();
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
