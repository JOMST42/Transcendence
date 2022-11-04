import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

export class Queue {
  private logger: Logger = new Logger('PongQueue');

  private queue: Socket[] = [];
  private maxEntries!: number;

  constructor(maxSize: number) {
    this.maxEntries = maxSize;
  }

  length(): number {
    return this.queue.length;
  }

  // Push to the front of the queue if there is space and socket is not already in it
  push(s: Socket): Socket | undefined {
    // TODO  throw Error(...)??
    this.clean();
    if (this.queue.length >= this.maxEntries) return undefined;
    // if (this.is_queued(s)) return undefined; // TODO
    this.queue.push(s);
    return s;
  }

  // Return n elements from the start without popping them
  fetchN(n: number): Socket[] {
    return this.queue.slice(0, n);
  }

  // Remove and return the front of the queue
  pop(): Socket | undefined {
    this.clean();
    return this.queue.shift();
  }

  popN(n: number): Socket[] | undefined {
    this.clean();
    const sockets: Socket[] = [];
    if (n <= 0) return undefined;
    this.clean();
    if (this.queue.length < n) n = this.queue.length;
    while (n-- > 0) sockets.push(this.pop()!);
    return sockets;
  }

  // Clean the queue and return/remove the next available socket
  popNextUser(): Socket | undefined {
    this.clean();
    return this.pop();
  }

  checkReady(n: number): boolean {
    this.clean();
    if (this.queue.length < n) return false;
    return true;
  }

  unqueue(s: Socket): Socket | undefined {
    this.clean();
    const i = this.queue.indexOf(s);
    if (i >= 0) return this.queue.splice(i)[0];
    return undefined;
  }

  isFull(): boolean {
    return this.length() === this.maxEntries;
  }

  // Return if the queue will be over capacity after pushing <entriesToAdd> elements.
  getFullStatus(entriesToAdd = 0): {
    isFull: boolean;
    nToFull: number;
  } {
    if (this.isFull()) {
      return { isFull: true, nToFull: 0 };
    }
    const nToFull = this.maxEntries - (entriesToAdd + this.length());
    if (nToFull < entriesToAdd) {
      return { isFull: true, nToFull: nToFull };
    }
    return { isFull: false, nToFull: nToFull };
  }

  // Clean the queue (disconnection, etc.)
  clean() {
    this.queue = this.queue.filter(this.is_connected);
  }

  is_queued(s: Socket): boolean {
    this.clean();
    if (this.queue.find((socket) => socket.data.user?.id === s.data.user?.id))
      return true;
    return false;
  }

  private is_connected(s: Socket, i: number, arr: Socket[]): boolean {
    if (s.connected) return true;
    return false;
  }
}
