# COLMENAPP Backend - Plan

## Stack
- NestJS 10.x + TypeScript
- Prisma 6.x ORM
- PostgreSQL 16 (Docker)
- Passport.js + JWT (bcrypt)
- class-validator + class-transformer

## Architecture

```
src/
├── main.ts                 Entry point (ValidationPipe, CORS)
├── app.module.ts           Root module (ConfigModule, PrismaModule, feature modules)
├── prisma/
│   ├── prisma.module.ts    Global module
│   └── prisma.service.ts   PrismaClient wrapper
├── auth/                   Implementado
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   └── dto/
├── apiaries/               Pendiente
│   ├── apiaries.module.ts
│   ├── apiaries.controller.ts
│   ├── apiaries.service.ts
│   └── dto/
├── hives/                  Pendiente
│   ├── hives.module.ts
│   ├── hives.controller.ts
│   ├── hives.service.ts
│   └── dto/
├── inspections/            Pendiente
│   ├── inspections.module.ts
│   ├── inspections.controller.ts
│   ├── inspections.service.ts
│   └── dto/
├── production/             Pendiente
│   ├── production.module.ts
│   ├── production.controller.ts
│   ├── production.service.ts
│   └── dto/
├── tasks/                  Pendiente
│   ├── tasks.module.ts
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── dto/
└── dashboard/              Pendiente
    ├── dashboard.module.ts
    ├── dashboard.controller.ts
    └── dashboard.service.ts
```

## Database
- Schema: `prisma/schema.prisma` (6 modelos, 7 enums)
- Modelos: User, Apiary, Hive, Inspection, Production, Task
- Relaciones: User→Apiaries→Hives→(Inspections, Productions, Tasks)
- Indices en: apiary_id, hive_id, date, status, health_status, completed, priority
- onDelete: CASCADE (excepto Task→Hive que es SET NULL)

## Pattern per Module
1. **DTO**: class-validator decorators para input validation
2. **Controller**: rutas, guards, parameter extraction
3. **Service**: logica de negocio, queries Prisma, ownership checks
4. **Module**: registra controller + service, importa dependencias

## Ownership Pattern
Cada service recibe `userId` del request (extraido por JwtAuthGuard).
- Apiaries: `where: { user_id: userId }`
- Hives: join con Apiary para verificar ownership
- Inspections/Production/Tasks: join con Hive→Apiary para verificar ownership

## Environment
- DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, PORT
- ConfigModule.forRoot({ isGlobal: true })
