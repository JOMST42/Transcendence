import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';
import { Request } from 'express';

import { UserService } from '../../user/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private readonly userService: UserService,
    config: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: config.get('REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['refresh_token'];
          return data;
        },
      ]),
    });
  }

  async validate(req: Request, payload: any): Promise<User | null> {
    const data = req?.cookies['refresh_token'];

    if (!data) {
      throw new UnauthorizedException();
    }
    if (!payload) {
      throw new UnauthorizedException();
    }

    return await this.userService.getUserById(payload.sub);
  }
}
