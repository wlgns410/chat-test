// test/broadcast-video/broadcast-video.controller.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/module/app.module';

describe('BroadcastVideoController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 로그인 후 accessToken 받아오기 (기본 사용자 정보는 필요에 따라 수정)
    const loginResponse = await request(app.getHttpServer()).post('/users/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });

    accessToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    await app.close();
  });

  // VOD 생성 테스트
  it('should create a new VOD entry', async () => {
    const response = await request(app.getHttpServer()).post('/broadcast-video').set('Authorization', `Bearer ${accessToken}`).send({
      broadcastId: 1,
      vodUrl: 'http://example.com/vod.mp4',
      subtitleUrl: 'http://example.com/subtitles.srt',
    });

    expect(response.status).toBe(HttpStatus.OK);
  });

  // 특정 방송의 VOD 목록 조회 테스트
  it('should retrieve a list of VODs for a specific broadcast', async () => {
    const broadcastId = 1;

    const response = await request(app.getHttpServer()).get(`/broadcast-video/${broadcastId}`).set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.OK);
  });
});
