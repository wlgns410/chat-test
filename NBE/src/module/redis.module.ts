import { Module, Global } from '@nestjs/common';
import redisClient, { connectRedis } from '../common/redis/redis-client';

@Global() // 전역 모듈로 설정
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT', // Redis 클라이언트를 토큰으로 제공
      useFactory: async () => {
        await connectRedis(); // Redis 연결
        return redisClient;
      },
    },
  ],
  exports: ['REDIS_CLIENT'], // 다른 모듈에서 REDIS_CLIENT를 사용할 수 있도록 내보냄
})
export class RedisModule {}
