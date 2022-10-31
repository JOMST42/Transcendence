import { IsString } from 'class-validator';

export class CreateChatRoomDto {
  @IsString()
  name: string;
}
