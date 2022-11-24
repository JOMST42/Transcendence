import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { Room } from '../../models';
import { avatarLabel } from '../../utils';

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.scss'],
})
export class ChatChannelComponent implements OnInit {
  @Input() channel: Room;
  @Input() selected: boolean;
  @Output() leaveChannel = new EventEmitter<Room>();
  label: string;
  items: MenuItem[] = [
    {
      label: 'Leave Channel',
      icon: 'pi pi-fw pi-power-off',
      command: (event) => {
        this.leaveChannel.emit(this.channel);
      },
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.label = avatarLabel(this.channel.name);
  }
}
