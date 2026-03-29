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
  me: () => request<any>('/auth/me'),

  // Apiaries
  getApiaries: () => request<any[]>('/apiaries'),
  getApiary: (id: string) => request<any>(`/apiaries/${id}`),
  createApiary: (data: any) => request<any>('/apiaries', { method: 'POST', body: JSON.stringify(data) }),
  updateApiary: (id: string, data: any) => request<any>(`/apiaries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteApiary: (id: string) => request<any>(`/apiaries/${id}`, { method: 'DELETE' }),
  getApiaryHives: (id: string) => request<any[]>(`/apiaries/${id}/hives`),

  // Hives
  getHives: () => request<any[]>('/hives'),
  getHive: (id: string) => request<any>(`/hives/${id}`),
  getHiveByCode: (code: string) => request<any>(`/hives/code/${code}`),
  createHive: (data: any) => request<any>('/hives', { method: 'POST', body: JSON.stringify(data) }),
  updateHive: (id: string, data: any) => request<any>(`/hives/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHive: (id: string) => request<any>(`/hives/${id}`, { method: 'DELETE' }),

  // Inspections
  getInspections: () => request<any[]>('/inspections'),
  getInspection: (id: string) => request<any>(`/inspections/${id}`),
  getHiveInspections: (hiveId: string) => request<any[]>(`/hives/${hiveId}/inspections`),
  createInspection: (data: any) => request<any>('/inspections', { method: 'POST', body: JSON.stringify(data) }),
  updateInspection: (id: string, data: any) => request<any>(`/inspections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInspection: (id: string) => request<any>(`/inspections/${id}`, { method: 'DELETE' }),

  // Production
  getProductions: () => request<any[]>('/productions'),
  getProductionStats: () => request<any>('/productions/stats'),
  getHiveProductions: (hiveId: string) => request<any[]>(`/hives/${hiveId}/productions`),
  createProduction: (data: any) => request<any>('/productions', { method: 'POST', body: JSON.stringify(data) }),
  updateProduction: (id: string, data: any) => request<any>(`/productions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduction: (id: string) => request<any>(`/productions/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: () => request<any[]>('/tasks'),
  getTask: (id: string) => request<any>(`/tasks/${id}`),
  createTask: (data: any) => request<any>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: string, data: any) => request<any>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleTask: (id: string) => request<any>(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  deleteTask: (id: string) => request<any>(`/tasks/${id}`, { method: 'DELETE' }),

  // Dashboard
  getDashboardStats: () => request<any>('/dashboard/stats'),
};
