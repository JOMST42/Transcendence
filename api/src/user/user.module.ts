import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FriendService } from 'src/friends-list/friend.service';

@Module({
  imports: [CloudinaryModule],
  providers: [UserService, FriendService],
  exports: [UserService, FriendService],
  controllers: [UserController],
})
export class UserModule {}
