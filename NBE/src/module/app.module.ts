import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';
import { BroadcastModule } from './broadcast.module';
import { ChatModule } from './chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from 'src/config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(TypeORMConfig), ConfigModule.forRoot({ isGlobal: true }), UserModule, BroadcastModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
