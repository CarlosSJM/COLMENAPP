# Testing E2E - Backend

## Descripcion

Los tests e2e (end-to-end) del backend verifican el funcionamiento completo de la API ejecutando requests HTTP reales contra la aplicacion NestJS conectada a la base de datos PostgreSQL.

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| **Jest** | Framework de testing (viene con NestJS) |
| **Supertest** | Cliente HTTP para tests (requests reales) |
| **@nestjs/testing** | Utilidades para levantar la app en modo test |
| **PostgreSQL (Docker)** | Base de datos real (no mocks) |

## Requisitos previos

```bash
# 1. Docker con PostgreSQL corriendo
docker compose up -d

# 2. Migracion aplicada
cd backend
npx prisma migrate dev

# 3. Dependencias instaladas
npm install
```

## Como ejecutar los tests

### Todos los tests e2e
```bash
cd backend
npx jest --config test/jest-e2e.json --forceExit
```

### Un test especifico
```bash
# Solo auth
npx jest --config test/jest-e2e.json test/auth.e2e-spec.ts --forceExit

# Solo apiaries
npx jest --config test/jest-e2e.json test/apiaries.e2e-spec.ts --forceExit

# Solo hives
npx jest --config test/jest-e2e.json test/hives.e2e-spec.ts --forceExit

# Solo inspections
npx jest --config test/jest-e2e.json test/inspections.e2e-spec.ts --forceExit
```

### Con output detallado
```bash
npx jest --config test/jest-e2e.json --forceExit --verbose
```

**Nota:** El flag `--forceExit` es necesario porque Prisma mantiene conexiones abiertas que Jest no cierra automaticamente.

## Estructura de tests

```
backend/test/
├── jest-e2e.json              Configuracion Jest para e2e
├── auth.e2e-spec.ts           Tests de autenticacion (10 tests)
├── apiaries.e2e-spec.ts       Tests de apiarios (13 tests)
├── hives.e2e-spec.ts          Tests de colmenas (7 tests)
└── inspections.e2e-spec.ts    Tests de inspecciones (4 tests)
```

## Patron de cada test suite

Todos los tests siguen el mismo patron:

```typescript
beforeAll(async () => {
  // 1. Levantar app NestJS completa con AppModule
  // 2. Configurar ValidationPipe (igual que en produccion)
  // 3. Registrar usuario de test via API
  // 4. Obtener JWT token
  // 5. Crear datos base necesarios (apiario, colmena...)
});

afterAll(async () => {
  // 1. Limpiar datos de test (deleteMany por email unico)
  // 2. Cerrar app
});
```

**Aislamiento:** Cada suite usa un email unico con timestamp (`test-auth-{Date.now()}@colmenapp.com`) para evitar conflictos entre ejecuciones.

## Tests por Suite

### Auth (10 tests)

| Test | Endpoint | Status esperado | Que valida |
|------|----------|----------------|-----------|
| Register usuario nuevo | POST /auth/register | 201 | Devuelve access_token |
| Register email duplicado | POST /auth/register | 409 | Rechaza email ya registrado |
| Register email invalido | POST /auth/register | 400 | Validacion class-validator |
| Register password corta | POST /auth/register | 400 | Minimo 6 caracteres |
| Login correcto | POST /auth/login | 201 | Devuelve access_token |
| Login password incorrecto | POST /auth/login | 401 | Rechaza credenciales |
| Login email inexistente | POST /auth/login | 401 | Rechaza email no registrado |
| Perfil con token | GET /auth/me | 200 | Devuelve email y name |
| Perfil sin token | GET /auth/me | 401 | Rechaza sin autenticacion |
| Perfil token invalido | GET /auth/me | 401 | Rechaza token falso |

**Test de seguridad critico:** El test "Perfil con token" verifica que `password_hash` NO esta presente en la respuesta.

### Apiaries (13 tests)

Usa **dos usuarios** para verificar ownership isolation.

| Test | Endpoint | Status | Que valida |
|------|----------|--------|-----------|
| Crear apiario | POST /apiaries | 201 | user_id correcto |
| Crear sin auth | POST /apiaries | 401 | Rechaza sin token |
| Crear sin campos | POST /apiaries | 400 | Validacion requeridos |
| Listar propios | GET /apiaries | 200 | Solo del usuario autenticado |
| User2 no ve user1 | GET /apiaries | 200 | Lista vacia para otro usuario |
| Obtener propio | GET /apiaries/:id | 200 | Datos correctos |
| User2 no obtiene user1 | GET /apiaries/:id | 404 | Ownership isolation |
| Editar propio | PUT /apiaries/:id | 200 | Nombre actualizado |
| User2 no edita user1 | PUT /apiaries/:id | 404 | Ownership isolation |
| Listar hives del apiario | GET /apiaries/:id/hives | 200 | Array de colmenas |
| User2 no elimina user1 | DELETE /apiaries/:id | 404 | Ownership isolation |
| Eliminar propio | DELETE /apiaries/:id | 200 | Eliminacion exitosa |
| Verificar eliminado | GET /apiaries/:id | 404 | Ya no existe |

### Hives (7 tests)

Valida reglas de dominio apicola.

| Test | Endpoint | Status | Que valida |
|------|----------|--------|-----------|
| Crear + hive_count | POST /hives | 201 | Crea colmena Y actualiza hive_count del apiario a 1 |
| Code duplicado | POST /hives | 500 | Unique constraint en code |
| Buscar por code | GET /hives/code/:code | 200 | Encuentra colmena por QR code |
| Code inexistente | GET /hives/code/XXX | 404 | No encuentra |
| Editar status | PUT /hives/:id | 200 | Status actualizado a quarantine |
| Listar con apiary.name | GET /hives | 200 | Include apiary.name funciona |
| Eliminar + hive_count | DELETE /hives/:id | 200 | Elimina Y decrementa hive_count a 0 |

### Inspections (4 tests)

Valida la regla de dominio mas critica: last_inspection.

| Test | Endpoint | Status | Que valida |
|------|----------|--------|-----------|
| Crear + last_inspection | POST /inspections | 201 | Crea inspeccion Y actualiza last_inspection de la colmena |
| Listar con hive.name | GET /inspections | 200 | Include hive.name funciona |
| Listar por colmena | GET /hives/:id/inspections | 200 | Filtro por hive_id |
| Eliminar | DELETE /inspections/:id | 200 | Eliminacion exitosa |

## Resultados esperados

```
Test Suites: 4 passed, 4 total
Tests:       34 passed, 34 total
Time:        ~2s
```

**Nota sobre errores en consola:** Durante la ejecucion, Prisma muestra un error `PrismaClientKnownRequestError: Unique constraint failed` en la consola. Esto es **esperado** - es el test de "code duplicado" que verifica que el servidor rechaza codigos repetidos correctamente.

## Limpieza de datos

Cada suite limpia sus datos de test en `afterAll` usando `prisma.user.deleteMany()` por email. Gracias a las politicas CASCADE del schema, al eliminar el usuario se eliminan automaticamente todos sus apiarios, colmenas, inspecciones, producciones y tareas.

## Que NO cubren estos tests

| Area | Razon |
|------|-------|
| Production CRUD | Mismo patron que Inspections, no aporta valor adicional |
| Tasks CRUD | Mismo patron, toggle ya validado en UI |
| Dashboard stats | Endpoint de lectura, depende de datos previos |
| Rate limiting | No implementado en MVP |
| Performance | No es objetivo del MVP |
