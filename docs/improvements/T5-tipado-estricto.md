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

## Documentar en

- `docs/aprendizajes.md` - aprendizaje sobre tipado estricto en React/TS
- `prompts.md` - registrar prompt utilizado
