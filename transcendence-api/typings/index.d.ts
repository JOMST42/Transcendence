declare module 'passport-42' {
  export interface Profile {
    username: string;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    provider: string;
    _raw: string;
    _json: string;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[] | string | undefined;
    authorizationURL: string;
    tokenURL: string;
    customHeaders: string;
    profileFields: any;
  }

  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) => void;

  export class Strategy implements OAuth2Strategy {
    name: string;

    constructor(options: StrategyOptions, verify: VerifyFunction);
  }
}
