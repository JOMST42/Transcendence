import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UserConnectionService } from './services/user-connection.service';

@Module({
  imports: [CloudinaryModule],
  providers: [UserService, UserConnectionService],
  exports: [UserService, UserConnectionService],
  controllers: [UserController],
})
export class UserModule {}
