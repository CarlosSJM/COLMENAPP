# Infraestructura y Entorno

## Requisitos

| Herramienta | Version |
|-------------|---------|
| Node.js | 20.x |
| npm | 10.x |
| Docker + Docker Compose | Ultima estable |
| PostgreSQL (via Docker) | 16 Alpine |

## Docker Compose

Archivo: `/COLMENAPP/docker-compose.yml`

Levanta PostgreSQL localmente:

```bash
docker compose up -d
```

### Servicios

| Servicio | Imagen | Puerto | Credenciales |
|----------|--------|--------|-------------|
| postgres | postgres:16-alpine | 5432 | colmenapp / colmenapp_dev |

### Volumen persistente
- `postgres_data` para datos de PostgreSQL

## Variables de Entorno

Archivo: `/COLMENAPP/.env.example`

```env
# Database
DATABASE_URL="postgresql://colmenapp:colmenapp_dev@localhost:5432/colmenapp"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="24h"

# App
NODE_ENV="development"
PORT=3000
```

**Nota**: Copiar `.env.example` a `.env` y ajustar valores para cada entorno.

## Entorno de Desarrollo Local

### Pasos para levantar el entorno

```bash
# 1. Levantar base de datos
docker compose up -d

# 2. Backend
cd backend
cp ../.env.example .env
npm install
npx prisma migrate dev
npm run start:dev

# 3. Frontend
cd frontend
npm install
npm run dev
```

### Puertos

| Servicio | Puerto |
|----------|--------|
| Frontend (Vite) | 5173 |
| Backend (NestJS) | 3000 |
| PostgreSQL | 5434 |
| Swagger API Docs | 3000/api/docs |

## Swagger API Documentation

### Acceso
- **URL local:** http://localhost:3000/api/docs
- **URL produccion:** https://[backend-url]/api/docs
- **Credenciales:** `colmenapp` / `1234colmenapp`

### Que incluye
- Documentacion interactiva de los 33 endpoints
- Agrupados por tags: Auth, Apiaries, Hives, Inspections, Production, Tasks, Dashboard
- Boton "Authorize" para introducir JWT token y probar endpoints protegidos
- Schemas de DTOs auto-generados desde class-validator

### Como probar un endpoint protegido
1. Abrir `/api/docs` e introducir credenciales basic auth
2. Ejecutar POST `/api/v1/auth/login` con email y password
3. Copiar el `access_token` de la respuesta
4. Click en boton "Authorize" (candado) arriba a la derecha
5. Pegar el token en el campo "Value" (sin "Bearer ", solo el token)
6. Click "Authorize"
7. Ahora todos los endpoints protegidos funcionan

### Variables de entorno
```env
SWAGGER_USER=colmenapp          # Usuario basic auth (default: colmenapp)
SWAGGER_PASSWORD=1234colmenapp  # Password basic auth (default: 1234colmenapp)
```

### Implementacion tecnica
- Libreria: `@nestjs/swagger` (auto-genera desde decoradores)
- Proteccion: `express-basic-auth` (basic auth HTTP)
- Rutas protegidas: `/api/docs`, `/api/docs-json`, `/api/docs-yaml`
- Decoradores usados: `@ApiTags()`, `@ApiBearerAuth('JWT')`

## Despliegue

Pendiente de definir para produccion. Opciones consideradas:
- Frontend: Vercel / Netlify
- Backend: Railway / Render / Fly.io
- BD: Supabase / Neon / Railway PostgreSQL

## CORS - Configuracion Critica para Produccion

### Situacion actual (desarrollo)

En `backend/src/main.ts` el CORS esta configurado asi:

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
});
```

En desarrollo funciona porque el frontend esta en `localhost:5173`. Pero al subir a produccion, el dominio del frontend sera diferente (ej: `https://colmenapp.vercel.app`).

### Que hacer al desplegar

**1. Variable de entorno `CORS_ORIGIN`:**

Debe configurarse en el servicio de hosting del backend con el dominio real del frontend:

```env
# En el hosting del backend (Railway, Render, etc.)
CORS_ORIGIN=https://colmenapp.vercel.app
```

**2. Si el frontend tiene multiples dominios** (ej: produccion + preview):

Modificar `main.ts` para aceptar multiples origenes:

```typescript
app.enableCors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  credentials: true,
});
```

Y configurar:
```env
CORS_ORIGIN=https://colmenapp.vercel.app,https://preview-colmenapp.vercel.app
```

**3. NUNCA en produccion:**

```typescript
// PELIGROSO - acepta requests de cualquier sitio web
app.enableCors();

// PELIGROSO - lo mismo explicitamente
app.enableCors({ origin: '*' });
```

Esto permitiria que cualquier sitio malicioso haga requests a la API usando las cookies/tokens del usuario.

### Checklist de despliegue CORS

- [ ] Configurar `CORS_ORIGIN` con el dominio exacto del frontend
- [ ] Verificar que el frontend puede hacer login (POST /auth/login)
- [ ] Verificar que las peticiones con JWT funcionan (GET /apiaries)
- [ ] Verificar que un dominio no autorizado recibe error CORS
- [ ] Si se usa HTTPS (obligatorio en produccion), el CORS_ORIGIN debe usar `https://`

### Variables de entorno necesarias en produccion

```env
# Base de datos (proporcionada por el hosting)
DATABASE_URL=postgresql://user:password@host:5432/colmenapp

# JWT (CAMBIAR el secret por uno seguro)
JWT_SECRET=un-secret-largo-y-aleatorio-generado-con-openssl-rand
JWT_EXPIRES_IN=24h

# CORS (dominio del frontend)
CORS_ORIGIN=https://colmenapp.vercel.app

# App
NODE_ENV=production
PORT=3000
```

**Importante:** El `JWT_SECRET` de produccion debe ser diferente al de desarrollo y generado de forma segura:
```bash
openssl rand -base64 32
```
