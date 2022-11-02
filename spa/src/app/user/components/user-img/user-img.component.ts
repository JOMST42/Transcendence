import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-img',
  templateUrl: './user-img.component.html',
  styleUrls: ['./user-img.component.scss'],
})
export class UserImgComponent implements OnInit, OnDestroy, OnChanges {
  private unsubscribeAll$ = new Subject<void>();
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

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.avatarUrl = this.getUrl();
  }
}
