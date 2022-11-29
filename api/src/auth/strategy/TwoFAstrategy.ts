import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { TokenPayload } from '../utils';
import { User } from '@prisma/client';

@Injectable()
export class TwoFAStrategy extends PassportStrategy(Strategy, 'TwoFA') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
    });
  }

  async validate(payload: TokenPayload): Promise<User | null> {
    const user = await this.userService.getUserById(payload.sub);
    if (!user.isTwoFactorAuthEnabled) {
      return user;
    }
    if (payload.isTwoFactorAuthenticated) {
      return user;
    }
  }
}
