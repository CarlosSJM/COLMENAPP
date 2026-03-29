// Mapeo centralizado enums BD (inglés) → UI (español)

export const hiveStatusLabels: Record<string, string> = {
  active: 'Activa',
  inactive: 'Inactiva',
  quarantine: 'Cuarentena',
  lost: 'Perdida',
};

export const queenOriginLabels: Record<string, string> = {
  purchased: 'Comprada',
  raised: 'Criada',
  swarm: 'Enjambre',
  unknown: 'Desconocida',
};

export const broodPatternLabels: Record<string, string> = {
  excellent: 'Excelente',
  good: 'Bueno',
  fair: 'Regular',
  poor: 'Pobre',
};

export const temperamentLabels: Record<string, string> = {
  calm: 'Calmada',
  normal: 'Normal',
  aggressive: 'Agresiva',
};

export const activityLevelLabels: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export const healthStatusLabels: Record<string, string> = {
  healthy: 'Saludable',
  weak: 'Débil',
  sick: 'Enferma',
  critical: 'Crítica',
};

export const priorityLabels: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

// Colores por estado
export const hiveStatusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-300',
  inactive: 'bg-gray-100 text-gray-800 border-gray-300',
  quarantine: 'bg-orange-100 text-orange-800 border-orange-300',
  lost: 'bg-red-100 text-red-800 border-red-300',
};

export const broodPatternColors: Record<string, string> = {
  excellent: 'bg-green-100 text-green-800 border-green-300',
  good: 'bg-blue-100 text-blue-800 border-blue-300',
  fair: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  poor: 'bg-red-100 text-red-800 border-red-300',
};

export const healthStatusColors: Record<string, string> = {
  healthy: 'bg-green-100 text-green-800 border-green-300',
  weak: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  sick: 'bg-orange-100 text-orange-800 border-orange-300',
  critical: 'bg-red-100 text-red-800 border-red-300',
};

export const priorityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-red-100 text-red-800 border-red-300',
};
