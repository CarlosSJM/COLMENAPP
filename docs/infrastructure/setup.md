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
| PostgreSQL | 5432 |

## Despliegue (Futuro)

Pendiente de definir para produccion. Opciones consideradas:
- Frontend: Vercel / Netlify
- Backend: Railway / Render / Fly.io
- BD: Supabase / Neon / Railway PostgreSQL
