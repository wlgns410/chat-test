import { createClient } from 'redis';

// Redis 클라이언트를 생성합니다.
const redisClient = createClient({
  socket: {
    host: 'localhost',
    port: 6379, // Redis 기본 포트
  },
});

// Redis 오류 이벤트를 처리합니다.
redisClient.on('error', err => console.error('Redis Client Error', err));

// Redis 연결 함수
export const connectRedis = async () => {
  await redisClient.connect(); // Redis에 연결
  console.log('Redis connected');
};

// 기본 내보내기: Redis 클라이언트
export default redisClient;
