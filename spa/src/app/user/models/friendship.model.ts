export interface UpdateFriendsDto {
  requesterId?: number;
  adresseeId?: number;
  accepted?: boolean;
  banned?: boolean;
}
