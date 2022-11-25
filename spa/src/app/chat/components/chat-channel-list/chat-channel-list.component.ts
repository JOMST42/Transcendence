import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Room } from '../../models';

@Component({
  selector: 'app-chat-channel-list',
  templateUrl: './chat-channel-list.component.html',
  styleUrls: ['./chat-channel-list.component.scss'],
})
export class ChatChannelListComponent implements OnInit {
  @Input() channels: Room[];
  @Output() channelSelect = new EventEmitter<Room>();
  selectedChannel: Room | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.channels.length > 0) {
      this.selectedChannel = this.channels[0];
    }
  }

  onChannelSelect(channel: Room): void {
    this.channelSelect.emit(channel);
    this.selectedChannel = channel;
  }
}
