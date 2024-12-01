// viewer.module.ts
import { Module } from '@nestjs/common';
import { RedisViewerRepository } from '../infrastructure/redis/redis.repository.impl'; // RedisViewerRepository 경로
import { ViewerService } from '../domain/redis/service/redis.service';

@Module({
  providers: [RedisViewerRepository, ViewerService], // RedisViewerRepository와 ViewerService 등록
  exports: [RedisViewerRepository, ViewerService], // 다른 모듈에서 사용할 수 있도록 exports
})
export class ViewerModule {}
