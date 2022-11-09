import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models';

@Component({
  selector: 'app-friend-card',
  templateUrl: './friend-card.component.html',
  styleUrls: ['./friend-card.component.scss'],
})
export class FriendCardComponent implements OnInit {
  @Input() user!: User;
  @Input() userIsMe!: boolean;
  @Input() me: User;
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  resetPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], {
      relativeTo: this.route,
    });
  }

  ngOnInit(): void {}
}
