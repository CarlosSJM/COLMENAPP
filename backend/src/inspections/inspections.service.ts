import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';

@Injectable()
export class InspectionsService {
  constructor(private prisma: PrismaService) {}

  private async verifyOwnership(inspectionId: string, userId: string) {
    const inspection = await this.prisma.inspection.findFirst({
      where: { id: inspectionId, hive: { apiary: { user_id: userId } } },
      include: { hive: { select: { name: true } } },
    });
    if (!inspection) throw new NotFoundException('Inspection not found');
    return inspection;
  }

  private async verifyHiveOwnership(hiveId: string, userId: string) {
    const hive = await this.prisma.hive.findFirst({
      where: { id: hiveId, apiary: { user_id: userId } },
    });
    if (!hive) throw new NotFoundException('Hive not found');
    return hive;
  }

  async findAll(userId: string) {
    return this.prisma.inspection.findMany({
      where: { hive: { apiary: { user_id: userId } } },
      include: { hive: { select: { name: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.verifyOwnership(id, userId);
  }

  async findByHive(hiveId: string, userId: string) {
    await this.verifyHiveOwnership(hiveId, userId);
    return this.prisma.inspection.findMany({
      where: { hive_id: hiveId },
      include: { hive: { select: { name: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async create(dto: CreateInspectionDto, userId: string) {
    await this.verifyHiveOwnership(dto.hive_id, userId);

    const inspection = await this.prisma.inspection.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
      include: { hive: { select: { name: true } } },
    });

    // Update last_inspection on hive
    await this.prisma.hive.update({
      where: { id: dto.hive_id },
      data: { last_inspection: new Date(dto.date) },
    });

    return inspection;
  }

  async update(id: string, dto: UpdateInspectionDto, userId: string) {
    await this.verifyOwnership(id, userId);

    return this.prisma.inspection.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: { hive: { select: { name: true } } },
    });
  }

  async remove(id: string, userId: string) {
    const inspection = await this.verifyOwnership(id, userId);
    return this.prisma.inspection.delete({ where: { id } });
  }
}
