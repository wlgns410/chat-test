import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './module/app.module';
import { readFileSync } from 'fs';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app));

  // Swagger 설정 로드 (루트 경로에서 swagger.json을 읽도록 수정)
  const swaggerDocument = JSON.parse(readFileSync(join(__dirname, '../../swagger.json'), 'utf8'));

  SwaggerModule.setup('api', app, swaggerDocument);

  // HTTP 서버 포트 설정 (같은 포트에서 HTTP + WebSocket 사용)
  await app.listen(3000);
}

bootstrap();
