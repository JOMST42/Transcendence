import { TimerType } from '../enums';

export class Timer {
  interval: NodeJS.Timer;
  private timer: number;
  type: TimerType;
  startTime: number;
  endTime: number;
  private tickValue: number;
  private tickTime = 10;
  callback?: Function;

  constructor(
    type: TimerType,
    start: number,
    end: number,
    callback?: Function,
  ) {
    this.type = type;
    this.timer = end;
    this.startTime = start;
    this.endTime = end;
    if (callback !== undefined) {
      this.callback = callback;
    }
    switch (this.type) {
      case TimerType.COUNTDOWN:
        this.tickValue = -(1 / (1000 / this.tickTime));
        break;
      default:
        this.tickValue = 0.01;
    }
  }

  start(callback: Function) {
    this.reset();
    if (callback !== undefined) this.callback = callback;
    this.interval = setInterval(() => this.tick(), this.tickTime);
  }

  private tick() {
    if (this.timer > this.endTime || this.type === TimerType.STOPWATCH)
      this.timer += this.tickValue;
    else this.stop(true);
  }

  pause() {
    clearInterval(this.interval);
  }

  resume() {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.tick(), 1000);
  }

  // true will execute the callback function if one was provided during construction
  stop(doCallback?: boolean) {
    clearInterval(this.interval);
    this.reset();
    if (doCallback === true && this.callback) this.callback();
  }

  //Stop without callback and set the timer back to its start value
  reset() {
    this.pause();
    this.timer = this.startTime;
  }

  getTime() {
    return this.timer;
  }
}
