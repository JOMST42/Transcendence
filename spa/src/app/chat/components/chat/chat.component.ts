import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { ToastService } from '../../../core/services';

import { Room } from '../../models';
import { ChatService } from '../../services';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  private unsubscribeAll$ = new Subject<void>();
  rooms: Room[];
  selectedChannel: Room | null = null;

  constructor(
    private readonly chatService: ChatService,
    private readonly route: ActivatedRoute,
    private readonly toastService: ToastService,
    private readonly router: Router
  ) {}

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribeAll$)).subscribe((data) => {
      this.rooms = data['rooms'];
    });
  }

  createRoom(): void {
    this.chatService
      .createRoom({ name: 'test' })
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((newRoom) => {
        this.rooms.push(newRoom);
        this.toastService.showSuccess(
          'Success',
          `Created chat room ${newRoom.name}`
        );
      });
  }

  onChannelSelect(channel: Room): void {
    this.chatService
      .getChatRoom(channel.id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.selectedChannel = data;
          console.log(data);
        },
      });
  }
}
