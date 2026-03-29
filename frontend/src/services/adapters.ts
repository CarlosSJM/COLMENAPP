// Adapta las respuestas del backend al formato que usan los componentes Figma
// Backend: { apiary: { name: "..." } } → Figma: { apiary_name: "..." }

export function adaptHive(hive: any) {
  return {
    ...hive,
    apiary_name: hive.apiary?.name || '',
  };
}

export function adaptHives(hives: any[]) {
  return hives.map(adaptHive);
}

export function adaptInspection(inspection: any) {
  return {
    ...inspection,
    hive_name: inspection.hive?.name || '',
  };
}

export function adaptInspections(inspections: any[]) {
  return inspections.map(adaptInspection);
}

export function adaptProduction(production: any) {
  return {
    ...production,
    hive_name: production.hive?.name || '',
  };
}

export function adaptProductions(productions: any[]) {
  return productions.map(adaptProduction);
}

export function adaptTask(task: any) {
  return {
    ...task,
    hive_name: task.hive?.name || undefined,
  };
}

export function adaptTasks(tasks: any[]) {
  return tasks.map(adaptTask);
}
