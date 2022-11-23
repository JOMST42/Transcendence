import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';

import { Room } from '../../models';
import { ChatService } from '../../services';
import { ChannelCreateComponent } from '../channel-create/channel-create.component';

@Component({
  selector: 'app-chat-channel-list',
  templateUrl: './chat-channel-list.component.html',
  styleUrls: ['./chat-channel-list.component.scss'],
})
export class ChatChannelListComponent implements OnInit {
  @Input() channels: Room[];
  @Output() channelSelect = new EventEmitter<Room>();
  selectedChannel: Room | null = null;

  constructor(
    private readonly dialogService: DialogService,
    private readonly chatService: ChatService
  ) {}

  ngOnInit(): void {}

  onChannelSelect(channel: Room): void {
    this.channelSelect.emit(channel);
    this.selectedChannel = channel;
  }

  createChannel(): void {
    const ref = this.dialogService.open(ChannelCreateComponent, {
      header: 'Create channel',
      width: '50%',
    });

    ref.onClose.pipe(take(1)).subscribe({
      next: (room: Room) => {
        if (room) {
          console.log(room);

          this.chatService
            .createRoom(room)
            .pipe(take(1))
            .subscribe({
              next: (room) => {
                this.channels.push(room);
              },
            });
        }
      },
    });
  }
}
