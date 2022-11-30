import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-user-img',
  templateUrl: './user-img.component.html',
  styleUrls: ['./user-img.component.scss'],
})
export class UserImgComponent implements OnInit, OnChanges {
  @Input() avatarUrl: string;
  @Input() userIsMe!: boolean;
  @Output() eventUpload = new EventEmitter<void>();

  constructor() {}

  onUpload() {
    this.eventUpload.emit();
  }

  getUrl(): string {
    return this.avatarUrl;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.avatarUrl = this.getUrl();
  }
}
