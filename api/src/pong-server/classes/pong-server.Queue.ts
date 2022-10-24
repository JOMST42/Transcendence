import { Logger } from '@nestjs/common';
import { User } from '.';

export class Queue {
  private logger: Logger = new Logger('PongQueue');

  private queue: User[] = [];
  private max_users = 100;

  constructor() {}

  length(): number {
    return this.queue.length;
  }

  // Push to the front of the queue if there is space and user is not already in it
  push(u: User): User | undefined {
    // TODO  throw Error(...)??
    if (this.queue.length >= this.max_users) return undefined;
    if (this.queue.find((user) => user === u)) return undefined;
    this.queue.push(u);
    return u;
  }

  // Remove and return the front of the queue
  pop(): User | undefined {
    if (this.queue.length <= 0) return undefined;
    return this.queue.shift();
  }

  pop_n_user(n: number): User[] | undefined {
    const users: User[] = [];
    if (n <= 0) return undefined;
    this.cull_disconnected();
    if (this.queue.length < n) return undefined;
    while (n-- > 0) users.push(this.pop()!);
    return users;
  }

  // Clean the queue and return/remove the next available user
  pop_next_user(): User | undefined {
    let user: User;

    this.cull_disconnected();
    return this.pop();
  }

  check_n_ready(n: number): boolean {
    this.cull_disconnected();
    if (this.queue.length < n) return false;
    return true;
  }

  unqueue(u: User): User | undefined {
    const i = this.queue.indexOf(u);
    if (i >= 0) return this.queue.splice(i)[0];
    return undefined;
  }

  // Clean the queue (disconnection, etc.)
  clean() {
    this.cull_disconnected();
  }

  // Remove all disconnected users
  cull_disconnected() {
    this.queue.filter(this.is_connected);
  }

  is_queued(u: User): boolean {
    if (this.queue.find((user) => user === u)) return true;
    return false;
  }

  private is_connected(u: User, i: number, arr: User[]): boolean {
    if (u.getSocket().connected) return true;
    return false;
  }
}
