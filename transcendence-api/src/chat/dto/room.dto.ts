import { IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  ownerId: number;

  @IsString()
  name: string;
}
