import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SidebarOpenAnimation } from './animations/side-nav.nav';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  animations: [
    trigger('sideMenu', [
      transition('open => closed', [
        useAnimation(SidebarOpenAnimation, {
          // params: animationParams,
        }),
      ]),
    ]),
  ],
})
export class NavBarComponent implements OnInit {
  avatarUrl: string;
  userIsMe: boolean;

  isOpen = false;

  constructor() {}

  ngOnInit(): void {}
}
