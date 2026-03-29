# Documentacion COLMENAPP

Indice general de documentacion del proyecto.

## Estructura

```
docs/
├── entrega1/                    Documentacion original (Entrega 1)
│   ├── app_apicultura.md        Especificacion tecnica completa
│   └── propuesta_cliente_mvp.md Propuesta MVP para cliente
│
├── architecture/                Arquitectura y stack tecnologico
│   └── tech-stack.md            Stack, estructura de proyecto, convenciones
│
├── design/                      Diseno UI/UX
│   ├── DESIGN_DECISIONS.md      Decisiones de diseno Figma vs Doc
│   └── FIGMA_PROMPT.md          Prompt para actualizar Figma AI
│
├── infrastructure/              Infraestructura y entorno
│   ├── setup.md                 Docker, PostgreSQL, variables de entorno
│   └── deployment.md            Guia despliegue (Vercel + Render + GitHub Actions)
│
├── database/                    Base de datos
│   └── schema.md                Modelos, enums, relaciones, indices
│
├── features/                    Funcionalidades del MVP
│   ├── auth.md                  Autenticacion (login, registro, JWT)
│   ├── apiaries.md              Gestion de apiarios
│   ├── hives.md                 Gestion de colmenas + QR
│   ├── inspections.md           Registro de inspecciones
│   ├── production.md            Registro de produccion
│   ├── tasks.md                 Gestion de tareas
│   ├── dashboard.md             Dashboard y estadisticas
│   ├── offline-sync.md          Offline/Sync y PWA
│   ├── crud-edit-delete.md      Edicion y eliminacion de registros
│   └── backlog-futuro.md       Tickets futuros (perfil, historicos, soft delete, audit log)
│
├── testing/                     Testing y seguridad
│   ├── e2e-backend.md           Tests E2E backend (34 tests, manual de ejecucion)
│   ├── unit-backend.md          Tests unitarios backend (24 tests, mock Prisma)
│   └── security-review.md       Revision de seguridad (checklist, hallazgos, fixes)
│
└── aprendizajes.md              Lecciones aprendidas (tecnicas, funcionales, diseno, interaccion IA)
```

## Progreso

| Fase | Estado | Fecha |
|------|--------|-------|
| Entrega 1 - Documentacion | Completada | Enero 2026 |
| Disenos Figma | Completados y validados | Febrero 2026 |
| Decisiones de diseno | Documentadas | Febrero 2026 |
| Schema Prisma | Creado | Febrero 2026 |
| Inicializacion Backend (NestJS) | Completada | Marzo 2026 |
| PrismaService + Auth Module | Completado | Marzo 2026 |
| Spec Kit Backend | Completado (v1.1) | Marzo 2026 |
| Spec Kit Frontend | Completado (v1.2) | Marzo 2026 |
| CRUD Backend (7 modulos, 33 rutas) | Completado | Marzo 2026 |
| Inicializacion Frontend (React+Vite) | Completado | Marzo 2026 |
| Integracion componentes Figma | Completado | Marzo 2026 |
| Conexion Frontend-Backend | Completado | Marzo 2026 |
| Fixes UI (Tailwind v4 compat) | Completado | Marzo 2026 |
| QR Scanner + QR Generation | Completado | Marzo 2026 |
| PWA (Manifest + Service Worker) | Completado | Marzo 2026 |
| Edit/Delete todas las entidades | Completado | Marzo 2026 |
| Tests e2e backend (34 tests) | Completado | Marzo 2026 |
| Tests unitarios backend (24 tests) | Completado | Marzo 2026 |
| Revision de seguridad (3 fixes) | Completado | Marzo 2026 |
| Actualizacion README.md Entrega 2 | Completado | Marzo 2026 |
| Offline Sync (Dexie.js + Queue) | Pendiente (fase futura) | - |
| Tests frontend | Pendiente (fase futura) | - |

## Plan de Accion

### Fase 1: Spec Kit (Especificaciones) ✅

**1.1 Instalar Spec Kit CLI**
- Instalar UV (gestor paquetes Python)
- Instalar specify-cli
- Verificar instalacion

