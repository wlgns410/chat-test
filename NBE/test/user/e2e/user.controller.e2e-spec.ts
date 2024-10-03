import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/module/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user', async () => {
    const response = await request(app.getHttpServer()).post('/users/register').send({
      username: 'testuser11',
      email: 'testuser15@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('username', 'testuser11');
  });

  it('should login the user and return a token', async () => {
    const response = await request(app.getHttpServer()).post('/users/login').send({
      email: 'testuser15@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('token');
    accessToken = response.body.data.token;
  });

  it('should retrieve user information with a valid token', async () => {
    const response = await request(app.getHttpServer()).get('/users/15').set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', 15);
    expect(response.body.data).toHaveProperty('username', 'testuser11');
  });
});
