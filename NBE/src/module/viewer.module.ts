// viewer.module.ts
import { Module } from '@nestjs/common';
import { RedisViewerRepository } from '../infrastructure/redis/redis.repository.impl';
import { ViewerService } from '../domain/redis/service/redis.service';

@Module({
  providers: [RedisViewerRepository, ViewerService],
  exports: [RedisViewerRepository, ViewerService],
})
export class ViewerModule {}
