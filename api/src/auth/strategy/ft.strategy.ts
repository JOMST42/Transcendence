import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Profile, Strategy } from 'passport-42';

import { AuthService } from '../auth.service';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthService,
    config: ConfigService,
  ) {
    super({
      clientID: config.get('FT_UID'),
      clientSecret: config.get('FT_SECRET'),
      callbackURL: config.get('CALLBACK_URL'),
      scope: ['public'],
      profileFields: {
        username: 'login',
        displayName: 'displayname',
        firstName: 'first_name',
        lastName: 'last_name',
        email: 'email',
        avatarUrl: 'image.link',
      },
    });
  }

  async validate(
    access_token: string,
    refresh_token: string,
    profile: Profile,
  ): Promise<User | null> {
    return await this.authService.validateUser({
      username: profile.username,
      displayName: profile.displayName,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
    });
  }
}
