import { Component, Input, OnInit } from '@angular/core';
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
  label: string;

  constructor() {}

  ngOnInit(): void {
    this.label = avatarLabel(this.channel.name);
  }
}
