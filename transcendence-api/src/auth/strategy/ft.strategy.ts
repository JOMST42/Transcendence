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
      clientID: config.get('API42_UID'),
      clientSecret: config.get('API42_SECRET'),
      callbackURL: config.get('CALLBACK_URL'),
      scope: ['public'],
      profileFields: {
        username: 'login',
        displayName: 'displayname',
        firstName: 'first_name',
        lastName: 'last_name',
        email: 'email',
      },
    });
  }

  async validate(
    access_token: string,
    refresh_token: string,
    profile: Profile,
  ): Promise<User | null> {
    console.log(access_token);
    console.log(refresh_token);
    console.log(profile);
    return await this.authService.validateUser(profile);
  }
}
