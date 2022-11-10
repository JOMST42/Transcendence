import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UserConnectionService } from './services/user-connection.service';
import { FriendService } from 'src/friends-list/friend.service';

@Module({
  imports: [CloudinaryModule],
  providers: [UserService, UserConnectionService, FriendService],
  exports: [UserService, UserConnectionService, FriendService],
  controllers: [UserController],
})
export class UserModule {}
