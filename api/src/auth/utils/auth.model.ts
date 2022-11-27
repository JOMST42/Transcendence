export class UserDetails {
  username: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
}

export class TokenPayload {
  sub: number;
  isTwoFactorAuthEnabled: boolean;
  isTwoFactorAutehnticated: boolean;
}
