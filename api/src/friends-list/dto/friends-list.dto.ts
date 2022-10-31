import { IsNumber } from 'class-validator';

export class UpdateFriendsListDto {
  @IsNumber()
  requesterId: number;

  @IsNumber()
  adresseeId: number;
}
