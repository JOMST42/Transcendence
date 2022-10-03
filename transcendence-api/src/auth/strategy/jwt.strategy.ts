import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';
import { Request } from 'express';

import { UserService } from '../../user/user.service';
import { TokenPayload } from '../utils/auth.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies['access_token'];
        },
      ]),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload): Promise<User | null> {
    return await this.userService.getUserById(payload.sub);
  }
}
