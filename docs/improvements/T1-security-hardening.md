# T1: Security Hardening Backend

**Prioridad:** 1 (quick win)
**Esfuerzo:** 1-2h
**Impacto en nota:** Medio
**Tipo:** Backend

## Objetivo

Endurecer la seguridad del backend en produccion con headers HTTP y rate limiting, como recomienda el feedback.

## Estado Actual

- No hay paquetes de seguridad instalados (ni helmet ni throttler)
- CORS ya restringido a `https://colmenapp.vercel.app`
- Swagger protegido con basic auth
- JWT implementado correctamente

## Subtareas

- [x] Instalar y configurar `helmet` para security headers
  - XSS protection
  - HSTS (HTTP Strict Transport Security)
  - Content-Type sniffing prevention
  - Frameguard (clickjacking)
- [x] Instalar y configurar `@nestjs/throttler` para rate limiting
  - Rate limit global: 100 req/min
  - Rate limit en `/auth/login` y `/auth/register`: 5 req/min (proteger brute force)
- [x] Verificar que CORS sigue restringido tras cambios
- [x] Testear que los endpoints responden correctamente con las nuevas protecciones (58/58 tests OK)
- [x] Tests e2e no requieren cambios (34/34 pasan)

## Paquetes a Instalar

```bash
cd backend
npm install helmet @nestjs/throttler
```

## Cambios en Codigo

**`backend/src/main.ts`:**
- Agregar `app.use(helmet())` antes de los middlewares existentes

**`backend/src/app.module.ts`:**
- Importar `ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 100 }] })`
- Agregar `ThrottlerGuard` como guard global con `APP_GUARD`

**`backend/src/auth/auth.controller.ts`:**
- Decorator `@Throttle({ default: { ttl: 60000, limit: 5 } })` en login y register

## Documentar en

- `docs/aprendizajes.md` - nuevo aprendizaje sobre security hardening
- `docs/testing/security-review.md` - actualizar checklist
- `prompts.md` - registrar prompt utilizado
