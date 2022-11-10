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
})
export class NavBarComponent implements OnInit {

	private unsubscribeAll$ = new Subject<void>();
  @Input()user!: User | null;
//   me!: User;
  avatarUrl: string;
  userIsMe: boolean;

  isOpen = false;


  constructor(private readonly router: Router) {}

  ngOnInit(): void {}


  navGame() {
    this.router.navigate(['game']);
  }

  navUsers() {
    this.router.navigate(['users/jbadia']);
  }
  // moveBall()

  
}
