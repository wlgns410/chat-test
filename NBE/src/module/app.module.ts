import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';
import { BroadcastModule } from './broadcast.module';
import { ChatModule } from './chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from '../config/typeorm.config';
import { LoggerModule } from './logger.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ApiExceptionFilter } from '../common/filter/api-exception.filter';
import { ApiResponseInterceptor } from '../common/interceptor/api.interceptor';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeORMConfig), ConfigModule.forRoot({ isGlobal: true }), UserModule, AuthModule, BroadcastModule, ChatModule, LoggerModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
