import { Component, Input, OnInit } from '@angular/core';
import { StateKey } from '@angular/platform-browser';
import { take } from 'rxjs';
import { BaseApiService } from 'src/app/core/services';
import { Response } from 'src/app/play/interfaces';
import { PlayService } from 'src/app/play/play.service';
import { User, UserStatus } from '../../../user/models';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
  constructor(private readonly playService: PlayService,
		private readonly apiService: BaseApiService) {}

  @Input() avatarUrl: string;
  @Input() user!: User;

	status: UserStatus = UserStatus.OFFLINE;

  isOnline(): boolean {
    if (this.status === UserStatus.ONLINE) {
      return true;
    }
    return false;
  }

  isGaming(): boolean {
    if (this.status === UserStatus.IN_GAME)
			return true;
		return false;
  }

	async refreshUserStatus() {
		this.apiService.getOne(`/pong/${this.user.id}/onlineStatus`).pipe(take(1)).subscribe({
			next: (data: Response) => {
				if (data?.code === 0)
					this.status = data.payload;
					console.log(data.payload);
			},
			error: (err) => {},
		});
	}

  ngOnInit(): void {
		this.refreshUserStatus();
		this.playService.listen('user-status-change').subscribe({
			next: (id: number) => {
				if (id === this.user.id) {
					this.refreshUserStatus();
				}
			},
			error: (err) => {},
		});
	}
}
