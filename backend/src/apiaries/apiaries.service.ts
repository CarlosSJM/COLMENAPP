import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApiaryDto } from './dto/create-apiary.dto';
import { UpdateApiaryDto } from './dto/update-apiary.dto';

@Injectable()
export class ApiariesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.apiary.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const apiary = await this.prisma.apiary.findFirst({
      where: { id, user_id: userId },
      include: { hives: true },
    });
    if (!apiary) throw new NotFoundException('Apiary not found');
    return apiary;
  }

  async create(dto: CreateApiaryDto, userId: string) {
    return this.prisma.apiary.create({
      data: {
        ...dto,
        user_id: userId,
      },
    });
  }

  async update(id: string, dto: UpdateApiaryDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.apiary.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.apiary.delete({ where: { id } });
  }

  async findHives(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.hive.findMany({
      where: { apiary_id: id },
      include: { apiary: { select: { name: true } } },
      orderBy: { created_at: 'desc' },
    });
  }
}
