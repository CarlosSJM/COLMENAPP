# T6: Coherencia Documentacion

**Prioridad:** 6 (ultimo)
**Esfuerzo:** 1-2h
**Impacto en nota:** Bajo
**Tipo:** Documentacion

## Objetivo

Alinear la documentacion entre README raiz, docs/ del frontend, y el estado real del proyecto tras implementar las mejoras T1-T5.

## Estado Actual

- README.md raiz: refleja estado del MVP entregado
- docs/README.md: indice completo con progreso
- docs/features/: specs de cada feature
- Puede haber desajustes tras implementar mejoras

## Subtareas

- [x] Verificar que README.md raiz refleja estado actual (features, stack, deployment)
- [x] Verificar que docs/README.md tiene todas las secciones actualizadas
- [x] Verificar coherencia entre docs/features/offline-sync.md y estado real (post T4)
- [x] Verificar que docs/testing/ incluye testing frontend (post T3)
- [x] Verificar que docs/testing/security-review.md refleja security hardening (post T1)
- [x] Actualizar tabla de progreso en docs/README.md con nuevas fases
- [x] Verificar que aprendizajes.md esta al dia (56 aprendizajes)
- [x] Revision final: leer todos los docs buscando referencias obsoletas

## Inconsistencias corregidas (15)

1. README.md: "Railway" → **Render** (5 referencias en diagramas, tablas y texto)
2. README.md: costes "~5€/mes" → **0€/mes** (free tier)
3. README.md: rate limiting "Pendiente" → **Implementado** (@nestjs/throttler)
4. README.md: helmet "Pendiente" → **Implementado**
5. README.md: "58 tests" → **114 tests** (58 backend + 56 frontend)
6. README.md: tests frontend "Pendiente" → **56 tests con Vitest + Testing Library**
7. README.md: "vite-plugin-pwa" → **Custom sw.js**
8. README.md: "react-i18next" → eliminado (no se usa)
9. README.md: "PostgreSQL 14+" → **PostgreSQL 16**
10. README.md: "33 lecciones" → **56 lecciones aprendidas**
11. README.md: `sync_status` en modelo de datos → eliminado (no existe en schema)
12. README.md: "Exportacion CSV" en MVP → movido a Tareas Futuras
13. README.md: Tareas Futuras obsoletas → actualizadas con backlog real (TK-F001 a TK-F006)
14. docs/README.md: Dexie.js "Pospuesto" → **Completado** (Abril 2026)
15. docs/README.md: Tests frontend "Pospuesto" → **Completado** (Abril 2026)

## Nota

Esta tarea se ejecuta AL FINAL, tras completar T1-T5, ya que documenta el estado post-mejoras.

## Documentar en

- Todos los archivos revisados se actualizan in-place
- `prompts.md` - registrar prompt utilizado
