import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateFriendsListDto {
  @IsNumber()
  requesterId: number;

  @IsNumber()
  adresseeId: number;

  @IsBoolean()
  accepted: boolean;
}
