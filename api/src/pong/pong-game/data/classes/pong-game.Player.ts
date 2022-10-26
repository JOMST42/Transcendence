// WARNING

import { Pad } from './index';

export class Player {
  private nickname?: string;
  private pad!: Pad;
  private is_ai = false;

  constructor(nick?: string, pad?: Pad) {
    if (nick) this.nickname = nick;
    else this.nickname = 'unnamed';
    if (pad) this.pad = pad;
    else this.pad = new Pad(0, { x: 0, y: 0 }, { x: 10, y: 100 }, 500);
  }

  setAI(flag: boolean) {
    this.is_ai = true;
  }

  isAI(): boolean {
    return this.is_ai;
  }

  setPad(pad: Pad) {
    this.pad = pad;
  }

  getPad(): Pad {
    return this.pad;
  }
}
