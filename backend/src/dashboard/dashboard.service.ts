import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const hives = await this.prisma.hive.findMany({
      where: { apiary: { user_id: userId } },
      select: { id: true, status: true, last_inspection: true, apiary_id: true },
    });

    const totalHives = hives.length;
    const activeHives = hives.filter((h) => h.status === 'active').length;
    const inactiveHives = hives.filter((h) => h.status === 'inactive').length;
    const quarantineHives = hives.filter((h) => h.status === 'quarantine').length;
    const lostHives = hives.filter((h) => h.status === 'lost').length;

    // Critical inspections
    const criticalInspections = await this.prisma.inspection.findMany({
      where: {
        health_status: 'critical',
        hive: { apiary: { user_id: userId } },
      },
      select: { hive_id: true },
    });
    const criticalHiveIds = new Set(criticalInspections.map((i) => i.hive_id));
    const quarantineHiveIds = new Set(
      hives.filter((h) => h.status === 'quarantine').map((h) => h.id),
    );
    const needsAttention = new Set([...criticalHiveIds, ...quarantineHiveIds]).size;

    // Needs inspection (no inspection in 15+ days)
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const needsInspection = hives.filter((h) => {
      if (!h.last_inspection) return true;
      return h.last_inspection < fifteenDaysAgo;
    }).length;

    // Pending tasks
    const pendingTasks = await this.prisma.task.count({
      where: { completed: false, hive: { apiary: { user_id: userId } } },
    });
    const highPriorityTasks = await this.prisma.task.count({
      where: {
        completed: false,
        priority: 'high',
        hive: { apiary: { user_id: userId } },
      },
    });

    // Hives by apiary
    const apiaries = await this.prisma.apiary.findMany({
      where: { user_id: userId },
      select: { name: true, hive_count: true },
    });
    const hivesByApiary = apiaries.map((a) => ({
      name: a.name,
      count: a.hive_count,
    }));

    // Recent inspections
    const recentInspections = await this.prisma.inspection.findMany({
      where: { hive: { apiary: { user_id: userId } } },
      include: { hive: { select: { name: true } } },
      orderBy: { date: 'desc' },
      take: 5,
    });

    return {
      total_hives: totalHives,
      active_hives: activeHives,
      inactive_hives: inactiveHives,
      quarantine_hives: quarantineHives,
      lost_hives: lostHives,
      needs_attention: needsAttention,
      needs_inspection: needsInspection,
      pending_tasks: pendingTasks,
      high_priority_tasks: highPriorityTasks,
      hives_by_apiary: hivesByApiary,
      recent_inspections: recentInspections,
    };
  }
}
