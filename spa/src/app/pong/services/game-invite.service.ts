import { Injectable } from '@angular/core';
import { ToastService } from 'src/app/core/services';
import { PlayService } from 'src/app/play/play.service';
import { Response } from '../../play/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameInviteService {

  constructor(private playService: PlayService, private toast: ToastService) {
		this.playService.listen('invite-cancel').subscribe((info: string)=> {
			this.toast.showWarn('Game invitation', info);
		});
	}

	async invitePlayer(targetId: number) {
		await this.playService.emit('invite-player', targetId).then((data:Response) => {
			if (data && data?.code === 0){
				this.toast.showSuccess('Game invite' ,'Invitation successfully sent!');
			} else {
				this.toast.showError('Game invite' ,'Invitation could not be sent.');
				console.debug('invitation failure: ' + data?.msg);
			}
		}).catch((data:Response) => {
			this.toast.showError('Game invite' ,'Invitation could not be sent.');
				console.debug('invitation failure: ' + data?.msg);
		});
	}

	async acceptInvite() {
		await this.playService.emit('accept-invite', {}).then((data:Response) => {
			if (data && data?.code === 0){
				this.toast.showSuccess('Game invite' ,'Invitation successfully sent!');
			} else {
				this.toast.showError('Game invite' ,'Invitation could not be sent.');
				console.debug('invitation failure: ' + data?.msg);
			}
		}).catch((data:Response) => {
			this.toast.showError('Game invite' ,'Invitation could not be sent.');
				console.debug('invitation failure: ' + data?.msg);
		});
	}

	async refuseInvite() { // TODO
		await this.playService.emit('cancel-invite', {}).then((data:Response) => {
			if (data && data?.code === 0){
				this.toast.showSuccess('Game invite' ,'Invitation successfully sent!');
			} else {
				this.toast.showError('Game invite' ,'Invitation could not be sent.');
				console.debug('invitation failure: ' + data?.msg);
			}
		}).catch((data:Response) => {
			this.toast.showError('Game invite' ,'Invitation could not be sent.');
				console.debug('invitation failure: ' + data?.msg);
		});
	}


}
