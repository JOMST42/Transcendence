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

	async invitePlayer(targetId: number): Promise<Response> {
		let response : Response;
		await this.playService.emit('invite-player', targetId).then((data:Response) => {
			if (data && data?.code === 0){
				this.toast.showSuccess('Game invite', data?.msg);
			} else {
				this.toast.showError('Game invite', data?.msg);
				console.debug('invitation failure: ' + data?.msg);
			}
			response = data;
		}).catch((data:Response) => {
			this.toast.showError('Game invite', data?.msg);
			response = data;
		});
		return response;
	}

	async acceptInvite(): Promise<Response> {
		let response : Response;
		await this.playService.emit('accept-invite', {}).then((data:Response) => {
			if (data && data?.code === 0){
				this.toast.showSuccess('Game invite', data?.msg);
			} else {
				this.toast.showError('Game invite', data?.msg);
				console.debug('invitation failure: ' + data?.msg);
			}
			response = data;
		}).catch((data:Response) => {
			this.toast.showError('Game invite', data?.msg);
			console.debug('invitation failure: ' + data?.msg);
			response = data;
		});
		return response;
	}

	async refuseInvite(): Promise<Response> { // TODO
		let response : Response;
		await this.playService.emit('refuse-invite', {}).then((data:Response) => {
			if (data && data?.code === 0){
			} else {
				this.toast.showError('Game invite' ,'Refusal could not be processed.');
				console.debug('invitation failure: ' + data?.msg);
			}
			response = data;
		}).catch((data:Response) => {
			this.toast.showError('Game invite' ,'Refusal could not be processed.');
			console.debug('invitation failure: ' + data?.msg);
			response = data;
		});
		return response;
	}


}
