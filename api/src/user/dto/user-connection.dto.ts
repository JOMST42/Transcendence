import { SocketType } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateUserConnectionDto {
  @IsString()
  socketId: string;

  type: SocketType;
}
