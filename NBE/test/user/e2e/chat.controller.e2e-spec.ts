import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/module/app.module';

describe('ChatController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 로그인 후 accessToken 받아오기
    const loginResponse = await request(app.getHttpServer()).post('/users/login').send({
      email: 'testuser13@example.com',
      password: 'password123',
    });

    accessToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new chat', async () => {
    const chatResponse = await request(app.getHttpServer()).post('/chat').set('Authorization', `Bearer ${accessToken}`).send({
      userId: 13,
      broadcastId: 1,
      message: 'test message',
    });

    expect(chatResponse.status).toBe(200);
    expect(chatResponse.body.data).toHaveProperty('message', 'test message');
  });

  // 특정 유저의 채팅 조회 테스트
  it('should retrieve chats for a specific user in a broadcast', async () => {
    const broadcastId = 1;
    const userId = 13;

    const response = await request(app.getHttpServer())
      .get(`/chat/broadcast/${broadcastId}/user/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: 1, take: 10 });

    console.log(response.body);
    console.log(response.body.data);

    expect(response.status).toBe(200);
    expect(response.body.data.data.length).toBeLessThanOrEqual(10); // 최대 10개의 채팅만 반환
  });

  // 특정 방송의 모든 채팅 조회 테스트
  it('should retrieve all chats in a broadcast', async () => {
    const broadcastId = 1;

    const response = await request(app.getHttpServer())
      .get(`/chat/broadcast/${broadcastId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: 1, take: 10 });

    expect(response.status).toBe(200);
    expect(response.body.data.data.length).toBeLessThanOrEqual(10);
  });
});
