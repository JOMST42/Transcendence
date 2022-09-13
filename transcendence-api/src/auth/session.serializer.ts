import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';

import { UserService } from '../user/user.service';

export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  serializeUser(user: User, done: Function) {
    console.log(user);

    done(null, user);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async deserializeUser(payload: any, done: Function) {
    console.log(payload);
    const user = await this.userService.findUser(payload.id);
    console.log(user);
    return done(null, user);
  }
}
