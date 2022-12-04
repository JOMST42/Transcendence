import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { ChatService } from '../../services';

@Component({
  selector: 'app-dm-invite',
  templateUrl: './dm-invite.component.html',
  styleUrls: ['./dm-invite.component.scss'],
})
export class DmInviteComponent implements OnInit {
  @Input() userId: number;
  @Output() onClick = new EventEmitter<void>();

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
          if (this.router.url === '/chatroom') {
            window.location.reload();
          } else {
            this.router.navigate(['chat']);
          }
        },
      });
  }
}
