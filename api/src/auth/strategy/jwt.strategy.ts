import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';

import { UserService } from '../../user/services/user.service';
import { TokenPayload } from '../utils/auth.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: TokenPayload): Promise<User | null> {
    const user = await this.userService.getUserById(payload.sub);
    if (!user.isTwoFactorAuthEnabled) {
      return user;
    } else if (payload.isTwoFactorAuthenticated) {
      return user;
    } else {
      return null;
    }
  }
}
