export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Apiary {
  id: string;
  user_id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  hive_count: number;
  created_at: string;
  updated_at: string;
}

export interface Hive {
  id: string;
  apiary_id: string;
  apiary: { name: string };
  code: string;
  name: string;
  status: 'active' | 'inactive' | 'quarantine' | 'lost';
  queen_origin: 'purchased' | 'raised' | 'swarm' | 'unknown';
  population?: number;
  frames?: number;
  installed_at?: string;
  notes?: string;
  last_inspection?: string;
  created_at: string;
  updated_at: string;
}

export interface Inspection {
  id: string;
  hive_id: string;
  hive: { name: string };
  date: string;
  queen_seen: boolean;
  brood_pattern?: 'excellent' | 'good' | 'fair' | 'poor';
  temperament?: 'calm' | 'normal' | 'aggressive';
  weight?: number;
  varroa_count?: number;
  activity_level?: 'low' | 'medium' | 'high';
  health_status: 'healthy' | 'weak' | 'sick' | 'critical';
  diseases: string[];
  treatment_applied: boolean;
  treatment_product?: string;
  treatment_dose?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Production {
  id: string;
  hive_id: string;
  hive: { name: string };
  date: string;
  honey_kg: number;
  wax_kg: number;
  propolis_g: number;
  notes?: string;
  created_at: string;
}

export interface Task {
  id: string;
  hive_id?: string;
  hive?: { name: string } | null;
  title: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_hives: number;
  active_hives: number;
  inactive_hives: number;
  quarantine_hives: number;
  lost_hives: number;
  needs_attention: number;
  needs_inspection: number;
  pending_tasks: number;
  high_priority_tasks: number;
  hives_by_apiary: { name: string; count: number }[];
  recent_inspections: Inspection[];
}
