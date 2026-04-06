# T2: npm audit - Resolver Vulnerabilidades

**Prioridad:** 2 (quick win)
**Esfuerzo:** 30min-1h
**Impacto en nota:** Bajo-Medio
**Tipo:** Infraestructura

## Objetivo

Resolver vulnerabilidades detectadas por npm audit en las dependencias del proyecto.

## Estado Actual

- **Frontend:** 2 vulnerabilidades (1 moderate, 1 high)
- **Backend:** Pendiente verificar (sin lockfile local para audit)

## Subtareas

- [x] Ejecutar `npm audit` en frontend y backend
- [x] Analizar cada vulnerabilidad: severidad, paquete afectado, fix disponible
- [x] Ejecutar `npm audit fix` donde sea seguro (no breaking changes)
- [x] Para vulnerabilidades sin fix automatico: evaluar alternativas o aceptar riesgo documentado
- [x] Verificar que la app sigue funcionando tras actualizar dependencias (58/58 tests OK + builds OK)
- [x] Documentar resultado final

## Resultado

### Frontend: 3 → 0 vulnerabilidades
- `brace-expansion` (moderate): resuelto con fix
- `picomatch` (high): resuelto con fix
- `vite` (high - path traversal + websocket): resuelto con fix

### Backend: 19 → 10 vulnerabilidades
Resueltas con `npm audit fix` (9 vulnerabilidades eliminadas):
- `@nestjs/core` injection via path-to-regexp: resuelto
- `ajv` ReDoS: resuelto
- `defu` prototype pollution: resuelto
- `effect` context lost: resuelto (prisma dep)
- `handlebars` multiple injection/XSS: resuelto
- `brace-expansion` parcialmente resuelto

**10 restantes (no resolubles sin breaking changes):**
- `lodash` (high): dep de @nestjs/config y @nestjs/swagger. Fix requiere downgrade a @nestjs/swagger@2.x (breaking)
- `path-to-regexp` (high): dep de @nestjs/swagger. Misma situacion
- `picomatch` (high): dep de @nestjs/cli (solo devDep, no afecta produccion)
- `brace-expansion` (moderate): dep transitiva de jest (solo devDep)

**Riesgo aceptado:** Las 10 restantes son dependencias transitivas de NestJS core packages. Se resolveran cuando NestJS publique updates compatibles. Las de devDependencies (picomatch, brace-expansion) no afectan produccion.

## Comandos

```bash
# Frontend
cd frontend && npm audit
cd frontend && npm audit fix

# Backend
cd backend && npm audit
cd backend && npm audit fix
```

## Documentar en

- `docs/aprendizajes.md` - aprendizaje sobre gestion de vulnerabilidades
- `prompts.md` - registrar prompt utilizado
