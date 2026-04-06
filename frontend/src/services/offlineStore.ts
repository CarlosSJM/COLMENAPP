import { db } from './db';
import { api } from './api';
import { enqueue } from './syncQueue';
import { v4Fallback } from './uuid';

// Cache API responses in IndexedDB after successful fetch
async function cacheAndReturn<T extends { id: string }>(
  table: 'apiaries' | 'hives' | 'inspections' | 'productions' | 'tasks',
  fetchFn: () => Promise<T[]>,
): Promise<T[]> {
  try {
    const data = await fetchFn();
    // Replace entire local cache for this table with fresh server data
    await db.table(table).clear();
    if (data.length > 0) {
      await db.table(table).bulkPut(data);
    }
    return data;
  } catch {
    // Offline: serve from IndexedDB
    const cached = await db.table(table).toArray();
    return cached as T[];
  }
}

// Offline-aware API - components use this instead of api directly
export const offlineApi = {
  // ---- Apiaries ----
  getApiaries: () => cacheAndReturn('apiaries', api.getApiaries),
  createApiary: async (data: Record<string, unknown>) => {
    if (navigator.onLine) {
      const result = await api.createApiary(data);
      await db.apiaries.put(result);
      return { result, offline: false };
    }
    const tempId = v4Fallback();
    const temp = { ...data, id: tempId, hive_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    await db.apiaries.put(temp as any);
    await enqueue('apiaries', 'create', tempId, data);
    return { result: temp, offline: true };
  },
  updateApiary: async (id: string, data: Record<string, unknown>) => {
    if (navigator.onLine) {
      const result = await api.updateApiary(id, data);
      await db.apiaries.put(result);
      return { result, offline: false };
    }
    await db.apiaries.update(id, data as any);
    await enqueue('apiaries', 'update', id, data);
    return { result: { ...data, id }, offline: true };
  },
  deleteApiary: async (id: string) => {
    if (navigator.onLine) {
      await api.deleteApiary(id);
      await db.apiaries.delete(id);
      return { offline: false };
    }
    await db.apiaries.delete(id);
    await enqueue('apiaries', 'delete', id);
    return { offline: true };
  },

  // ---- Hives ----
  getHives: () => cacheAndReturn('hives', api.getHives),
  getApiaryHives: async (apiaryId: string) => {
    try {
      const data = await api.getApiaryHives(apiaryId);
      for (const hive of data) await db.hives.put(hive);
      return data;
    } catch {
      return db.hives.where('apiary_id').equals(apiaryId).toArray();
    }
  },
  createHive: async (data: Record<string, unknown>) => {
    if (navigator.onLine) {
      const result = await api.createHive(data);
      await db.hives.put(result);
      return { result, offline: false };
    }
    const tempId = v4Fallback();
    const temp = { ...data, id: tempId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    await db.hives.put(temp as any);
    await enqueue('hives', 'create', tempId, data);
    return { result: temp, offline: true };
  },
  updateHive: async (id: string, data: Record<string, unknown>) => {
    if (navigator.onLine) {
      const result = await api.updateHive(id, data);
      await db.hives.put(result);
      return { result, offline: false };
    }
    await db.hives.update(id, data as any);
    await enqueue('hives', 'update', id, data);
    return { result: { ...data, id }, offline: true };
  },
  deleteHive: async (id: string) => {
    if (navigator.onLine) {
      await api.deleteHive(id);
      await db.hives.delete(id);
      return { offline: false };
    }
    await db.hives.delete(id);
    await enqueue('hives', 'delete', id);
    return { offline: true };
  },

  // ---- Inspections ----
  getInspections: () => cacheAndReturn('inspections', api.getInspections),
  createInspection: async (data: Record<string, unknown>) => {
    if (navigator.onLine) {
      const result = await api.createInspection(data);
      await db.inspections.put(result);
      return { result, offline: false };
    }
    const tempId = v4Fallback();
    const temp = { ...data, id: tempId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    await db.inspections.put(temp as any);
    await enqueue('inspections', 'create', tempId, data);
    return { result: temp, offline: true };
  },
  updateInspection: async (id: string, data: Record<string, unknown>) => {
    if (navigator.onLine) {
      const result = await api.updateInspection(id, data);
      await db.inspections.put(result);
      return { result, offline: false };
    }
    await db.inspections.update(id, data as any);
    await enqueue('inspections', 'update', id, data);
    return { result: { ...data, id }, offline: true };
  },
  deleteInspection: async (id: string) => {
    if (navigator.onLine) {
      await api.deleteInspection(id);
      await db.inspections.delete(id);
      return { offline: false };
    }
    await db.inspections.delete(id);
    await enqueue('inspections', 'delete', id);
    return { offline: true };
  },

  // ---- Productions ----
  getProductions: () => cacheAndReturn('productions', api.getProductions),
  createProduction: async (data: Record<string, unknown>) => {
    if (navigator.onLine) {
      const result = await api.createProduction(data);
      await db.productions.put(result);
      return { result, offline: false };
    }
    const tempId = v4Fallback();
    const temp = { ...data, id: tempId, created_at: new Date().toISOString() };
    await db.productions.put(temp as any);
    await enqueue('productions', 'create', tempId, data);
    return { result: temp, offline: true };
  },
  updateProduction: async (id: string, data: Record<string, unknown>) => {
    if (navigator.onLine) {
      const result = await api.updateProduction(id, data);
      await db.productions.put(result);
      return { result, offline: false };
    }
    await db.productions.update(id, data as any);
    await enqueue('productions', 'update', id, data);
    return { result: { ...data, id }, offline: true };
  },
  deleteProduction: async (id: string) => {
    if (navigator.onLine) {
      await api.deleteProduction(id);
      await db.productions.delete(id);
      return { offline: false };
    }
    await db.productions.delete(id);
    await enqueue('productions', 'delete', id);
    return { offline: true };
  },

  // ---- Tasks ----
  getTasks: () => cacheAndReturn('tasks', api.getTasks),
  createTask: async (data: Record<string, unknown>) => {
    if (navigator.onLine) {
      const result = await api.createTask(data);
      await db.tasks.put(result);
      return { result, offline: false };
    }
    const tempId = v4Fallback();
    const temp = { ...data, id: tempId, completed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    await db.tasks.put(temp as any);
    await enqueue('tasks', 'create', tempId, data);
    return { result: temp, offline: true };
  },
  updateTask: async (id: string, data: Record<string, unknown>) => {
    if (navigator.onLine) {
      const result = await api.updateTask(id, data);
      await db.tasks.put(result);
      return { result, offline: false };
    }
    await db.tasks.update(id, data as any);
    await enqueue('tasks', 'update', id, data);
    return { result: { ...data, id }, offline: true };
  },
  toggleTask: async (id: string) => {
    if (navigator.onLine) {
      const result = await api.toggleTask(id);
      await db.tasks.put(result);
      return { result, offline: false };
    }
    const task = await db.tasks.get(id);
    if (task) await db.tasks.update(id, { completed: !task.completed });
    await enqueue('tasks', 'toggle', id);
    return { result: task ? { ...task, completed: !task.completed } : null, offline: true };
  },
  deleteTask: async (id: string) => {
    if (navigator.onLine) {
      await api.deleteTask(id);
      await db.tasks.delete(id);
      return { offline: false };
    }
    await db.tasks.delete(id);
    await enqueue('tasks', 'delete', id);
    return { offline: true };
  },

  // ---- Dashboard (read-only, no offline mutations) ----
  getDashboardStats: async () => {
    try {
      return await api.getDashboardStats();
    } catch {
      // Basic offline stats from cached data
      const hives = await db.hives.toArray();
      const tasks = await db.tasks.toArray();
      return {
        total_hives: hives.length,
        active_hives: hives.filter(h => h.status === 'active').length,
        inactive_hives: hives.filter(h => h.status === 'inactive').length,
        quarantine_hives: hives.filter(h => h.status === 'quarantine').length,
        lost_hives: hives.filter(h => h.status === 'lost').length,
        needs_attention: 0,
        needs_inspection: 0,
        pending_tasks: tasks.filter(t => !t.completed).length,
        high_priority_tasks: tasks.filter(t => t.priority === 'high' && !t.completed).length,
        hives_by_apiary: [],
        recent_inspections: [],
      };
    }
  },
};
