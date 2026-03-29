# Backend - COLMENAPP

## Stack
- NestJS + TypeScript
- Prisma ORM
- PostgreSQL 16 (Docker)
- Passport.js + JWT (bcrypt)

## Progreso

| Paso | Estado |
|------|--------|
| Schema Prisma (6 modelos, 7 enums) | Completado |
| Inicializar NestJS | Pendiente |
| Migracion inicial | Pendiente |
| Speckit | Pendiente |
| Modulo Auth (register, login, JWT) | Pendiente |
| CRUD Apiaries | Pendiente |
| CRUD Hives | Pendiente |
| CRUD Inspections | Pendiente |
| CRUD Production | Pendiente |
| CRUD Tasks | Pendiente |
| Endpoint Sync | Pendiente |

## Setup

```bash
# Requisitos: Docker corriendo con PostgreSQL
docker compose up -d    # Desde raiz del proyecto

# Backend
cd backend
cp ../.env.example .env
npm install
npx prisma migrate dev --name init
npm run start:dev
```

## Estructura Planificada

```
backend/
├── prisma/
│   └── schema.prisma         Completado
├── src/
│   ├── auth/                 Pendiente
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   ├── users/                Pendiente
│   ├── apiaries/             Pendiente
│   ├── hives/                Pendiente
│   ├── inspections/          Pendiente
│   ├── production/           Pendiente
│   ├── tasks/                Pendiente
│   ├── sync/                 Pendiente
│   ├── prisma/               Pendiente
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── README.md
```

## API

- Prefijo: `/api/v1/`
- Auth: Bearer token JWT
- Documentacion de endpoints: ver `docs/features/`

## Base de Datos

- Schema: `prisma/schema.prisma`
- Documentacion: `docs/database/schema.md`
- Modelos: User, Apiary, Hive, Inspection, Production, Task
