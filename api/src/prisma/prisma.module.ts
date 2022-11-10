import { Global, Module } from '@nestjs/common';
import { GameModule } from './game/game.module';

import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [GameModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
