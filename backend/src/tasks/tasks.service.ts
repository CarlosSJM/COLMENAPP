import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private ownershipWhere(userId: string) {
    return {
      OR: [
        { hive: { apiary: { user_id: userId } } },
        { hive_id: null, },
      ],
    } as any;
  }

  async findAll(userId: string) {
    // Tasks linked to user's hives + tasks without hive (general tasks)
    // For general tasks, we need a user_id check through apiaries
    return this.prisma.task.findMany({
      where: { hive: { apiary: { user_id: userId } } },
      include: { hive: { select: { name: true } } },
      orderBy: [{ completed: 'asc' }, { due_date: 'asc' }],
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, hive: { apiary: { user_id: userId } } },
      include: { hive: { select: { name: true } } },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(dto: CreateTaskDto, userId: string) {
    if (dto.hive_id) {
      const hive = await this.prisma.hive.findFirst({
        where: { id: dto.hive_id, apiary: { user_id: userId } },
      });
      if (!hive) throw new NotFoundException('Hive not found');
    }

    return this.prisma.task.create({
      data: { ...dto, due_date: new Date(dto.due_date) },
      include: { hive: { select: { name: true } } },
    });
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.task.update({
      where: { id },
      data: { ...dto, due_date: dto.due_date ? new Date(dto.due_date) : undefined },
      include: { hive: { select: { name: true } } },
    });
  }

  async toggle(id: string, userId: string) {
    const task = await this.findOne(id, userId);
    return this.prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
      include: { hive: { select: { name: true } } },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.task.delete({ where: { id } });
  }
}
