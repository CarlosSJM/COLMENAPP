# COLMENAPP Backend - Specification

## Overview
API REST para gestion apicola. Permite a apicultores profesionales gestionar apiarios, colmenas, inspecciones, produccion y tareas. Soporte offline-first con sincronizacion.

## Authentication (auth)
- POST `/api/v1/auth/register` - Crear cuenta (name, email, password min 6 chars)
- POST `/api/v1/auth/login` - Devuelve JWT token
- GET `/api/v1/auth/me` - Perfil del usuario autenticado (protegido)
- Password hasheado con bcrypt (salt 10)
- JWT expira en 24h (configurable)

**Estado**: Implementado

## Apiaries (apiaries)
- GET `/api/v1/apiaries` - Listar apiarios del usuario autenticado
- POST `/api/v1/apiaries` - Crear apiario (name requerido, location requerido, lat/lng opcionales, notes opcional)
- GET `/api/v1/apiaries/:id` - Obtener apiario (verificar ownership)
- PUT `/api/v1/apiaries/:id` - Actualizar apiario
- DELETE `/api/v1/apiaries/:id` - Eliminar apiario (CASCADE elimina colmenas)
- GET `/api/v1/apiaries/:id/hives` - Listar colmenas del apiario
- Campo calculado `hive_count` se actualiza al crear/eliminar colmenas

## Hives (hives)
- GET `/api/v1/hives` - Listar todas las colmenas del usuario (a traves de sus apiarios)
- POST `/api/v1/hives` - Crear colmena (code unico, name, apiary_id requeridos)
- GET `/api/v1/hives/:id` - Obtener colmena con include apiary
- PUT `/api/v1/hives/:id` - Actualizar colmena
- DELETE `/api/v1/hives/:id` - Eliminar colmena (CASCADE)
- GET `/api/v1/hives/code/:code` - Buscar por codigo (para QR scanner)
- Status: active | inactive | quarantine | lost
- Queen origin: purchased | raised | swarm | unknown
- `last_inspection` se actualiza automaticamente al crear inspeccion

## Inspections (inspections)
- GET `/api/v1/inspections` - Listar inspecciones del usuario
- POST `/api/v1/inspections` - Crear inspeccion (hive_id, date requeridos)
- GET `/api/v1/inspections/:id` - Obtener inspeccion
- PUT `/api/v1/inspections/:id` - Actualizar inspeccion
- DELETE `/api/v1/inspections/:id` - Eliminar inspeccion
- GET `/api/v1/hives/:id/inspections` - Inspecciones de una colmena
- Al crear inspeccion: actualizar `last_inspection` de la colmena
- Campos condicionales: si `treatment_applied=true`, entonces `treatment_product` y `treatment_dose`
- `diseases` es array de strings

## Production (productions)
- GET `/api/v1/productions` - Listar registros de produccion
- POST `/api/v1/productions` - Registrar produccion (hive_id, date, honey_kg, wax_kg, propolis_g)
- GET `/api/v1/productions/:id` - Obtener registro
- PUT `/api/v1/productions/:id` - Actualizar registro
- DELETE `/api/v1/productions/:id` - Eliminar registro
- GET `/api/v1/hives/:id/productions` - Produccion de una colmena
- GET `/api/v1/productions/stats` - Estadisticas agregadas (totales, promedios)

## Tasks (tasks)
- GET `/api/v1/tasks` - Listar tareas del usuario
- POST `/api/v1/tasks` - Crear tarea (title requerido, due_date requerido)
- GET `/api/v1/tasks/:id` - Obtener tarea
- PUT `/api/v1/tasks/:id` - Actualizar tarea
- PATCH `/api/v1/tasks/:id/toggle` - Toggle completada
- DELETE `/api/v1/tasks/:id` - Eliminar tarea
- hive_id opcional (tarea general vs vinculada a colmena)
- Priority: high | medium | low

## Dashboard Stats
- GET `/api/v1/dashboard/stats` - Estadisticas agregadas:
  - total_hives, hives por estado
  - needs_attention (quarantine + critical)
  - needs_inspection (sin inspeccion en 15+ dias)
  - pending_tasks, high_priority_tasks
  - hives_by_apiary (para grafico)
  - recent_inspections (ultimas 5)

## Cross-cutting
- Todos los endpoints protegidos con JWT (excepto register/login)
- Ownership validation: usuario solo ve sus propios datos
- ValidationPipe global con whitelist y transform
- CORS habilitado
- Responses incluyen campos denormalizados (_name) via Prisma include
