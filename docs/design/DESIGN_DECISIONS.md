# Decisiones de Diseño - COLMENAPP

Este documento registra las decisiones tomadas al comparar el diseño de Figma con la documentación del MVP.

**Fecha de revisión**: 2026-02-23

---

## 1. Pantallas de Login/Registro

**Decisión**: AGREGAR

El diseño de Figma no incluía pantallas de autenticación. Se agregarán:
- Pantalla de Login
- Pantalla de Registro
- Pantalla de Recuperación de Contraseña

**Justificación**: Necesarias para el sistema de autenticación JWT definido en la documentación.

---

## 2. Gestión de Apiarios

**Decisión**: AGREGAR con navegación jerárquica (Opción B)

### Estructura de navegación aprobada:
```
Sidebar:
├── Dashboard
├── Apiarios (lista de apiarios)
│   └── [Al seleccionar] → Vista de Colmenas del apiario
├── Inspecciones (todas)
└── Tareas (todas)
```

### Campos del modelo Apiario:
- `id`: UUID
- `user_id`: UUID (FK al usuario propietario)
- `name`: string (requerido)
- `location`: string (dirección/descripción)
- `coordinates`: objeto opcional `{ lat: number, lng: number }`
- `notes`: string (opcional)
- `hive_count`: number (contador denormalizado de colmenas)
- `created_at`: timestamp
- `updated_at`: timestamp

**Justificación**: La documentación incluye Apiarios como nivel jerárquico superior. La opción B simplifica la navegación mostrando las colmenas dentro de cada apiario.

---

## 3. Pantalla de Colmenas (Hives)

**Decisión**: MODIFICAR combinando ambos modelos

### Campos finales del modelo Colmena:

| Campo | Origen | Notas |
|-------|--------|-------|
| `id` | Doc | UUID |
| `apiary_id` | Doc | FK al apiario padre |
| `apiary_name` | Figma | Denormalizado para UI |
| `code` | Doc | Código único (ej: "AN-001") |
| `name` | Ambos | Nombre descriptivo |
| `status` | Doc | `active`, `inactive`, `quarantine`, `lost` |
| `queen_origin` | Doc | `purchased`, `raised`, `swarm`, `unknown` |
| `population` | Figma | Estimación numérica |
| `frames` | Figma | Número de cuadros |
| `installed_at` | Doc | Fecha de instalación |
| `notes` | Ambos | Observaciones generales |
| `last_inspection` | Ambos | Fecha última inspección |
| `created_at` | Doc | Timestamp |
| `updated_at` | Doc | Timestamp |

### Cambios respecto a Figma:
- **Eliminado**: `location` (ahora a nivel de Apiario)
- **Eliminado**: `queen_age` (reemplazado por `queen_origin`)
- **Cambiado**: `status` de `healthy/warning/critical` a `active/inactive/quarantine/lost`

**Justificación**: El estado healthy/warning/critical es derivado de las inspecciones, no un campo estático. Los estados active/inactive/quarantine/lost reflejan el estado operativo real de la colmena.

---

## 4. Pantalla de Inspecciones

**Decisión**: COMBINAR ambos modelos

### Campos finales del modelo Inspección:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `hive_id` | UUID | FK a colmena |
| `hive_name` | string | Denormalizado para UI |
| `date` | date | Fecha de inspección |
| `queen_seen` | boolean | Si se vio la reina |
| `brood_pattern` | enum | `excellent`, `good`, `fair`, `poor` |
| `temperament` | enum | `calm`, `normal`, `aggressive` |
| `weight` | number | Peso en kg (opcional) |
| `varroa_count` | number | Conteo de varroa (opcional) |
| `activity_level` | enum | `low`, `medium`, `high` |
| `health_status` | enum | `healthy`, `weak`, `sick`, `critical` |
| `diseases` | array | Lista de enfermedades/plagas detectadas |
| `treatment_applied` | boolean | Si se aplicó tratamiento |
| `treatment_product` | string | Producto usado (si aplica) |
| `treatment_dose` | string | Dosis aplicada (si aplica) |
| `notes` | text | Observaciones detalladas |
| `created_at` | timestamp | Fecha de creación |
| `updated_at` | timestamp | Última modificación |

### Visualización:
- Lista de tarjetas con información resumida
- Formulario completo de creación con todas las secciones
- Badges de color según health_status y brood_pattern

**Justificación**: Combinar ambos enfoques proporciona información más completa. Los campos de Figma (queen_seen, brood_pattern, temperament) son observaciones estándar en inspecciones apícolas.

---

## 5. Dashboard

**Decisión**: SIMPLIFICAR

### Versión aprobada (MVP):

