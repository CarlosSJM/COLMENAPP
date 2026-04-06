# T5: Tipado Estricto Frontend (Eliminar any)

**Prioridad:** 5
**Esfuerzo:** 3-5h
**Impacto en nota:** Medio
**Tipo:** Frontend

## Objetivo

Mejorar el tipado TypeScript del frontend eliminando los 29 usos de `: any` y creando interfaces/types para todas las entidades y responses API.

## Estado Actual

- **29 ocurrencias de `: any`** en el frontend
  - 10 en `services/api.ts`
  - 19 repartidos en componentes y otros archivos
- No hay interfaces centralizadas para las entidades del API

## Subtareas

### Fase 1: Crear Types (1h)
- [ ] Crear `src/types/` con interfaces para cada entidad:
  - `Apiary`, `Hive`, `Inspection`, `Production`, `Task`, `User`
- [ ] Crear tipos para API responses: `ApiResponse<T>`, `PaginatedResponse<T>`
- [ ] Crear tipos para formularios: `CreateApiaryDto`, `UpdateHiveDto`, etc.

### Fase 2: Tipar API Service (1-2h)
- [ ] Reemplazar los 10 `: any` en `services/api.ts` con tipos correctos
- [ ] Tipar parametros y retornos de todas las funciones API
- [ ] Tipar el interceptor/handler de errores

### Fase 3: Tipar Componentes (1-2h)
- [ ] Reemplazar los 19 `: any` restantes en componentes
- [ ] Tipar props de componentes (interfaces para cada uno)
- [ ] Tipar estados (useState<Tipo>)
- [ ] Tipar event handlers y callbacks

### Fase 4: Verificar (30min)
- [ ] Ejecutar `npx tsc --noEmit` para verificar que compila sin errores
- [ ] Verificar que la app funciona correctamente tras los cambios
- [ ] Considerar activar `strict: true` en tsconfig.json si no esta

## Resultado

- **29 `: any` eliminados** → 0 restantes en todo el frontend
- **10 `as any` mantenidos** en `offlineStore.ts` (justificados, ver abajo)
- **8 null-checks** añadidos en componentes (campos opcionales: population, installed_at, last_inspection, brood_pattern, temperament, varroa_count)
- **Dead code eliminado** en Inspections.tsx (4 lineas inalcanzables post-return)
- `strict: true` ya estaba activo en tsconfig.app.json
- tsc compila limpio, 56/56 tests pasan, build OK

### Justificacion de los 10 `as any` en offlineStore.ts

Los 10 `as any` estan en operaciones `db.<table>.put(temp as any)` y `db.<table>.update(id, data as any)`. Son necesarios porque:

1. **`put(temp as any)`**: Los objetos temporales offline se construyen con `{ ...data, id: tempId, created_at: new Date().toISOString() }`. Dexie espera el tipo completo de la entidad (ej: `Hive` con todos los campos), pero el objeto temporal solo tiene los campos del formulario + campos generados. Es imposible construir un `Hive` completo sin los datos que el backend generaria (como relaciones `apiary: { name }`).

2. **`update(id, data as any)`**: Dexie tipifica `update()` con `UpdateSpec<T>` que requiere que cada valor sea del tipo exacto del campo. Los datos de formularios llegan como `Record<string, unknown>` (dinamicos por naturaleza). Crear tipos intermedios para cada combinacion de campos editables seria over-engineering.

**Por que es aceptable:**
- Los datos se validan en el backend cuando se sincronizan (online)
- Son solo 10 puntos de frontera Dexie ↔ datos dinamicos
- El resto del frontend (29 `: any`) SI se ha tipado estrictamente

**Referencia:** Aprendizaje 10.7 en `aprendizajes.md`

## Documentar en

- `docs/aprendizajes.md` - aprendizaje 10.9 sobre tipado estricto y null safety
- `prompts.md` - registrar prompt utilizado