**1.2 Spec Kit Backend** (`backend/.specify/`)
- `constitution.md` ← Principios del proyecto (YAGNI, offline-first, sencillez)
- `spec.md` ← Specs de endpoints, validaciones, logica de negocio (de docs/features/*.md)
- `plan.md` ← Arquitectura NestJS + Prisma + estructura modulos (de docs/architecture/ + docs/database/)
- `tasks.md` ← Tareas concretas de implementacion backend
- `CLAUDE.md` ← Instrucciones para Claude Code en backend

**1.3 Spec Kit Frontend** (`frontend/.specify/`)
- `constitution.md` ← Mismos principios
- `spec.md` ← Specs de pantallas, formularios, navegacion (de docs/features/*.md + docs/design/)
- `plan.md` ← Stack React+Vite+shadcn, estructura componentes, Dexie.js
- `tasks.md` ← Tareas concretas de implementacion frontend
- `CLAUDE.md` ← Instrucciones para Claude Code en frontend

**1.4 CLAUDE.md raiz** ← Convenciones globales del proyecto

**1.5 Revisar y refinar** ← Ajustar specs con el usuario antes de implementar

### Fase 2: Backend (CRUD y logica) ✅

| Tarea | Dependencia |
|-------|-------------|
| Migracion Prisma inicial (Docker + migrate dev) | Spec Kit Backend |
| Seed de datos de prueba | Migracion |
| CRUD Apiaries (module, controller, service, DTOs) | Auth Module |
| CRUD Hives (+ endpoint buscar por code para QR) | Apiaries |
| CRUD Inspections | Hives |
| CRUD Production | Hives |
| CRUD Tasks (+ toggle completada) | Hives |
| Endpoint stats para Dashboard | Todos los CRUDs |

### Fase 3: Frontend (Inicializacion y componentes) ✅

| Tarea | Dependencia |
|-------|-------------|
| Inicializar React + Vite + TypeScript | Spec Kit Frontend |
| Instalar dependencias (shadcn, recharts, react-router, etc.) | Inicializacion |
| Integrar componentes exportados de Figma | Dependencias |
| Configurar rutas y navegacion | Componentes |
| Crear servicios API (axios/fetch) | Rutas |
| Conectar componentes a API backend | Servicios API + Backend CRUDs |

### Fase 4: QR + PWA ✅

| Tarea | Estado |
|-------|--------|
| QR Scanner (html5-qrcode, camara, buscar por codigo) | Completado |
| QR Generation (qrcode.react, local, SVG, imprimible) | Completado |
| PWA Manifest (instalable, standalone, iconos, tema) | Completado |
| Service Worker (cache assets, fallback API) | Completado |
| Dexie.js + Sync Queue | Pospuesto (complejidad alta, fase futura) |

### Fase 4b: Edicion y Eliminacion ✅

| Tarea | Capa | Dependencia |
|-------|------|-------------|
| Componente ConfirmDeleteDialog reutilizable | Frontend | - |
| Edit + Delete Apiarios | Frontend | ConfirmDeleteDialog |
| Edit + Delete Colmenas | Frontend | ConfirmDeleteDialog |
| Edit + Delete Tareas | Frontend | ConfirmDeleteDialog |
| Edit + Delete Inspecciones | Frontend | ConfirmDeleteDialog |
| Edit + Delete Produccion | Frontend | ConfirmDeleteDialog |
| Mostrar updated_at en cards/detalles | Frontend | Edit implementado |

Detalle completo: `docs/features/crud-edit-delete.md`

### Fase 5: Testing y pulido ✅

| Tarea | Estado |
|-------|--------|
| Tests e2e backend (34 tests, 4 suites) | Completado |
| Tests unitarios backend (24 tests, 4 suites) | Completado |
| Revision de seguridad (3 vulnerabilidades corregidas) | Completado |
| Tests frontend | Pospuesto (tarea futura) |

### Tareas Futuras (Post-MVP)

| Tarea | Prioridad | Descripcion |
|-------|-----------|-------------|
| Tests frontend (Vitest + RTL) | Media | Componentes criticos: Dashboard, Hives, Auth |
| Offline sync completo (Dexie.js) | Media | IndexedDB + cola de operaciones + conflictos |
| Rate limiting (produccion) | Alta | @nestjs/throttler en auth endpoints |
| Helmet.js (produccion) | Alta | Headers de seguridad |
| Exportacion CSV | Media | Descarga de datos por apiario |
| Edicion de inspecciones (UI) | Baja | Endpoint PUT ya listo, falta dialog en frontend |
| Edicion de produccion (UI) | Baja | Endpoint PUT ya listo, falta dialog en frontend |
