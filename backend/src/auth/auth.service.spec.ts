import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    jwtService = { sign: jest.fn().mockReturnValue('mock-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should hash the password', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: '1', email: 'test@test.com' });

      await service.register({ name: 'Test', email: 'test@test.com', password: '123456' });

      const createCall = prisma.user.create.mock.calls[0][0];
      expect(createCall.data.password_hash).toBeDefined();
      expect(createCall.data.password_hash).not.toBe('123456');

      const isValid = await bcrypt.compare('123456', createCall.data.password_hash);
      expect(isValid).toBe(true);
    });

    it('should throw ConflictException for duplicate email', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'dup@test.com' });

      await expect(
        service.register({ name: 'Dup', email: 'dup@test.com', password: '123456' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should return access_token on success', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: '1', email: 'new@test.com' });

      const result = await service.register({ name: 'New', email: 'new@test.com', password: '123456' });

      expect(result.access_token).toBe('mock-token');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: '1', email: 'new@test.com' });
    });
  });

  describe('login', () => {
    it('should return token for valid credentials', async () => {
      const hash = await bcrypt.hash('123456', 10);
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'user@test.com', password_hash: hash });

      const result = await service.login({ email: 'user@test.com', password: '123456' });

      expect(result.access_token).toBe('mock-token');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const hash = await bcrypt.hash('123456', 10);
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'user@test.com', password_hash: hash });

      await expect(
        service.login({ email: 'user@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'noone@test.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user without password_hash', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', name: 'Test', email: 'test@test.com', created_at: new Date() });

      const result = await service.getProfile('1');

      expect(result.email).toBe('test@test.com');
      expect(result.password_hash).toBeUndefined();
    });
  });
});
