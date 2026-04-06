import Dexie, { type EntityTable } from 'dexie';
import type { Apiary, Hive, Inspection, Production, Task } from '../types';

// Sync queue entry - tracks offline mutations to replay when online
export interface SyncQueueEntry {
  id?: number;
  entity: 'apiaries' | 'hives' | 'inspections' | 'productions' | 'tasks';
  operation: 'create' | 'update' | 'delete' | 'toggle';
  entityId?: string;
  payload?: Record<string, unknown>;
  timestamp: number;
  status: 'pending' | 'processing' | 'failed';
  retries: number;
  error?: string;
}

const db = new Dexie('ColmenappDB') as Dexie & {
  apiaries: EntityTable<Apiary, 'id'>;
  hives: EntityTable<Hive, 'id'>;
  inspections: EntityTable<Inspection, 'id'>;
  productions: EntityTable<Production, 'id'>;
  tasks: EntityTable<Task, 'id'>;
  syncQueue: EntityTable<SyncQueueEntry, 'id'>;
};

db.version(1).stores({
  apiaries: 'id, user_id',
  hives: 'id, apiary_id',
  inspections: 'id, hive_id',
  productions: 'id, hive_id',
  tasks: 'id, hive_id',
  syncQueue: '++id, entity, status, timestamp',
});

export { db };
