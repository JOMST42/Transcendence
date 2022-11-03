import { Component, Input, OnInit } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-event-button',
  templateUrl: './event-button.component.html',
  styleUrls: ['./event-button.component.scss']
})
export class EventButtonComponent implements OnInit {

	@Input() defaultLabel!: any;
	@Input() processLabel!: any;
	@Input() successLabel!: any;

	@Input() defaultFct!: Function;
	@Input() processFct?: Function;
	@Input() successFct!: Function;

	state: ('DEFAULT' | 'PROCESS' | 'SUCCESS') = 'DEFAULT';
	private previousState: ('DEFAULT' | 'PROCESS' | 'SUCCESS') = 'DEFAULT';

  constructor() {}

  ngOnInit(): void {
  }

	doFunction(state: ('DEFAULT' | 'PROCESS' | 'SUCCESS')) {
		switch(state) {
			case 'DEFAULT':
				this.process();
				this.defaultFct();
				break;
			case 'PROCESS':
				this.processFct();
				break;
			case 'SUCCESS':
				this.successFct();
				break;
		}
		console.log('doing function');

	}

	success() {
		if (this.state === 'PROCESS')
		{
			if (this.previousState === 'DEFAULT')
				this.changeState(this.state = 'SUCCESS')
			else
			this.changeState(this.state = 'DEFAULT')
		}
	}

	process() {
		this.changeState('PROCESS');
	}

	fail() {
		if (this.state === 'PROCESS')
		{
			this.changeState(this.previousState)
		}
	}

	private changeState(state: ('DEFAULT' | 'PROCESS' | 'SUCCESS')) {
		this.previousState = state
		this.state = state;

	}



}
