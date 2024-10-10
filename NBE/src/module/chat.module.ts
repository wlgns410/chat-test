import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from '../infrastructure/chat/entity/chat.entity';
import { ChatController } from '../interface/presentation/chat/controller/chat.controller';
import { ChatService } from '../domain/chat/service/chat.service';
import { ChatRepositorySymbol } from '../domain/chat/interface/chat.repository';
import { ChatRepositoryImpl } from '../infrastructure/chat/repository/chat.repository.impl';
import { ChatGateway } from '../infrastructure/socket/chat/chat-socket'; // ChatGateway를 가져옵니다

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity])],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    {
      provide: ChatRepositorySymbol,
      useClass: ChatRepositoryImpl,
    },
  ],
  exports: [ChatService],
})
export class ChatModule {}
