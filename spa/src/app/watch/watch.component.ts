import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

	logDefault() {
		return console.log('default');
	}

	logProcess() {
		return console.log('process');
	}

	logSuccess() {
		return console.log('Success');
	}

}
