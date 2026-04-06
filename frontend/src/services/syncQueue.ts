import { db, type SyncQueueEntry } from './db';
import { api } from './api';

const MAX_RETRIES = 3;

// Enqueue an offline mutation
export async function enqueue(
  entity: SyncQueueEntry['entity'],
  operation: SyncQueueEntry['operation'],
  entityId?: string,
  payload?: Record<string, unknown>,
): Promise<void> {
  await db.syncQueue.add({
    entity,
    operation,
    entityId,
    payload,
    timestamp: Date.now(),
    status: 'pending',
    retries: 0,
  });
}

// Count pending operations
export async function getPendingCount(): Promise<number> {
  return db.syncQueue.where('status').anyOf('pending', 'processing').count();
}

// Process all pending operations in FIFO order
export async function processQueue(): Promise<{ success: number; failed: number }> {
  const pending = await db.syncQueue
    .where('status')
    .anyOf('pending', 'failed')
    .and((entry) => entry.retries < MAX_RETRIES)
    .sortBy('timestamp');

  let success = 0;
  let failed = 0;

  for (const entry of pending) {
    try {
      await db.syncQueue.update(entry.id!, { status: 'processing' });
      await executeOperation(entry);
      await db.syncQueue.delete(entry.id!);
      success++;
    } catch (err) {
      const retries = entry.retries + 1;
      await db.syncQueue.update(entry.id!, {
        status: retries >= MAX_RETRIES ? 'failed' : 'pending',
        retries,
        error: err instanceof Error ? err.message : 'Error desconocido',
      });
      failed++;
    }
  }

  return { success, failed };
}

// Execute a single queued operation against the API
async function executeOperation(entry: SyncQueueEntry): Promise<void> {
  const { entity, operation, entityId, payload } = entry;

  const endpoints: Record<string, Record<string, () => Promise<unknown>>> = {
    apiaries: {
      create: () => api.createApiary(payload),
      update: () => api.updateApiary(entityId!, payload),
      delete: () => api.deleteApiary(entityId!),
    },
    hives: {
      create: () => api.createHive(payload),
      update: () => api.updateHive(entityId!, payload),
      delete: () => api.deleteHive(entityId!),
    },
    inspections: {
      create: () => api.createInspection(payload),
      update: () => api.updateInspection(entityId!, payload),
      delete: () => api.deleteInspection(entityId!),
    },
    productions: {
      create: () => api.createProduction(payload),
      update: () => api.updateProduction(entityId!, payload),
      delete: () => api.deleteProduction(entityId!),
    },
    tasks: {
      create: () => api.createTask(payload),
      update: () => api.updateTask(entityId!, payload),
      delete: () => api.deleteTask(entityId!),
      toggle: () => api.toggleTask(entityId!),
    },
  };

  const fn = endpoints[entity]?.[operation];
  if (!fn) throw new Error(`Unknown operation: ${entity}.${operation}`);
  await fn();
}

// Clear all failed entries
export async function clearFailed(): Promise<void> {
  await db.syncQueue.where('status').equals('failed').delete();
}
