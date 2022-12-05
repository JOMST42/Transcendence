import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Room } from '../../models';
import { ChatService } from '../../services';

@Component({
  selector: 'app-dm-invite',
  templateUrl: './dm-invite.component.html',
  styleUrls: ['./dm-invite.component.scss'],
})
export class DmInviteComponent implements OnInit {
  @Input() userId: number;
  @Output() onClick = new EventEmitter<void>();
  @Output() room = new EventEmitter<Room>();

  constructor(
    private readonly chatService: ChatService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  click(): void {
    this.chatService
      .createDm(this.userId)
      .pipe(take(1))
      .subscribe({
        next: (room) => {
          this.onClick.emit();
          console.log(this.router.url);

          if (this.router.url === '/chat') {
            this.room.emit(room);
          } else {
            this.router.navigate(['chat']);
          }
        },
      });
  }
}
