import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis'; // Redis 타입 가져오기

@Injectable()
export class RedisViewerRepository {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClientConnector: RedisClientType<any, any>, // Redis 클라이언트 타입
  ) {}

  async incrementViewerCount(broadcastId: number): Promise<void> {
    await this.redisClientConnector.incr(`viewer_count:${broadcastId}`);
  }

  async decrementViewerCount(broadcastId: number): Promise<void> {
    await this.redisClientConnector.decr(`viewer_count:${broadcastId}`);
  }

  async getViewerCount(broadcastId: number): Promise<number> {
    const count = await this.redisClientConnector.get(`viewer_count:${broadcastId}`);
    return parseInt(count || '0', 10);
  }
}
