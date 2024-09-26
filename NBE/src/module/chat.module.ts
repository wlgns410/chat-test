import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from 'src/infrastructure/chat/entity/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class ChatModule {}