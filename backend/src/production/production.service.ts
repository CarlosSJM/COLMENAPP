import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';

@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) {}

  private async verifyOwnership(productionId: string, userId: string) {
    const production = await this.prisma.production.findFirst({
      where: { id: productionId, hive: { apiary: { user_id: userId } } },
      include: { hive: { select: { name: true } } },
    });
    if (!production) throw new NotFoundException('Production record not found');
    return production;
  }

  async findAll(userId: string) {
    return this.prisma.production.findMany({
      where: { hive: { apiary: { user_id: userId } } },
      include: { hive: { select: { name: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.verifyOwnership(id, userId);
  }

  async findByHive(hiveId: string, userId: string) {
    return this.prisma.production.findMany({
      where: { hive_id: hiveId, hive: { apiary: { user_id: userId } } },
      include: { hive: { select: { name: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async stats(userId: string) {
    const productions = await this.prisma.production.findMany({
      where: { hive: { apiary: { user_id: userId } } },
    });

    const totalHoney = productions.reduce((sum, p) => sum + p.honey_kg, 0);
    const totalWax = productions.reduce((sum, p) => sum + p.wax_kg, 0);
    const totalPropolis = productions.reduce((sum, p) => sum + p.propolis_g, 0);
    const count = productions.length;

    return {
      total_honey_kg: totalHoney,
      total_wax_kg: totalWax,
      total_propolis_g: totalPropolis,
      count,
      avg_honey_kg: count ? totalHoney / count : 0,
      avg_wax_kg: count ? totalWax / count : 0,
      avg_propolis_g: count ? totalPropolis / count : 0,
    };
  }

  async create(dto: CreateProductionDto, userId: string) {
    const hive = await this.prisma.hive.findFirst({
      where: { id: dto.hive_id, apiary: { user_id: userId } },
    });
    if (!hive) throw new NotFoundException('Hive not found');

    return this.prisma.production.create({
      data: { ...dto, date: new Date(dto.date) },
      include: { hive: { select: { name: true } } },
    });
  }

  async update(id: string, dto: UpdateProductionDto, userId: string) {
    await this.verifyOwnership(id, userId);
    return this.prisma.production.update({
      where: { id },
      data: { ...dto, date: dto.date ? new Date(dto.date) : undefined },
      include: { hive: { select: { name: true } } },
    });
  }

  async remove(id: string, userId: string) {
    await this.verifyOwnership(id, userId);
    return this.prisma.production.delete({ where: { id } });
  }
}
