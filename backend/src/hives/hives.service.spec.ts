import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { HivesService } from './hives.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HivesService', () => {
  let service: HivesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      hive: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      apiary: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HivesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<HivesService>(HivesService);
  });

  describe('create', () => {
    it('should verify apiary ownership before creating', async () => {
      prisma.apiary.findFirst.mockResolvedValue({ id: 'a1', user_id: 'u1' });
      prisma.hive.create.mockResolvedValue({ id: 'h1', apiary_id: 'a1' });
      prisma.hive.count.mockResolvedValue(3);
      prisma.apiary.update.mockResolvedValue({});

      await service.create({ code: 'X-001', name: 'New', apiary_id: 'a1' } as any, 'u1');

      expect(prisma.apiary.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'a1', user_id: 'u1' } }),
      );
    });

    it('should update hive_count after creating', async () => {
      prisma.apiary.findFirst.mockResolvedValue({ id: 'a1', user_id: 'u1' });
      prisma.hive.create.mockResolvedValue({ id: 'h1', apiary_id: 'a1' });
      prisma.hive.count.mockResolvedValue(5);
      prisma.apiary.update.mockResolvedValue({});

      await service.create({ code: 'X-001', name: 'New', apiary_id: 'a1' } as any, 'u1');

      expect(prisma.hive.count).toHaveBeenCalledWith({ where: { apiary_id: 'a1' } });
      expect(prisma.apiary.update).toHaveBeenCalledWith({
        where: { id: 'a1' },
        data: { hive_count: 5 },
      });
    });

    it('should reject if apiary not owned', async () => {
      prisma.apiary.findFirst.mockResolvedValue(null);

      await expect(
        service.create({ code: 'X-001', name: 'New', apiary_id: 'a1' } as any, 'u2'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should update hive_count after deleting', async () => {
      prisma.hive.findFirst.mockResolvedValue({ id: 'h1', apiary_id: 'a1', apiary: { name: 'Test' } });
      prisma.hive.delete.mockResolvedValue({});
      prisma.hive.count.mockResolvedValue(2);
      prisma.apiary.update.mockResolvedValue({});

      await service.remove('h1', 'u1');

      expect(prisma.hive.count).toHaveBeenCalledWith({ where: { apiary_id: 'a1' } });
      expect(prisma.apiary.update).toHaveBeenCalledWith({
        where: { id: 'a1' },
        data: { hive_count: 2 },
      });
    });
  });

  describe('findByCode', () => {
    it('should find hive by code filtered by user', async () => {
      prisma.hive.findFirst.mockResolvedValue({ id: 'h1', code: 'AN-001' });

      const result = await service.findByCode('AN-001', 'u1');

      expect(result.code).toBe('AN-001');
      expect(prisma.hive.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { code: 'AN-001', apiary: { user_id: 'u1' } },
        }),
      );
    });

    it('should throw NotFoundException for unknown code', async () => {
      prisma.hive.findFirst.mockResolvedValue(null);

      await expect(service.findByCode('NOPE', 'u1')).rejects.toThrow(NotFoundException);
    });
  });
});
