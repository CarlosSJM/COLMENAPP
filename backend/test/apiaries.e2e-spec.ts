import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Apiaries (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let userId: string;
  const testEmail = `test-apiaries-${Date.now()}@colmenapp.com`;

  // Second user for ownership tests
  let token2: string;
  const testEmail2 = `test-apiaries2-${Date.now()}@colmenapp.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    prisma = app.get(PrismaService);

    // Register user 1
    const res1 = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ name: 'User 1', email: testEmail, password: '123456' });
    token = res1.body.access_token;

    const me = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);
    userId = me.body.id;

    // Register user 2
    const res2 = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ name: 'User 2', email: testEmail2, password: '123456' });
    token2 = res2.body.access_token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [testEmail, testEmail2] } } });
    await app.close();
  });

  let apiaryId: string;

  describe('POST /api/v1/apiaries', () => {
    it('should create an apiary', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/apiaries')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Apiary', location: 'Test Location', notes: 'Test notes' })
        .expect(201);

      expect(res.body.name).toBe('Test Apiary');
      expect(res.body.location).toBe('Test Location');
      expect(res.body.user_id).toBe(userId);
      apiaryId = res.body.id;
    });

    it('should reject without auth', () => {
      return request(app.getHttpServer())
        .post('/api/v1/apiaries')
        .send({ name: 'No Auth', location: 'Somewhere' })
        .expect(401);
    });

    it('should reject without required fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/apiaries')
        .set('Authorization', `Bearer ${token}`)
        .send({ notes: 'Missing name and location' })
        .expect(400);
    });
  });

  describe('GET /api/v1/apiaries', () => {
    it('should list only own apiaries', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/apiaries')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      res.body.forEach((a: any) => expect(a.user_id).toBe(userId));
    });

    it('user 2 should not see user 1 apiaries', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/apiaries')
        .set('Authorization', `Bearer ${token2}`)
        .expect(200);

      const ids = res.body.map((a: any) => a.id);
      expect(ids).not.toContain(apiaryId);
    });
  });

  describe('GET /api/v1/apiaries/:id', () => {
    it('should get own apiary', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/apiaries/${apiaryId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe(apiaryId);
      expect(res.body.name).toBe('Test Apiary');
    });

    it('user 2 should not access user 1 apiary', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/apiaries/${apiaryId}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(404);
    });
  });

  describe('PUT /api/v1/apiaries/:id', () => {
    it('should update own apiary', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/apiaries/${apiaryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Apiary' })
        .expect(200);

      expect(res.body.name).toBe('Updated Apiary');
    });

    it('user 2 should not update user 1 apiary', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/apiaries/${apiaryId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ name: 'Hacked' })
        .expect(404);
    });
  });

  describe('GET /api/v1/apiaries/:id/hives', () => {
    it('should list hives of own apiary', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/apiaries/${apiaryId}/hives`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('DELETE /api/v1/apiaries/:id', () => {
    it('user 2 should not delete user 1 apiary', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/apiaries/${apiaryId}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(404);
    });

    it('should delete own apiary', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/apiaries/${apiaryId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should not find deleted apiary', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/apiaries/${apiaryId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
