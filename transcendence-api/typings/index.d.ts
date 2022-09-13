declare module 'passport-42' {
  interface Profile {
    username: string;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
  }

  interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[] | string | undefined;
    authorizationURL: string;
    tokenURL: string;
    customHeaders: string;
    profileFields: any;
  }

  type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) => void;

  class Strategy implements OAuth2Strategy {
    name: string;

    constructor(options: StrategyOptions, verify: VerifyFunction);
  }
}
