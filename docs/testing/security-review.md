# Revision de Seguridad - COLMENAPP Backend

**Fecha:** Marzo 2026
**Alcance:** API REST backend (NestJS + Prisma + PostgreSQL)

## Resumen

| Area | Estado | Hallazgos |
|------|--------|-----------|
| Password hash | ✅ Seguro | `select` en getProfile, `select` en JwtStrategy |
| Ownership isolation | ✅ Seguro (fix aplicado) | Todas las queries filtran por user_id. Bug encontrado y corregido en Tasks |
| Input validation | ✅ Seguro | class-validator en todos los DTOs, whitelist activo |
| SQL injection | ✅ Seguro | Prisma ORM, no hay queries raw |
| JWT config | ✅ Seguro | Secret desde .env, expiracion configurable |
| CORS | ✅ Corregido | Restringido a origen del frontend |
| Rate limiting | ✅ Implementado | Global 100 req/min + login/register 5 req/min |
| Security headers | ✅ Implementado | Helmet.js (XSS, HSTS, clickjacking, sniffing) |

## Hallazgos y Fixes

### 1. JwtStrategy traia password_hash en memoria (CORREGIDO)

**Severidad:** Media
**Donde:** `src/auth/jwt.strategy.ts`
**Problema:** `findUnique` sin `select` traia el objeto User completo (incluyendo password_hash) aunque el `return` filtraba manualmente.
**Fix:** Agregar `select: { id: true, email: true, name: true }` a la query.
**Impacto:** El password_hash ya no pasa por memoria del servidor en cada request autenticado.

### 2. Tareas generales sin ownership (CORREGIDO - Bug critico)

**Severidad:** Alta
**Donde:** `src/tasks/tasks.service.ts`, `prisma/schema.prisma`
**Problema:** El modelo Task no tenia `user_id`. Las tareas se filtraban por `hive.apiary.user_id`, lo que excluia tareas generales (sin hive_id) y no permitia validar ownership.
**Fix:**
- Agregado `user_id` al modelo Task en schema.prisma
- Migracion `add_user_id_to_tasks` (limpia tareas huerfanas, agrega columna)
- TasksService reescrito: filtra por `user_id` directo
- DashboardService actualizado: cuenta tareas por `user_id`
- Seed actualizado con `user_id` en todas las tareas

**Impacto:** Las tareas ahora estan correctamente aisladas por usuario. Tareas generales (sin colmena) funcionan correctamente.

### 3. CORS abierto a cualquier origen (CORREGIDO)

**Severidad:** Media
**Donde:** `src/main.ts`
**Problema:** `app.enableCors()` sin parametros acepta requests de cualquier origen.
**Fix:** Restringido a `process.env.CORS_ORIGIN || 'http://localhost:5173'` con `credentials: true`.
**Impacto:** Solo el frontend autorizado puede hacer requests al backend.

## Checklist Completa

### Autenticacion
- [x] Passwords hasheados con bcrypt (salt 10)
- [x] JWT tokens con expiracion (24h configurable)
- [x] Secret JWT desde variable de entorno (.env)
- [x] password_hash nunca expuesto en responses (select explicito)
- [x] password_hash no pasa por memoria innecesariamente (JwtStrategy con select)
- [x] Register valida email formato y password minimo 6 chars

### Autorizacion (Ownership)
- [x] Apiaries: filtro directo por `user_id`
- [x] Hives: filtro via `apiary.user_id`
- [x] Inspections: filtro via `hive.apiary.user_id`
- [x] Production: filtro via `hive.apiary.user_id`
- [x] Tasks: filtro directo por `user_id` (corregido)
- [x] Dashboard: todas las queries filtran por usuario
- [x] Tests e2e verifican ownership con 2 usuarios

### Input Validation
- [x] ValidationPipe global con whitelist (rechaza campos no declarados)
- [x] Todos los DTOs usan class-validator decorators
- [x] Campos numericos con @Min(0) donde aplica
- [x] Enums validados con @IsEnum
- [x] Emails validados con @IsEmail
- [x] Strings requeridos con @IsString + @MinLength

### SQL Injection
- [x] Prisma ORM usado exclusivamente (no queries raw)
- [x] Parametros tipados via DTOs

### CORS
- [x] Restringido a origen del frontend
- [x] Credentials habilitadas

### Implementado (Abril 2026)
- [x] Rate limiting global: 100 req/min (@nestjs/throttler con ThrottlerGuard global)
- [x] Rate limiting en login/register: 5 req/min (@Throttle decorator)
- [x] Helmet.js: XSS protection, HSTS, content-type sniffing, frameguard (clickjacking)

### Pendiente para Produccion
- [ ] Logging de intentos de acceso fallidos
- [ ] HTTPS obligatorio
