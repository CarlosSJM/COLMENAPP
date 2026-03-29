# Testing Unitario - Backend Services

## Descripcion

Los tests unitarios verifican la logica de negocio de cada service de forma aislada, mockeando PrismaService. No requieren base de datos ni red.

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| **Jest** | Framework de testing |
| **jest.fn()** | Mocks de Prisma methods |
| **@nestjs/testing** | TestingModule para inyeccion de dependencias |

## Como ejecutar

```bash
cd backend

# Todos los unit tests
npx jest src/**/*.service.spec.ts --forceExit

# Un service especifico
npx jest src/auth/auth.service.spec.ts --forceExit
npx jest src/apiaries/apiaries.service.spec.ts --forceExit
npx jest src/hives/hives.service.spec.ts --forceExit
npx jest src/inspections/inspections.service.spec.ts --forceExit

# Con verbose
npx jest src/**/*.service.spec.ts --forceExit --verbose
```

## Estructura

```
backend/src/
├── auth/auth.service.spec.ts              7 tests
├── apiaries/apiaries.service.spec.ts      6 tests
├── hives/hives.service.spec.ts            6 tests
└── inspections/inspections.service.spec.ts 5 tests
```

## Patron de mock

Cada test crea un mock de PrismaService con jest.fn() para cada metodo usado:

```typescript
prisma = {
  apiary: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    // ...
  },
};

const module = await Test.createTestingModule({
  providers: [
    ApiariesService,
    { provide: PrismaService, useValue: prisma },
  ],
}).compile();
```

Esto permite controlar exactamente que devuelve cada query y verificar que se llamo con los parametros correctos.

## Tests por Suite

### AuthService (7 tests)

| Test | Que valida |
|------|-----------|
| register hashea password | El password se almacena hasheado con bcrypt, no en texto plano |
| register rechaza duplicado | ConflictException si el email ya existe |
| register devuelve token | Llama a JwtService.sign con sub y email correctos |
| login con credenciales ok | Compara hash correctamente, devuelve token |
| login con password incorrecto | UnauthorizedException |
| login con email inexistente | UnauthorizedException (mismo error, no revela si existe) |
| getProfile sin password_hash | El select excluye password_hash del response |

### ApiariesService (6 tests)

| Test | Que valida |
|------|-----------|
| findAll filtra por user_id | La query WHERE incluye user_id |
| findOne devuelve si es del usuario | Retorna apiary cuando ownership coincide |
| findOne lanza 404 si no es del usuario | NotFoundException si findFirst retorna null |
| create asigna user_id | El data de create incluye user_id del usuario autenticado |
| remove verifica ownership | Llama findFirst antes de delete |
| remove rechaza si no es del usuario | NotFoundException, delete NO se ejecuta |

### HivesService (6 tests)

| Test | Que valida |
|------|-----------|
| create verifica apiary ownership | Verifica que el apiario pertenece al usuario |
| create actualiza hive_count | Tras crear, cuenta hives y actualiza apiary.hive_count |
| create rechaza apiary ajeno | ForbiddenException si apiario no es del usuario |
| remove actualiza hive_count | Tras eliminar, recuenta y actualiza apiary.hive_count |
| findByCode filtra por usuario | La query incluye apiary.user_id |
| findByCode lanza 404 | NotFoundException si no encuentra el code |

### InspectionsService (5 tests)

| Test | Que valida |
|------|-----------|
| create verifica hive ownership | Verifica que la colmena pertenece al usuario |
| create actualiza last_inspection | Tras crear, actualiza hive.last_inspection con la fecha |
| create rechaza hive ajena | NotFoundException si colmena no es del usuario |
| findAll filtra por usuario | Query via hive.apiary.user_id |
| remove verifica ownership | Ownership check antes de delete |

## Resultados

```
Test Suites: 4 passed, 4 total
Tests:       24 passed, 24 total
Time:        ~1s
```
