import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InspectionsService', () => {
  let service: InspectionsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      inspection: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      hive: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InspectionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<InspectionsService>(InspectionsService);
  });

  describe('create', () => {
    it('should verify hive ownership before creating', async () => {
      prisma.hive.findFirst.mockResolvedValue({ id: 'h1' });
      prisma.inspection.create.mockResolvedValue({ id: 'i1', hive_id: 'h1', hive: { name: 'Test' } });
      prisma.hive.update.mockResolvedValue({});

      await service.create({
        hive_id: 'h1', date: '2026-03-15', health_status: 'healthy',
      } as any, 'u1');

      expect(prisma.hive.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'h1', apiary: { user_id: 'u1' } } }),
      );
    });

    it('should update last_inspection on hive after creating', async () => {
      prisma.hive.findFirst.mockResolvedValue({ id: 'h1' });
      prisma.inspection.create.mockResolvedValue({ id: 'i1', hive_id: 'h1', hive: { name: 'Test' } });
      prisma.hive.update.mockResolvedValue({});

      await service.create({
        hive_id: 'h1', date: '2026-03-15', health_status: 'healthy',
      } as any, 'u1');

      expect(prisma.hive.update).toHaveBeenCalledWith({
        where: { id: 'h1' },
        data: { last_inspection: new Date('2026-03-15') },
      });
    });

    it('should reject if hive not found/owned', async () => {
      prisma.hive.findFirst.mockResolvedValue(null);

      await expect(
        service.create({ hive_id: 'h1', date: '2026-03-15' } as any, 'u2'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should filter by user via hive.apiary.user_id', async () => {
      prisma.inspection.findMany.mockResolvedValue([]);

      await service.findAll('u1');

      expect(prisma.inspection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { hive: { apiary: { user_id: 'u1' } } },
        }),
      );
    });
  });

  describe('remove', () => {
    it('should verify ownership before deleting', async () => {
      prisma.inspection.findFirst.mockResolvedValue({ id: 'i1', hive: { name: 'Test' } });
      prisma.inspection.delete.mockResolvedValue({});

      await service.remove('i1', 'u1');

      expect(prisma.inspection.findFirst).toHaveBeenCalled();
      expect(prisma.inspection.delete).toHaveBeenCalledWith({ where: { id: 'i1' } });
    });
  });
});
