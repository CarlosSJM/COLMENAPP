# T4: Offline-First Completo (Dexie.js + Cola de Sincronizacion)

**Prioridad:** 4 (pero MAYOR IMPACTO)
**Esfuerzo:** 8-12h
**Impacto en nota:** **Muy alto** - diferencial principal para A/A+
**Tipo:** Full-stack (principalmente Frontend)

## Objetivo

Implementar offline-first real: persistencia local con IndexedDB, cola de operaciones offline, y sincronizacion automatica al recuperar conexion. Es la brecha principal senalada en el feedback entre el discurso de producto y el estado actual.

## Estado Actual

- SW cache-first para assets estaticos: implementado
- SW network-first para API GET: implementado
- Indicadores online/offline en UI: implementado
- Badge de pendientes: estatico (siempre 0)
- **Dexie.js (IndexedDB):** NO implementado
- **Cola de operaciones:** NO implementado
- **Sync automatico:** NO implementado
- Mutaciones (POST/PUT/DELETE) requieren conexion

Documentado como limitacion en `docs/features/offline-sync.md` y `docs/testing/pending-manual-tests.md`.

## Subtareas

### Fase 1: Dexie.js - Persistencia Local (3-4h)
- [ ] Instalar Dexie.js (`npm install dexie`)
- [ ] Crear `src/services/db.ts` con schemas IndexedDB para las 5 entidades:
  - apiaries, hives, inspections, productions, tasks
- [ ] Crear `src/services/offlineStore.ts` con operaciones CRUD sobre IndexedDB
- [ ] Al cargar datos del API (GET), guardar copia en IndexedDB
- [ ] Al perder conexion, servir datos desde IndexedDB en vez de cache SW

### Fase 2: Cola de Operaciones (2-3h)
- [ ] Crear tabla `syncQueue` en Dexie: { id, entity, operation, payload, timestamp, status }
- [ ] Wrapper de API: si offline, encolar operacion en vez de fallar
- [ ] Mostrar toast "Guardado localmente. Se sincronizara al recuperar conexion."
- [ ] Actualizar badge de pendientes con count real de syncQueue

### Fase 3: Sincronizacion Automatica (2-3h)
- [ ] Listener `window.addEventListener('online', syncPendingOps)`
- [ ] Procesar cola en orden FIFO (respetar timestamps)
- [ ] Manejo de errores: reintentos con backoff exponencial (3 intentos max)
- [ ] Si operacion falla tras reintentos: marcar como fallida, notificar usuario
- [ ] Estrategia de conflictos: last-write-wins (simplificado para MVP)
- [ ] Limpiar cola tras sincronizacion exitosa
- [ ] Toast de feedback: "Sincronizando...", "Sincronizado correctamente", "Error al sincronizar"

### Fase 4: Integracion UI (1-2h)
- [ ] Badge de pendientes muestra count real
- [ ] Indicador visual en items no sincronizados (icono o badge)
- [ ] Boton manual "Sincronizar ahora" (opcional)
- [ ] Actualizar SW si es necesario

### Fase 5: Tests (1h)
- [ ] Tests de offlineStore (CRUD IndexedDB)
- [ ] Tests de syncQueue (enqueue, dequeue, process)
- [ ] Test de flujo completo: crear offline → reconectar → verificar sync

## Paquetes a Instalar

```bash
cd frontend
npm install dexie
```

## Arquitectura

```
API call (usuario crea/edita/elimina)
    │
    ├── Online? ──→ Enviar al backend ──→ OK ──→ Guardar en IndexedDB
    │                                     └──→ Error ──→ Toast error
    │
    └── Offline? ──→ Guardar en IndexedDB + Encolar en syncQueue
                     └──→ Toast "Guardado localmente"
                     └──→ Badge pendientes +1

Evento 'online':
    └──→ Procesar syncQueue (FIFO)
         ├── OK ──→ Limpiar de cola, actualizar IndexedDB
         └── Error ──→ Retry (max 3) o marcar fallido
```

## Documentar en

- `docs/features/offline-sync.md` - actualizar estado de implementacion
- `docs/testing/pending-manual-tests.md` - actualizar checklist
- `docs/aprendizajes.md` - aprendizajes sobre offline-first, Dexie.js, sync
- `prompts.md` - registrar prompts utilizados
