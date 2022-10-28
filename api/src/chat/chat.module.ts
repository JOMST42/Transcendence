import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './services/chat.service';
import { MessageService } from './services/message.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [ChatGateway, ChatService, MessageService],
})
export class ChatModule {}
