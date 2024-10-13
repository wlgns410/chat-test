import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './module/app.module';
import { readFileSync } from 'fs';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정 로드 (루트 경로에서 swagger.json을 읽도록 수정)
  const swaggerDocument = JSON.parse(readFileSync(join(__dirname, '../../swagger.json'), 'utf8'));

  SwaggerModule.setup('api', app, swaggerDocument);

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  //소켓 어뎁터
  app.useWebSocketAdapter(new IoAdapter(app));

  // HTTP 서버 포트 설정 (같은 포트에서 HTTP + WebSocket 사용)
  await app.listen(3000);
}

bootstrap();
