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
      username: 'testuser',
      email: 'testuser@example.com',
      status: 'active',
      role: 'user',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should login the user and return a token', async () => {
    const response = await request(app.getHttpServer()).post('/users/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    accessToken = response.body.token;
  });

  it('should retrieve user information with a valid token', async () => {
    const response = await request(app.getHttpServer()).get('/users/1').set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should update user information with a valid token', async () => {
    const response = await request(app.getHttpServer()).patch('/users/1').set('Authorization', `Bearer ${accessToken}`).send({
      username: 'updateduser',
      email: 'updateduser@example.com',
      status: 'active',
      role: 'user',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'updateduser');
  });

  it('should return 401 without token for protected routes', async () => {
    const response = await request(app.getHttpServer()).get('/users/1');
    expect(response.status).toBe(401);
  });
});
