export interface UpdateFriendsDto {
  requesterId?: number;
  adresseeId?: number;
  accepted?: boolean;
  blocked?: boolean;
}
