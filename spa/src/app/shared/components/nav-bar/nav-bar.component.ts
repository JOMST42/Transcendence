import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate,
  keyframes,
  useAnimation,
  state,
} from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ballAnimation } from './animations/nav-bar.ball';

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
  ],
})
export class NavBarComponent implements OnInit {
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
    this.topBall = this.selectRect.y + window.scrollY + 60;
  }

  unselect(elem: HTMLElement) {
    if (this.selection === elem) {
      this.selection = undefined;
      this.selectRect = undefined;
      this.leftBall = -100;
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
