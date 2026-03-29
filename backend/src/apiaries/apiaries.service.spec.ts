import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ApiariesService } from './apiaries.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ApiariesService', () => {
  let service: ApiariesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      apiary: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      hive: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiariesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ApiariesService>(ApiariesService);
  });

  describe('findAll', () => {
    it('should filter by user_id', async () => {
      prisma.apiary.findMany.mockResolvedValue([]);

      await service.findAll('user-1');

      expect(prisma.apiary.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user_id: 'user-1' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return apiary if owned by user', async () => {
      const apiary = { id: 'a1', name: 'Mine', user_id: 'user-1' };
      prisma.apiary.findFirst.mockResolvedValue(apiary);

      const result = await service.findOne('a1', 'user-1');
      expect(result.name).toBe('Mine');
    });

    it('should throw NotFoundException if not owned', async () => {
      prisma.apiary.findFirst.mockResolvedValue(null);

      await expect(service.findOne('a1', 'user-2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should set user_id from authenticated user', async () => {
      prisma.apiary.create.mockResolvedValue({ id: 'a1', name: 'New', user_id: 'user-1' });

      await service.create({ name: 'New', location: 'Here' }, 'user-1');

      expect(prisma.apiary.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ user_id: 'user-1' }),
      });
    });
  });

  describe('remove', () => {
    it('should verify ownership before deleting', async () => {
      prisma.apiary.findFirst.mockResolvedValue({ id: 'a1', user_id: 'user-1' });
      prisma.apiary.delete.mockResolvedValue({});

      await service.remove('a1', 'user-1');

      expect(prisma.apiary.findFirst).toHaveBeenCalled();
      expect(prisma.apiary.delete).toHaveBeenCalledWith({ where: { id: 'a1' } });
    });

    it('should throw if not owned', async () => {
      prisma.apiary.findFirst.mockResolvedValue(null);

      await expect(service.remove('a1', 'user-2')).rejects.toThrow(NotFoundException);
      expect(prisma.apiary.delete).not.toHaveBeenCalled();
    });
  });
});