#### 4 Tarjetas de estadísticas:
1. **Total Colmenas** - Contador con desglose por estado
2. **Requieren Atención** - Colmenas en quarantine o con health_status crítico
3. **Inspecciones Pendientes** - Colmenas sin inspección en últimos 15 días
4. **Tareas Pendientes** - Contador de tareas no completadas

#### 2 Visualizaciones:
1. **Gráfico de barras**: Colmenas por Apiario
2. **Lista**: Últimas 5 inspecciones con estado

### Eliminado del diseño de Figma:
- Gráficos de producción (no es foco del MVP)
- Línea temporal de producción
- Estadísticas de miel/cera/propóleo

**Justificación**: El MVP se enfoca en gestión de salud de colmenas, no en producción. Simplificar el dashboard reduce complejidad y tiempo de desarrollo.

---

## 6. Producción

**Decisión**: INCLUIR en MVP (basado en diseño de Figma)

### Campos del modelo Producción:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `hive_id` | UUID | FK a colmena |
| `hive_name` | string | Denormalizado para UI |
| `date` | date | Fecha de cosecha |
| `honey_kg` | number | Kilogramos de miel |
| `wax_kg` | number | Kilogramos de cera |
| `propolis_g` | number | Gramos de propóleo |
| `notes` | string | Observaciones (opcional) |
| `created_at` | timestamp | Fecha de registro |

### Pantalla de Producción:
- **3 tarjetas de estadísticas**: Miel total, Cera total, Propóleo total
- **Gráfico de barras**: Producción por colmena
- **Tabla de registros**: Lista de cosechas con fecha y cantidades
- **Formulario**: Registro de nueva producción

---

## 7. Tareas

**Decisión**: INCLUIR en MVP

### Campos del modelo Tarea:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `hive_id` | UUID | FK a colmena (opcional) |
| `hive_name` | string | Denormalizado para UI (opcional) |
| `title` | string | Título de la tarea |
| `description` | string | Descripción detallada |
| `due_date` | date | Fecha límite |
| `priority` | enum | `high`, `medium`, `low` |
| `completed` | boolean | Estado de completado |
| `created_at` | timestamp | Fecha de creación |
| `updated_at` | timestamp | Última modificación |

### Pantalla de Tareas:
- **Lista de tareas** con filtros por estado y prioridad
- **Badges de prioridad** con colores (rojo/amarillo/verde)
- **Vinculación** opcional a colmena o apiario específico
- **Creación rápida** desde inspecciones (ej: "Aplicar tratamiento a Colmena Delta")

---

## 8. UI de Offline/Sync

**Decisión**: AGREGAR indicadores visuales

### Elementos UI para estado de conexión:

#### 1. Indicador en header
| Estado | Visual | Descripción |
|--------|--------|-------------|
| Online | Badge verde | Conexión activa |
| Offline | Badge naranja + icono nube tachada | Sin conexión |

#### 2. Indicador de sincronización pendiente
- Badge con número de cambios pendientes: `[3 pendientes]`
- Solo visible cuando hay datos locales no sincronizados
- Click para ver detalle de cambios pendientes

#### 3. Feedback en acciones
- **Guardar offline**: Toast "Guardado localmente. Se sincronizará cuando haya conexión."
- **Sincronizando**: Toast "Sincronizando..."
- **Sincronizado**: Toast "Sincronizado correctamente"
- **Error**: Toast con mensaje de error y opción de reintentar

#### 4. Resolución de conflictos
- Modal simple mostrando diferencias entre versión local y servidor
- Dos opciones: "Mantener local" / "Usar servidor"
- Solo aparece cuando hay conflictos reales

### Layout del header:
```
┌─────────────────────────────────────────────────┐
│ COLMENAPP              [3 pendientes] [Offline] │
└─────────────────────────────────────────────────┘
```

---

## 9. QR Scanner

**Decisión**: INCLUIR en MVP

### Funcionalidad de escaneo:

| Elemento | Descripción |
|----------|-------------|
| **Ubicación** | FAB (Floating Action Button) en pantalla de Colmenas |
| **Acción** | Abre cámara para escanear QR |
| **Resultado** | Redirige a detalle de la colmena identificada |
| **Formato QR** | `colmenapp://hive/{code}` |

### Generación de QR por colmena:

- Cada colmena genera QR único basado en su `code`
- Accesible desde el detalle de la colmena
- Opciones: "Ver QR" y "Imprimir QR"

### UI en detalle de colmena:
```
┌─────────────────────────────────────┐
│ Detalle Colmena: A-001              │
├─────────────────────────────────────┤
│                                     │
│   [Ver QR]  [Imprimir QR]           │
│                                     │
│   ┌─────────┐                       │
│   │ ▓▓▓▓▓▓▓ │  Código: A-001        │
│   │ ▓     ▓ │  Apiario: Norte       │
│   │ ▓▓▓▓▓▓▓ │                       │
│   └─────────┘                       │
│                                     │
└─────────────────────────────────────┘
```

