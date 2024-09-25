import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/infrastructure/chat/entity/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  controllers: [],
  providers: [],
  exports: [],
})
export class ChatModule {}
