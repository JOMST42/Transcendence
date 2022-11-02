import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateFriendsDto {
  @IsNumber()
  requesterId: number;

  @IsNumber()
  adresseeId: number;

  @IsBoolean()
  accepted: boolean;

  @IsBoolean()
  banned: boolean;
}
