# COLMENAPP - Instrucciones para Claude Code

## Contexto del Proyecto
COLMENAPP es una PWA de gestion apicola para el proyecto final del master AI4Devs/LIDR.co.
Permite gestionar apiarios, colmenas, inspecciones, produccion y tareas con soporte offline.

## Estructura del Proyecto
```
COLMENAPP/
├── backend/          NestJS + Prisma + PostgreSQL
├── frontend/         React + Vite + TypeScript + shadcn/ui
├── docs/             Documentacion completa del proyecto
└── docker-compose.yml  PostgreSQL 16 local
```

## Spec Kit
Ambos subproyectos usan Spec Kit (SDD). Documentos core:
- `backend/.specify/memory/` → constitution, spec, plan, tasks del backend
- `frontend/.specify/memory/` → constitution, spec, plan, tasks del frontend

## Convenciones

### Commits
Conventional Commits en ingles:
- `feat:` / `feat(backend):` / `feat(frontend):` - Nueva funcionalidad
- `fix:` - Correccion de bug
- `docs:` - Documentacion
- `refactor:` - Refactorizacion

### Enums
- Base de datos: SIEMPRE en ingles (`active`, `healthy`, `high`)
- UI: Traducidos a espanol para mostrar (`Activa`, `Saludable`, `Alta`)
- Mapeo centralizado en `frontend/src/utils/enums.ts`

### API
- Prefijo: `/api/v1/`
- Auth: Bearer token JWT en header Authorization
- Todos los endpoints protegidos excepto register/login
- Ownership validation: usuario solo ve sus datos

### Base de Datos
- Schema unico: `backend/prisma/schema.prisma`
- Migraciones con Prisma Migrate
- 6 modelos: User, Apiary, Hive, Inspection, Production, Task
- 7 enums: HiveStatus, QueenOrigin, BroodPattern, Temperament, ActivityLevel, HealthStatus, Priority

### Codigo
- TypeScript estricto en ambos subproyectos
- Backend: NestJS modules (controller + service + DTOs)
- Frontend: React funcional con hooks, shadcn/ui components
- No over-engineering: YAGNI siempre

## Comandos Utiles
```bash
# Base de datos
docker compose up -d                    # Levantar PostgreSQL
cd backend && npx prisma migrate dev    # Ejecutar migraciones
cd backend && npx prisma studio         # UI de base de datos

# Backend
cd backend && npm run start:dev         # Dev server (puerto 3000)
cd backend && npx nest build            # Compilar

# Frontend
cd frontend && npm run dev              # Dev server (puerto 5173)
cd frontend && npm run build            # Build produccion
```

## Documentacion
Toda la documentacion esta en `docs/` organizada por tema:
- `docs/features/` - Specs de cada feature (auth, apiaries, hives, etc.)
- `docs/database/schema.md` - Modelos de BD
- `docs/design/DESIGN_DECISIONS.md` - Decisiones UI/UX
- `docs/architecture/tech-stack.md` - Stack y convenciones
