import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from '../infrastructure/chat/entity/chat.entity';
import { ChatController } from '../interface/presentation/chat/controller/chat.controller';
import { ChatService } from '../domain/chat/service/chat.service';
import { ChatRepositorySymbol } from '../domain/chat/interface/chat.repository';
import { ChatRepositoryImpl } from '../infrastructure/chat/repository/chat.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity])],
  controllers: [ChatController],
  providers: [
    ChatService,
    {
      provide: ChatRepositorySymbol,
      useClass: ChatRepositoryImpl,
    },
  ],
  exports: [ChatService],
})
export class ChatModule {}
