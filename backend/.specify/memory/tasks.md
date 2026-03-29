# COLMENAPP Backend - Tasks

## Phase 0: Database Setup
- [x] Crear schema Prisma (6 modelos, 7 enums)
- [ ] Levantar Docker PostgreSQL (`docker compose up -d`)
- [ ] Crear archivo `.env` desde `.env.example`
- [ ] Ejecutar migracion inicial (`npx prisma migrate dev --name init`)
- [ ] Crear seed de datos de prueba (`prisma/seed.ts`)

## Phase 1: Auth Module (COMPLETADO)
- [x] PrismaService + PrismaModule (global)
- [x] AuthModule (register, login, JWT)
- [x] JwtStrategy + JwtAuthGuard
- [x] DTOs con class-validator (RegisterDto, LoginDto)
- [x] ValidationPipe + CORS en main.ts

## Phase 2: CRUD Apiaries
- [ ] CreateApiaryDto (name, location, latitude?, longitude?, notes?)
- [ ] UpdateApiaryDto (PartialType de Create)
- [ ] ApiariesService (CRUD + ownership check + hive_count update)
- [ ] ApiariesController (rutas + JwtAuthGuard)
- [ ] ApiariesModule
- [ ] Registrar en AppModule

## Phase 3: CRUD Hives
- [ ] CreateHiveDto (code, name, apiary_id, status?, queen_origin?, population?, frames?, installed_at?, notes?)
- [ ] UpdateHiveDto
- [ ] HivesService (CRUD + ownership via apiary + buscar por code)
- [ ] HivesController (rutas + endpoint /code/:code para QR)
- [ ] HivesModule
- [ ] Registrar en AppModule

## Phase 4: CRUD Inspections
- [ ] CreateInspectionDto (todos los campos de inspeccion)
- [ ] UpdateInspectionDto
- [ ] InspectionsService (CRUD + actualizar last_inspection de hive)
- [ ] InspectionsController
- [ ] InspectionsModule
- [ ] Registrar en AppModule

## Phase 5: CRUD Production
- [ ] CreateProductionDto (hive_id, date, honey_kg, wax_kg, propolis_g, notes?)
- [ ] UpdateProductionDto
- [ ] ProductionService (CRUD + stats endpoint)
- [ ] ProductionController
- [ ] ProductionModule
- [ ] Registrar en AppModule

## Phase 6: CRUD Tasks
- [ ] CreateTaskDto (title, due_date, description?, priority?, hive_id?)
- [ ] UpdateTaskDto
- [ ] TasksService (CRUD + toggle completada)
- [ ] TasksController (incluye PATCH toggle)
- [ ] TasksModule
- [ ] Registrar en AppModule

## Phase 7: Dashboard
- [ ] DashboardService (queries agregadas para stats)
- [ ] DashboardController (GET /api/v1/dashboard/stats)
- [ ] DashboardModule
- [ ] Registrar en AppModule

## Phase 8: Testing
- [ ] Tests unitarios para cada service
- [ ] Tests e2e para endpoints criticos (auth, apiaries, hives)
