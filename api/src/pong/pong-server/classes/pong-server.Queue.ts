import { Logger } from '@nestjs/common';

export class Queue<T> {
  private logger: Logger = new Logger('PongQueue');

  private queue: T[] = [];
  private maxEntries = 100;

  constructor() {}

  length(): number {
    return this.queue.length;
  }

  // Push to the front of the queue if there is space and user is not already in it
  push(t: T): T | undefined {
    // TODO  throw Error(...)??
    if (this.queue.length >= this.maxEntries) return undefined;
    if (this.queue.find((user) => user === t)) return undefined;
    this.queue.push(t);
    return t;
  }

  // Remove and return the front of the queue
  pop(): T | undefined {
    return this.queue.shift();
  }

  popN(n: number): T[] | undefined {
    const users: T[] = [];
    if (n <= 0) return undefined;
    // this.cull_disconnected();
    if (this.queue.length < n) return undefined;
    while (n-- > 0) users.push(this.pop()!);
    return users;
  }

  // Clean the queue and return/remove the next available user
  popNextUser(): T | undefined {
    let user: T;

    // this.cull_disconnected();
    return this.pop();
  }

  // getNextTwo(): T[] | undefined {
  //   // this.cull_disconnected();
  // }

  checkReady(n: number): boolean {
    // this.cull_disconnected();
    if (this.queue.length < n) return false;
    return true;
  }

  unqueue(t: T): T | undefined {
    const i = this.queue.indexOf(t);
    if (i >= 0) return this.queue.splice(i)[0];
    return undefined;
  }

  // Clean the queue (disconnection, etc.)
  clean() {
    // this.cull_disconnected();
  }

  // Remove all disconnected users
  // cull_disconnected() {
  //   this.queue.filter(this.is_connected);
  // }

  is_queued(t: T): boolean {
    if (this.queue.find((user) => user === t)) return true;
    return false;
  }

  filter(predicate: () => boolean): boolean {
    this.queue = this.queue.filter(predicate);
    return false;
  }

  // private is_connected(t: T, i: number, arr: T[]): boolean {
  //   if (t.getSocket().connected) return true;
  //   return false;
  // }
}