### FAB de escaneo:
- Icono de cámara/QR
- Posición: esquina inferior derecha
- Visible en: lista de colmenas y dashboard

---

## 10. Modelo de Usuario

**Decisión**: AGREGAR

### Campos del modelo User:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `name` | string | Nombre completo |
| `email` | string | Email (único, para login) |
| `password_hash` | string | Contraseña hasheada |
| `created_at` | timestamp | Fecha de registro |
| `updated_at` | timestamp | Última modificación |

**Nota**: El AuthContext en Figma incluye funciones `login`, `register`, `logout` y estados `isOnline`, `pendingSync`.

---

## Resumen de Pantallas del MVP

| Pantalla | Estado |
|----------|--------|
| Login/Registro/Recuperar | AGREGAR |
| Dashboard | SIMPLIFICAR |
| Apiarios | AGREGAR |
| Colmenas | MODIFICAR |
| Inspecciones | COMBINAR |
| Producción | INCLUIR (de Figma) |
| Tareas | INCLUIR |
| QR Scanner | AGREGAR |
| Offline/Sync UI | AGREGAR |

---

## Resumen de Modelos de Datos Actualizados

**Fecha de actualización**: 2026-02-26

### Convenciones:
- **Enums en BD**: Siempre en inglés (ej: `healthy`, `active`, `high`)
- **Enums en UI**: Traducidos al español para mostrar
- **Campos denormalizados**: Se incluyen `_name` para facilitar renderizado en UI

```typescript
// Usuario (NUEVO)
interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

// Apiario (NUEVO)
interface Apiary {
  id: string;
  user_id: string;
  name: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  notes?: string;
  hive_count: number;        // Campo calculado/denormalizado
  created_at: Date;
  updated_at: Date;
}

// Colmena (ACTUALIZADO)
interface Hive {
  id: string;
  apiary_id: string;
  apiary_name: string;       // Denormalizado para UI
  code: string;
  name: string;
  status: 'active' | 'inactive' | 'quarantine' | 'lost';
  queen_origin: 'purchased' | 'raised' | 'swarm' | 'unknown';
  population?: number;
  frames?: number;
  installed_at?: Date;
  notes?: string;
  last_inspection?: Date;
  created_at: Date;
  updated_at: Date;
}

// Inspección (ACTUALIZADO)
interface Inspection {
  id: string;
  hive_id: string;
  hive_name: string;         // Denormalizado para UI
  date: Date;
  // Observación de reina y cría
  queen_seen: boolean;
  brood_pattern: 'excellent' | 'good' | 'fair' | 'poor';
  temperament: 'calm' | 'normal' | 'aggressive';
  // Métricas
  weight?: number;
  varroa_count?: number;
  activity_level: 'low' | 'medium' | 'high';
  health_status: 'healthy' | 'weak' | 'sick' | 'critical';
  // Enfermedades y tratamiento
  diseases: string[];        // Antes "plagues", renombrado a "diseases"
  treatment_applied: boolean;
  treatment_product?: string;
  treatment_dose?: string;
  // Observaciones
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Producción (ACTUALIZADO)
interface Production {
  id: string;
  hive_id: string;
  hive_name: string;         // Denormalizado para UI
  date: Date;
  honey_kg: number;
  wax_kg: number;
  propolis_g: number;
  notes?: string;
  created_at: Date;
}

// Tarea (ACTUALIZADO)
interface Task {
  id: string;
  hive_id?: string;
  hive_name?: string;        // Denormalizado para UI
  title: string;
  description?: string;
  due_date: Date;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}
```

### Mapeo de Enums (BD → UI)

| Campo | Valor BD | Valor UI (español) |
|-------|----------|-------------------|
| **status** | `active` | Activa |
| | `inactive` | Inactiva |
| | `quarantine` | Cuarentena |
| | `lost` | Perdida |
| **queen_origin** | `purchased` | Comprada |
| | `raised` | Criada |
| | `swarm` | Enjambre |
| | `unknown` | Desconocida |
| **brood_pattern** | `excellent` | Excelente |
| | `good` | Bueno |
| | `fair` | Regular |
| | `poor` | Pobre |
| **temperament** | `calm` | Calmada |
| | `normal` | Normal |
| | `aggressive` | Agresiva |
| **activity_level** | `low` | Baja |
| | `medium` | Media |
| | `high` | Alta |
| **health_status** | `healthy` | Saludable |
| | `weak` | Débil |
| | `sick` | Enferma |
| | `critical` | Crítica |
| **priority** | `low` | Baja |
| | `medium` | Media |
| | `high` | Alta |
