export interface User {
  id?: number;
  username?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  status: UserStatus;
  twoFASecret?: string;
  isTwoFactorAuthEnabled: boolean;
}

export interface UpdateUserDto {
  displayName?: string;
  avatarUrl?: string;
}

export enum UserStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  IN_GAME = 'IN_GAME',
  SPECTATING = 'SPECTATING',
}
