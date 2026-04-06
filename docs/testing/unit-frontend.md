# Tests Unitarios Frontend - COLMENAPP

**Framework:** Vitest + Testing Library + jsdom
**Fecha:** Abril 2026
**Total tests:** 56 (5 suites)

## Setup

```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Configuracion:** `vitest.config.ts` con entorno jsdom, alias `@/`, globals habilitados.

## Suites de Tests

### 1. Enums (`utils/__tests__/enums.test.ts`) - 12 tests

Valida el mapeo centralizado de enums ingles (BD) → espanol (UI):
- Labels de los 7 enums (hiveStatus, queenOrigin, broodPattern, temperament, activityLevel, healthStatus, priority)
- Valores desconocidos devuelven undefined
- Colores CSS siguen patron de severidad (green=ok, red=critico)

### 2. Adapters (`services/__tests__/adapters.test.ts`) - 18 tests

Valida la capa de adaptacion backend → componentes Figma:
- `adaptHive`: extrae `apiary_name` de `apiary.name`
- `adaptInspection/Production`: extraen `hive_name` de `hive.name`
- `adaptTask`: maneja tareas con y sin colmena (hive null = tarea general)
- Edge cases: apiary/hive null o undefined
- Arrays vacios y preservacion de campos originales

### 3. API Service (`services/__tests__/api.test.ts`) - 14 tests

Valida el cliente API con fetch mockeado:
- Headers: Content-Type, Authorization con Bearer token
- Auth: login/register envian POST, me envia GET
- CRUD: GET, POST con body, PUT con id, DELETE con id, PATCH para toggle
- Errores: mensaje del servidor, fallback "Error de red"
- Token: se incluye cuando existe en localStorage, se omite cuando no

### 4. ConfirmDeleteDialog (`components/__tests__/ConfirmDeleteDialog.test.tsx`) - 8 tests

Valida el componente de confirmacion de eliminacion:
- Renderiza titulo, descripcion y warning opcional
- Botones "Cancelar" y "Eliminar" disparan callbacks correctos
- Estado loading: texto "Eliminando...", botones deshabilitados
- No renderiza contenido cuando isOpen=false

### 5. AuthContext (`contexts/__tests__/AuthContext.test.tsx`) - 6 tests

Valida el contexto de autenticacion:
- Sin token: inicia sin usuario
- Con token valido: carga usuario via api.me()
- Token expirado: limpia token si me() falla
- Logout: limpia usuario y token
- Online status: refleja navigator.onLine
- Error: lanza si useAuth se usa fuera de AuthProvider

## Ejecucion

```bash
# Todos los tests
npm test

# Watch mode
npm run test:watch

# Con cobertura
npm run test:coverage
```

## CI

Integrado en `.github/workflows/ci.yml` - job `frontend-tests` ejecuta `npm test` antes del build.
