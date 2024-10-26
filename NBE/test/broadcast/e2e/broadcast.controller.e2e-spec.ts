import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/module/app.module';

describe('BroadcastController (e2e)', () => {
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

  // 방송 생성 테스트
  it('should create a new broadcast', async () => {
    const response = await request(app.getHttpServer())
      .post('/broadcast')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId: 13,
        title: 'Test Broadcast',
        description: 'A test broadcast',
        status: 'off_air',
        viewerCount: 0,
        tags: ['tag1', 'tag2'],
        thumbnailUrl: 'http://example.com/thumbnail.jpg',
      });

    expect(response.status).toBe(HttpStatus.OK);
  });

  // 특정 방송 조회 테스트
  it('should retrieve a broadcast by ID', async () => {
    const broadcastId = 1;
    const response = await request(app.getHttpServer()).get(`/broadcast/${broadcastId}`).set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.data).toHaveProperty('id', broadcastId);
  });

  // 방송 업데이트 테스트
  it('should update a broadcast', async () => {
    const broadcastId = 1;
    const updatedTitle = 'Updated Broadcast Title';
    const response = await request(app.getHttpServer()).put(`/broadcast/${broadcastId}`).set('Authorization', `Bearer ${accessToken}`).send({
      title: updatedTitle,
      description: 'Updated description',
    });

    expect(response.status).toBe(HttpStatus.OK);
  });

  // 방송 삭제 테스트
  it('should delete a broadcast', async () => {
    const broadcastId = 1;
    const response = await request(app.getHttpServer()).delete(`/broadcast/${broadcastId}`).set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.OK);
  });

  // 방송 시작 테스트
  it('should start a broadcast', async () => {
    const broadcastId = 1;
    const response = await request(app.getHttpServer()).patch(`/broadcast/${broadcastId}/start`).set('Authorization', `Bearer ${accessToken}`).send({
      id: broadcastId,
    });

    expect(response.status).toBe(HttpStatus.OK);
  });

  // 방송 종료 테스트
  it('should end a broadcast', async () => {
    const broadcastId = 1;
    const response = await request(app.getHttpServer()).patch(`/broadcast/${broadcastId}/end`).set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.OK);
  });
});
