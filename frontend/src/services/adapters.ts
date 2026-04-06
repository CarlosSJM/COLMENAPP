// Adapta las respuestas del backend al formato que usan los componentes Figma
// Backend: { apiary: { name: "..." } } → Figma: { apiary_name: "..." }

import type { Hive, Inspection, Production, Task } from '../types';

type HiveWithApiaryName = Hive & { apiary_name: string };
type InspectionWithHiveName = Inspection & { hive_name: string };
type ProductionWithHiveName = Production & { hive_name: string };
type TaskWithHiveName = Task & { hive_name?: string };

export function adaptHive(hive: Hive): HiveWithApiaryName {
  return {
    ...hive,
    apiary_name: hive.apiary?.name || '',
  };
}

export function adaptHives(hives: Hive[]): HiveWithApiaryName[] {
  return hives.map(adaptHive);
}

export function adaptInspection(inspection: Inspection): InspectionWithHiveName {
  return {
    ...inspection,
    hive_name: inspection.hive?.name || '',
  };
}

export function adaptInspections(inspections: Inspection[]): InspectionWithHiveName[] {
  return inspections.map(adaptInspection);
}

export function adaptProduction(production: Production): ProductionWithHiveName {
  return {
    ...production,
    hive_name: production.hive?.name || '',
  };
}

export function adaptProductions(productions: Production[]): ProductionWithHiveName[] {
  return productions.map(adaptProduction);
}

export function adaptTask(task: Task): TaskWithHiveName {
  return {
    ...task,
    hive_name: task.hive?.name || undefined,
  };
}

export function adaptTasks(tasks: Task[]): TaskWithHiveName[] {
  return tasks.map(adaptTask);
}
