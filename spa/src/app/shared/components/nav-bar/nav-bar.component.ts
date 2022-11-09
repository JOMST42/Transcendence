import {
  trigger,
  transition,
  style,
  animate,
  useAnimation,
  state,
} from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  SidebarOpenAnimation,
  SidebarCloseAnimation,
} from './animations/side-nav.nav';
import { User } from '../../../user/models';
import { Subject, takeUntil } from 'rxjs';

const animationParams = {
  menuWidth: '250px',
  animationStyle: '500ms ease',
};

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  animations: [
    trigger('ballMove', [
      state('*', style({ top: '{{topBall}}px', left: '{{leftBall}}px' }), {
        params: { topBall: -100, leftBall: -100 },
      }),
      transition('*=>*', animate('0.6s ease')),
    ]),
    trigger('sideMenu', [
      transition(':enter', [
        useAnimation(SidebarOpenAnimation, {
          params: {
            ...animationParams,
          },
        }),
      ]),
      transition(':leave', [
        useAnimation(SidebarCloseAnimation, {
          params: {
            ...animationParams,
          },
        }),
      ]),
    ]),
  ],
})
export class NavBarComponent implements OnInit {

	private unsubscribeAll$ = new Subject<void>();
  @Input()user!: User | null;
//   me!: User;
  avatarUrl: string;
  userIsMe: boolean;

  isOpen = false;

  @ViewChild('ball')
  private ball!: ElementRef;

  @ViewChild('ballWrap')
  private ballWrap!: ElementRef;

  selection?: HTMLElement;
  hello: string = 'a';
  selectRect?: DOMRect;
  leftBall: number = -100;
  topBall: number = 0;
  time: string = '100ms';

  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

  select(elem: HTMLElement) {
    this.selection = elem;
    this.selectRect = elem?.getBoundingClientRect();
    this.leftBall =
      this.selectRect.x + window.scrollX - +this.selection.style.width;
    this.topBall = this.selectRect.y + window.scrollY + (+this.selection.style.height / 2); // TODO
  }

  unselect(elem: HTMLElement) {
    if (this.selection === elem) {
      this.selection = undefined;
      this.selectRect = undefined;
      this.leftBall = -300;
    }
  }

  navGame() {
    this.router.navigate(['game']);
  }

  navUsers() {
    this.router.navigate(['users/jbadia']);
  }
  // moveBall()

  
}
