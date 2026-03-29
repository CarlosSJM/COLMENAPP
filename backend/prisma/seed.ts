import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // User
  const password_hash = await bcrypt.hash('123456', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@colmenapp.com' },
    update: {},
    create: {
      name: 'Apicultor Demo',
      email: 'demo@colmenapp.com',
      password_hash,
    },
  });

  // Apiaries
  const apiaryNorte = await prisma.apiary.create({
    data: {
      user_id: user.id, name: 'Apiario Norte',
      location: 'Finca El Roble, Km 23 Ruta 5',
      latitude: -34.6037, longitude: -58.3816,
      notes: 'Apiario principal, cerca del arroyo.',
      hive_count: 3,
    },
  });
  const apiarySur = await prisma.apiary.create({
    data: {
      user_id: user.id, name: 'Apiario Sur',
      location: 'Campo Los Aromos, Parcela 12',
      latitude: -34.7037, longitude: -58.4816,
      notes: 'Zona con mucha flora silvestre.',
      hive_count: 2,
    },
  });
  const apiaryEste = await prisma.apiary.create({
    data: {
      user_id: user.id, name: 'Apiario Este',
      location: 'Granja Santa María',
      notes: 'Cerca de cultivos de girasol.',
      hive_count: 1,
    },
  });

  // Hives
  const hives = await Promise.all([
    prisma.hive.create({ data: { apiary_id: apiaryNorte.id, code: 'AN-001', name: 'Colmena Alfa', status: 'active', queen_origin: 'purchased', population: 45000, frames: 10, installed_at: new Date('2024-08-15'), last_inspection: new Date('2026-02-18'), notes: 'Producción excelente' } }),
    prisma.hive.create({ data: { apiary_id: apiaryNorte.id, code: 'AN-002', name: 'Colmena Beta', status: 'active', queen_origin: 'raised', population: 32000, frames: 8, installed_at: new Date('2024-06-20'), last_inspection: new Date('2026-02-15'), notes: 'Buen desarrollo general' } }),
    prisma.hive.create({ data: { apiary_id: apiaryNorte.id, code: 'AN-003', name: 'Colmena Zeta', status: 'inactive', queen_origin: 'raised', population: 5000, frames: 4, installed_at: new Date('2024-09-01'), last_inspection: new Date('2026-02-10'), notes: 'Esperando reactivación' } }),
    prisma.hive.create({ data: { apiary_id: apiarySur.id, code: 'AS-001', name: 'Colmena Gamma', status: 'active', queen_origin: 'swarm', population: 38000, frames: 9, installed_at: new Date('2025-03-10'), last_inspection: new Date('2026-02-17'), notes: 'Colmena joven' } }),
    prisma.hive.create({ data: { apiary_id: apiarySur.id, code: 'AS-002', name: 'Colmena Delta', status: 'quarantine', queen_origin: 'unknown', population: 18000, frames: 6, installed_at: new Date('2024-05-05'), last_inspection: new Date('2026-02-19'), notes: 'Signos de varroa' } }),
    prisma.hive.create({ data: { apiary_id: apiaryEste.id, code: 'AE-001', name: 'Colmena Épsilon', status: 'active', queen_origin: 'purchased', population: 41000, frames: 10, installed_at: new Date('2025-01-12'), last_inspection: new Date('2026-02-16'), notes: 'Excelente patrón de cría' } }),
  ]);

  // Inspections
  await Promise.all([
    prisma.inspection.create({ data: { hive_id: hives[0].id, date: new Date('2026-02-18'), queen_seen: true, brood_pattern: 'excellent', temperament: 'calm', weight: 42.5, varroa_count: 2, treatment_applied: false, activity_level: 'high', health_status: 'healthy', diseases: [], notes: 'Todo en perfectas condiciones' } }),
    prisma.inspection.create({ data: { hive_id: hives[4].id, date: new Date('2026-02-19'), queen_seen: false, brood_pattern: 'poor', temperament: 'aggressive', weight: 28.3, varroa_count: 15, treatment_applied: true, treatment_product: 'Ácido Oxálico', treatment_dose: '5ml por cuadro', activity_level: 'low', health_status: 'critical', diseases: ['Varroa'], notes: 'Tratamiento aplicado' } }),
    prisma.inspection.create({ data: { hive_id: hives[3].id, date: new Date('2026-02-17'), queen_seen: true, brood_pattern: 'good', temperament: 'calm', weight: 38.7, varroa_count: 3, treatment_applied: false, activity_level: 'medium', health_status: 'healthy', diseases: [], notes: 'Buenas reservas de miel' } }),
    prisma.inspection.create({ data: { hive_id: hives[1].id, date: new Date('2026-02-15'), queen_seen: true, brood_pattern: 'fair', temperament: 'normal', weight: 35.2, varroa_count: 5, treatment_applied: false, activity_level: 'medium', health_status: 'healthy', diseases: [], notes: 'Desarrollo normal' } }),
    prisma.inspection.create({ data: { hive_id: hives[5].id, date: new Date('2026-02-16'), queen_seen: true, brood_pattern: 'excellent', temperament: 'calm', weight: 40.1, varroa_count: 1, treatment_applied: false, activity_level: 'high', health_status: 'healthy', diseases: [], notes: 'Perfectas condiciones' } }),
  ]);

  // Production
  await Promise.all([
    prisma.production.create({ data: { hive_id: hives[0].id, date: new Date('2026-02-10'), honey_kg: 15.5, wax_kg: 1.2, propolis_g: 150 } }),
    prisma.production.create({ data: { hive_id: hives[3].id, date: new Date('2026-02-08'), honey_kg: 12.8, wax_kg: 1.0, propolis_g: 120 } }),
    prisma.production.create({ data: { hive_id: hives[5].id, date: new Date('2026-02-12'), honey_kg: 14.2, wax_kg: 1.1, propolis_g: 140 } }),
    prisma.production.create({ data: { hive_id: hives[1].id, date: new Date('2026-01-28'), honey_kg: 9.5, wax_kg: 0.8, propolis_g: 95 } }),
    prisma.production.create({ data: { hive_id: hives[0].id, date: new Date('2026-01-15'), honey_kg: 16.0, wax_kg: 1.3, propolis_g: 160 } }),
  ]);

  // Tasks (now require user_id)
  await Promise.all([
    prisma.task.create({ data: { user_id: user.id, hive_id: hives[4].id, title: 'Tratamiento contra varroa', description: 'Aplicar ácido oxálico en Colmena Delta', due_date: new Date('2026-02-21'), priority: 'high' } }),
    prisma.task.create({ data: { user_id: user.id, title: 'Inspección rutinaria Apiario Norte', description: 'Inspección completa de todas las colmenas', due_date: new Date('2026-02-25'), priority: 'medium' } }),
    prisma.task.create({ data: { user_id: user.id, title: 'Revisión de reservas', description: 'Verificar reservas antes de floración', due_date: new Date('2026-02-27'), priority: 'medium' } }),
    prisma.task.create({ data: { user_id: user.id, title: 'Limpieza de apiario', description: 'Limpiar y desinfectar Apiario Sur', due_date: new Date('2026-02-23'), priority: 'low' } }),
    prisma.task.create({ data: { user_id: user.id, hive_id: hives[2].id, title: 'Reactivar Colmena Zeta', description: 'Evaluar condiciones para reactivación', due_date: new Date('2026-03-05'), priority: 'medium' } }),
  ]);

  console.log('Seed completed. Demo user: demo@colmenapp.com / 123456');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
