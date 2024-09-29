import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './module/app.module';
import { readFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정 로드 (루트 경로에서 swagger.json을 읽도록 수정)
  const swaggerDocument = JSON.parse(readFileSync(join(__dirname, '../../swagger.json'), 'utf8'));

  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(3000);
}

bootstrap();
