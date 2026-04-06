import type { User, Apiary, Hive, Inspection, Production, Task, DashboardStats } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error de red' }));
    throw new Error(error.message || `Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string }) =>
    request<{ access_token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<{ access_token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request<User>('/auth/me'),

  // Apiaries
  getApiaries: () => request<Apiary[]>('/apiaries'),
  getApiary: (id: string) => request<Apiary>(`/apiaries/${id}`),
  createApiary: (data: Record<string, unknown>) => request<Apiary>('/apiaries', { method: 'POST', body: JSON.stringify(data) }),
  updateApiary: (id: string, data: Record<string, unknown>) => request<Apiary>(`/apiaries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteApiary: (id: string) => request<Apiary>(`/apiaries/${id}`, { method: 'DELETE' }),
  getApiaryHives: (id: string) => request<Hive[]>(`/apiaries/${id}/hives`),

  // Hives
  getHives: () => request<Hive[]>('/hives'),
  getHive: (id: string) => request<Hive>(`/hives/${id}`),
  getHiveByCode: (code: string) => request<Hive>(`/hives/code/${code}`),
  createHive: (data: Record<string, unknown>) => request<Hive>('/hives', { method: 'POST', body: JSON.stringify(data) }),
  updateHive: (id: string, data: Record<string, unknown>) => request<Hive>(`/hives/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHive: (id: string) => request<Hive>(`/hives/${id}`, { method: 'DELETE' }),

  // Inspections
  getInspections: () => request<Inspection[]>('/inspections'),
  getInspection: (id: string) => request<Inspection>(`/inspections/${id}`),
  getHiveInspections: (hiveId: string) => request<Inspection[]>(`/hives/${hiveId}/inspections`),
  createInspection: (data: Record<string, unknown>) => request<Inspection>('/inspections', { method: 'POST', body: JSON.stringify(data) }),
  updateInspection: (id: string, data: Record<string, unknown>) => request<Inspection>(`/inspections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInspection: (id: string) => request<Inspection>(`/inspections/${id}`, { method: 'DELETE' }),

  // Production
  getProductions: () => request<Production[]>('/productions'),
  getProductionStats: () => request<Record<string, unknown>>('/productions/stats'),
  getHiveProductions: (hiveId: string) => request<Production[]>(`/hives/${hiveId}/productions`),
  createProduction: (data: Record<string, unknown>) => request<Production>('/productions', { method: 'POST', body: JSON.stringify(data) }),
  updateProduction: (id: string, data: Record<string, unknown>) => request<Production>(`/productions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduction: (id: string) => request<Production>(`/productions/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: () => request<Task[]>('/tasks'),
  getTask: (id: string) => request<Task>(`/tasks/${id}`),
  createTask: (data: Record<string, unknown>) => request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: string, data: Record<string, unknown>) => request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleTask: (id: string) => request<Task>(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  deleteTask: (id: string) => request<Task>(`/tasks/${id}`, { method: 'DELETE' }),

  // Dashboard
  getDashboardStats: () => request<DashboardStats>('/dashboard/stats'),
};
