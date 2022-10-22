export interface User {
  id?: number;
  username?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
}

export interface UpdateUserDto {
  displayName?: string;
  avatarUrl?: string;
}
