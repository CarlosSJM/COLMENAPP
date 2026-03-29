import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Inspections (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let hiveId: string;
  const testEmail = `test-insp-${Date.now()}@colmenapp.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    prisma = app.get(PrismaService);

    // Register + apiary + hive
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ name: 'Insp Tester', email: testEmail, password: '123456' });
    token = res.body.access_token;

    const apiary = await request(app.getHttpServer())
      .post('/api/v1/apiaries')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Insp Apiary', location: 'Test' });

    const hive = await request(app.getHttpServer())
      .post('/api/v1/hives')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: `INSP-${Date.now()}`, name: 'Insp Hive', apiary_id: apiary.body.id });
    hiveId = hive.body.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await app.close();
  });

  let inspectionId: string;
  const inspectionDate = '2026-03-15';

  describe('POST /api/v1/inspections', () => {
    it('should create inspection and update last_inspection on hive', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inspections')
        .set('Authorization', `Bearer ${token}`)
        .send({
          hive_id: hiveId,
          date: inspectionDate,
          queen_seen: true,
          brood_pattern: 'good',
          temperament: 'calm',
          weight: 35.5,
          varroa_count: 3,
          activity_level: 'medium',
          health_status: 'healthy',
          diseases: [],
          treatment_applied: false,
          notes: 'Test inspection',
        })
        .expect(201);

      expect(res.body.hive_id).toBe(hiveId);
      expect(res.body.queen_seen).toBe(true);
      expect(res.body.health_status).toBe('healthy');
      inspectionId = res.body.id;

      // Verify last_inspection updated on hive
      const hive = await request(app.getHttpServer())
        .get(`/api/v1/hives/${hiveId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(hive.body.last_inspection).toBeDefined();
      expect(hive.body.last_inspection).toContain('2026-03-15');
    });
  });

  describe('GET /api/v1/inspections', () => {
    it('should list inspections with hive name', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/inspections')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.length).toBeGreaterThanOrEqual(1);
      const insp = res.body.find((i: any) => i.id === inspectionId);
      expect(insp).toBeDefined();
      expect(insp.hive.name).toBe('Insp Hive');
    });
  });

  describe('GET /api/v1/hives/:id/inspections', () => {
    it('should list inspections for specific hive', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/hives/${hiveId}/inspections`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.length).toBe(1);
      expect(res.body[0].hive_id).toBe(hiveId);
    });
  });

  describe('DELETE /api/v1/inspections/:id', () => {
    it('should delete inspection', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/inspections/${inspectionId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
