import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHiveDto } from './dto/create-hive.dto';
import { UpdateHiveDto } from './dto/update-hive.dto';

@Injectable()
export class HivesService {
  constructor(private prisma: PrismaService) {}

  private async verifyOwnership(hiveId: string, userId: string) {
    const hive = await this.prisma.hive.findFirst({
      where: { id: hiveId, apiary: { user_id: userId } },
      include: { apiary: { select: { name: true } } },
    });
    if (!hive) throw new NotFoundException('Hive not found');
    return hive;
  }

  private async verifyApiaryOwnership(apiaryId: string, userId: string) {
    const apiary = await this.prisma.apiary.findFirst({
      where: { id: apiaryId, user_id: userId },
    });
    if (!apiary) throw new ForbiddenException('Apiary not found or not owned');
    return apiary;
  }

  async findAll(userId: string) {
    return this.prisma.hive.findMany({
      where: { apiary: { user_id: userId } },
      include: { apiary: { select: { name: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.verifyOwnership(id, userId);
  }

  async findByCode(code: string, userId: string) {
    const hive = await this.prisma.hive.findFirst({
      where: { code, apiary: { user_id: userId } },
      include: { apiary: { select: { name: true } } },
    });
    if (!hive) throw new NotFoundException('Hive not found');
    return hive;
  }

  async create(dto: CreateHiveDto, userId: string) {
    await this.verifyApiaryOwnership(dto.apiary_id, userId);

    const hive = await this.prisma.hive.create({
      data: {
        ...dto,
        installed_at: dto.installed_at ? new Date(dto.installed_at) : undefined,
      },
      include: { apiary: { select: { name: true } } },
    });

    await this.updateHiveCount(dto.apiary_id);
    return hive;
  }

  async update(id: string, dto: UpdateHiveDto, userId: string) {
    await this.verifyOwnership(id, userId);

    return this.prisma.hive.update({
      where: { id },
      data: {
        ...dto,
        installed_at: dto.installed_at ? new Date(dto.installed_at) : undefined,
      },
      include: { apiary: { select: { name: true } } },
    });
  }

  async remove(id: string, userId: string) {
    const hive = await this.verifyOwnership(id, userId);
    await this.prisma.hive.delete({ where: { id } });
    await this.updateHiveCount(hive.apiary_id);
    return hive;
  }

  private async updateHiveCount(apiaryId: string) {
    const count = await this.prisma.hive.count({ where: { apiary_id: apiaryId } });
    await this.prisma.apiary.update({
      where: { id: apiaryId },
      data: { hive_count: count },
    });
  }
}
