import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Hives (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let apiaryId: string;
  const testEmail = `test-hives-${Date.now()}@colmenapp.com`;
  const hiveCode = `TEST-${Date.now()}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    prisma = app.get(PrismaService);

    // Register + create apiary
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ name: 'Hive Tester', email: testEmail, password: '123456' });
    token = res.body.access_token;

    const apiaryRes = await request(app.getHttpServer())
      .post('/api/v1/apiaries')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Apiary', location: 'Test' });
    apiaryId = apiaryRes.body.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await app.close();
  });

  let hiveId: string;

  describe('POST /api/v1/hives', () => {
    it('should create a hive and update hive_count', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/hives')
        .set('Authorization', `Bearer ${token}`)
        .send({
          code: hiveCode,
          name: 'Test Hive',
          apiary_id: apiaryId,
          status: 'active',
          queen_origin: 'purchased',
          population: 40000,
          frames: 10,
        })
        .expect(201);

      expect(res.body.code).toBe(hiveCode);
      expect(res.body.name).toBe('Test Hive');
      hiveId = res.body.id;

      // Verify hive_count updated
      const apiary = await request(app.getHttpServer())
        .get(`/api/v1/apiaries/${apiaryId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(apiary.body.hive_count).toBe(1);
    });

    it('should reject duplicate code', () => {
      return request(app.getHttpServer())
        .post('/api/v1/hives')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: hiveCode, name: 'Duplicate', apiary_id: apiaryId })
        .expect(500); // Prisma unique constraint error
    });
  });

  describe('GET /api/v1/hives/code/:code', () => {
    it('should find hive by code', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/hives/code/${hiveCode}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.code).toBe(hiveCode);
      expect(res.body.id).toBe(hiveId);
    });

    it('should return 404 for unknown code', () => {
      return request(app.getHttpServer())
        .get('/api/v1/hives/code/NONEXISTENT')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PUT /api/v1/hives/:id', () => {
    it('should update hive status', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/hives/${hiveId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'quarantine' })
        .expect(200);

      expect(res.body.status).toBe('quarantine');
    });
  });

  describe('GET /api/v1/hives', () => {
    it('should list all hives with apiary name', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/hives')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.length).toBeGreaterThanOrEqual(1);
      const hive = res.body.find((h: any) => h.id === hiveId);
      expect(hive).toBeDefined();
      expect(hive.apiary.name).toBe('Test Apiary');
    });
  });

  describe('DELETE /api/v1/hives/:id', () => {
    it('should delete hive and update hive_count', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/hives/${hiveId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verify hive_count decremented
      const apiary = await request(app.getHttpServer())
        .get(`/api/v1/apiaries/${apiaryId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(apiary.body.hive_count).toBe(0);
    });
  });
});
