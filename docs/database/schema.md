# Base de Datos - Schema

## Diagrama de Relaciones

```
User (1) ──── (N) Apiary (1) ──── (N) Hive
                                        │
                              ┌─────────┼─────────┐
                              │         │         │
                          Inspection  Production  Task
                            (N)        (N)       (N, opcional)
```

## Modelos

### User
Tabla: `users`

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | UUID | PK, auto-generado |
| name | String | requerido |
| email | String | requerido, unico |
| password_hash | String | requerido |
| created_at | DateTime | auto |
| updated_at | DateTime | auto |

### Apiary
Tabla: `apiaries`

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | UUID | PK |
| user_id | UUID | FK -> users, CASCADE |
| name | String | requerido |
| location | String | requerido |
| latitude | Float | opcional |
| longitude | Float | opcional |
| notes | String | opcional |
| hive_count | Int | default 0 |
| created_at | DateTime | auto |
| updated_at | DateTime | auto |

### Hive
Tabla: `hives`

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | UUID | PK |
| apiary_id | UUID | FK -> apiaries, CASCADE |
| code | String | requerido, unico |
| name | String | requerido |
| status | HiveStatus | default `active` |
| queen_origin | QueenOrigin | default `unknown` |
| population | Int | opcional |
| frames | Int | opcional |
| installed_at | DateTime | opcional |
| notes | String | opcional |
| last_inspection | DateTime | opcional |
| created_at | DateTime | auto |
| updated_at | DateTime | auto |

**Indices**: apiary_id, status

### Inspection
Tabla: `inspections`

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | UUID | PK |
| hive_id | UUID | FK -> hives, CASCADE |
| date | Date | requerido |
| queen_seen | Boolean | default false |
| brood_pattern | BroodPattern | opcional |
| temperament | Temperament | opcional |
| weight | Float | opcional |
| varroa_count | Int | opcional |
| activity_level | ActivityLevel | opcional |
| health_status | HealthStatus | default `healthy` |
| diseases | String[] | default [] |
| treatment_applied | Boolean | default false |
| treatment_product | String | opcional |
| treatment_dose | String | opcional |
| notes | String | opcional |
| created_at | DateTime | auto |
| updated_at | DateTime | auto |

**Indices**: hive_id, date, health_status

### Production
Tabla: `productions`

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | UUID | PK |
| hive_id | UUID | FK -> hives, CASCADE |
| date | Date | requerido |
| honey_kg | Float | default 0 |
| wax_kg | Float | default 0 |
| propolis_g | Float | default 0 |
| notes | String | opcional |
| created_at | DateTime | auto |

**Indices**: hive_id, date

### Task
Tabla: `tasks`

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | UUID | PK |
| hive_id | UUID | FK -> hives, SET NULL, opcional |
| title | String | requerido |
| description | String | opcional |
| due_date | Date | requerido |
| priority | Priority | default `medium` |
| completed | Boolean | default false |
| created_at | DateTime | auto |
| updated_at | DateTime | auto |

**Indices**: hive_id, due_date, completed, priority

## Enums

| Enum | Valores |
|------|---------|
| HiveStatus | `active`, `inactive`, `quarantine`, `lost` |
| QueenOrigin | `purchased`, `raised`, `swarm`, `unknown` |
| BroodPattern | `excellent`, `good`, `fair`, `poor` |
| Temperament | `calm`, `normal`, `aggressive` |
| ActivityLevel | `low`, `medium`, `high` |
| HealthStatus | `healthy`, `weak`, `sick`, `critical` |
| Priority | `low`, `medium`, `high` |

## Mapeo Enums BD -> UI (Espanol)

| Enum | Ingles (BD) | Espanol (UI) |
|------|-------------|-------------|
| HiveStatus | active | Activa |
| | inactive | Inactiva |
| | quarantine | Cuarentena |
| | lost | Perdida |
| QueenOrigin | purchased | Comprada |
| | raised | Criada |
| | swarm | Enjambre |
| | unknown | Desconocida |
| BroodPattern | excellent | Excelente |
| | good | Bueno |
| | fair | Regular |
| | poor | Pobre |
| Temperament | calm | Calmada |
| | normal | Normal |
| | aggressive | Agresiva |
| ActivityLevel | low | Baja |
| | medium | Media |
| | high | Alta |
| HealthStatus | healthy | Saludable |
| | weak | Debil |
| | sick | Enferma |
| | critical | Critica |
| Priority | low | Baja |
| | medium | Media |
| | high | Alta |

## Politicas de Eliminacion

| Relacion | onDelete |
|----------|----------|
| User -> Apiary | CASCADE |
| Apiary -> Hive | CASCADE |
| Hive -> Inspection | CASCADE |
| Hive -> Production | CASCADE |
| Hive -> Task | SET NULL |

**Nota**: Al eliminar una colmena, las tareas asociadas se desvinculan (no se eliminan), ya que pueden ser tareas generales.

## Archivo Schema

Ubicacion: `backend/prisma/schema.prisma`
