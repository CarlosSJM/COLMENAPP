# T3: Testing Frontend (Vitest + Testing Library)

**Prioridad:** 3
**Esfuerzo:** 4-6h
**Impacto en nota:** Alto
**Tipo:** Frontend

## Objetivo

Implementar tests unitarios del frontend, punto debil senalado en el feedback. Cubrir componentes criticos, hooks y utilidades.

## Estado Actual

- **0 tests** en el frontend
- No hay dependencias de testing instaladas (ni vitest ni testing-library)
- Backend tiene 58 tests (34 e2e + 24 unitarios) - bien cubierto

## Subtareas

### Setup (30min)
- [ ] Instalar dependencias: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom
- [ ] Crear `vitest.config.ts` con entorno jsdom
- [ ] Crear `src/test/setup.ts` para imports globales (jest-dom matchers)
- [ ] Agregar script `"test"` en package.json

### Tests de Utilidades (1h)
- [ ] `utils/enums.ts` - mapeo de enums ingles/espanol
- [ ] `services/adapters.ts` - transformacion de datos backend a formato UI
- [ ] `services/api.ts` - funciones de API (mock de fetch/axios)

### Tests de Componentes (2-3h)
- [ ] `ConfirmDeleteDialog` - render, interacciones, callbacks
- [ ] Formularios CRUD (al menos uno representativo: CreateApiaryDialog o similar)
- [ ] `QRScanner` - render basico (mock de html5-qrcode)
- [ ] Dashboard - render con datos mock
- [ ] Header - estado online/offline

### Tests de Hooks (1h)
- [ ] Hook de autenticacion (AuthContext)
- [ ] Hook de conexion online/offline

### CI (30min)
- [ ] Integrar `npm test` en GitHub Actions workflow
- [ ] Verificar que CI pasa con los nuevos tests

## Paquetes a Instalar

```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## Estructura de Tests

```
frontend/src/
├── test/
│   └── setup.ts              # Config global (jest-dom matchers)
├── utils/
│   └── __tests__/
│       └── enums.test.ts
├── services/
│   └── __tests__/
│       ├── adapters.test.ts
│       └── api.test.ts
├── components/
│   └── __tests__/
│       ├── ConfirmDeleteDialog.test.tsx
│       ├── QRScanner.test.tsx
│       └── Dashboard.test.tsx
└── ...
```

## Documentar en

- `docs/testing/` - nuevo archivo `unit-frontend.md`
- `docs/aprendizajes.md` - aprendizajes sobre testing frontend
- `prompts.md` - registrar prompts utilizados
