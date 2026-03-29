# Guia de Despliegue - COLMENAPP

## Arquitectura de Despliegue

```
                    GitHub (repo)
                         │
            ┌────────────┼────────────┐
            │            │            │
        Vercel       GitHub Actions   Render
      (Frontend)       (CI tests)   (Backend + BD)
            │                         │
   colmenapp.vercel.app    colmenapp-api.onrender.com
                                      │
                                 PostgreSQL
                               (Render free)
```

## Costes

| Servicio | Plan | Coste | Limitaciones |
|----------|------|-------|-------------|
| **Vercel** | Hobby (gratis) | 0€ | 100GB bandwidth/mes, sufficient para MVP |
| **Render** Web Service | Free | 0€ | Sleep tras 15min inactividad, wake-up ~30s |
| **Render** PostgreSQL | Free | 0€ | 256MB storage, expira 90 dias, luego $7/mes |
| **GitHub Actions** | Free | 0€ | 2000 min/mes en repos publicos |
| **Total MVP** | | **0€/mes** | Primer deploy gratis durante 90 dias |

**Nota sobre Render Free:**
- El backend se "duerme" tras 15 min sin requests. El primer request tras dormir tarda ~30 segundos en responder. Para una demo academica es aceptable.
- La BD gratis expira a los 90 dias. Despues hay que migrar a plan paid ($7/mes) o a Neon (gratis permanente).
- Para la entrega del proyecto, 90 dias son mas que suficientes.

---

## Plan de Despliegue

### Paso 1: Configurar Render (Backend + BD)

**1.1 Crear cuenta en Render**
- Ir a https://render.com
- Registrarse con GitHub (conecta el repo automaticamente)

**1.2 Crear base de datos PostgreSQL**
- Dashboard → New → PostgreSQL
- Configuracion:
  - Name: `colmenapp-db`
  - Database: `colmenapp`
  - User: `colmenapp`
  - Region: Frankfurt (EU) o la mas cercana
  - Plan: Free
- Anotar la **Internal Database URL** (se usara como DATABASE_URL)

**1.3 Crear Web Service (Backend)**
- Dashboard → New → Web Service
- Conectar repo GitHub: `CarlosSJM/COLMENAPP`
- Configuracion:
  - Name: `colmenapp-api`
  - Region: Misma que la BD
  - Branch: `main`
  - Root Directory: `backend`
  - Runtime: Node
  - Build Command: `npm install --include=dev && npx prisma migrate deploy && npx prisma generate && npm run build`
  - Start Command: `node dist/src/main.js`
  - Plan: Free

**1.4 Variables de entorno en Render**
En el Web Service, ir a Environment → Add Environment Variables:

```env
DATABASE_URL=postgresql://colmenapp:PASSWORD@HOST:5432/colmenapp
JWT_SECRET=GENERAR_CON_openssl_rand_base64_32
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://colmenapp.vercel.app
NODE_ENV=production
PORT=10000
```

**Importante:**
- `DATABASE_URL`: Copiar la Internal Database URL de Render (paso 1.2)
- `JWT_SECRET`: Generar uno seguro: `openssl rand -base64 32`
- `CORS_ORIGIN`: Se actualizara cuando tengamos la URL de Vercel
- `PORT`: Render usa 10000 por defecto, no 3000

**1.5 Seed inicial (solo primera vez)**
- Ir a Shell en el Web Service de Render
- Ejecutar: `npx prisma db seed`
- O incluirlo en el Build Command: `npm install && npx prisma migrate deploy && npx prisma generate && npx prisma db seed && npm run build`

---

### Paso 2: Configurar Vercel (Frontend)

**2.1 Crear cuenta en Vercel**
- Ir a https://vercel.com
- Registrarse con GitHub

**2.2 Importar proyecto**
- Dashboard → Add New → Project
- Importar repo: `CarlosSJM/COLMENAPP`
- Configuracion:
  - Framework Preset: Vite
  - Root Directory: `frontend`
  - Build Command: `npm run build` (auto-detectado)
  - Output Directory: `dist` (auto-detectado)

**2.3 Variables de entorno en Vercel**
- Settings → Environment Variables:

```env
VITE_API_URL=https://colmenapp-api.onrender.com/api/v1
```

**2.4 Anotar URL**
- Vercel asignara una URL tipo `colmenapp-xxx.vercel.app`
- Volver a Render y actualizar `CORS_ORIGIN` con esta URL exacta

---

### Paso 3: Configurar GitHub Actions (CI)

**3.1 Crear workflow**

Archivo: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: colmenapp
          POSTGRES_PASSWORD: colmenapp_test
          POSTGRES_DB: colmenapp_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: backend/package-lock.json

      - name: Install backend dependencies
        working-directory: backend
        run: npm ci

      - name: Run Prisma migrations
        working-directory: backend
        env:
          DATABASE_URL: postgresql://colmenapp:colmenapp_test@localhost:5432/colmenapp_test
        run: npx prisma migrate deploy

      - name: Run unit tests
        working-directory: backend
        env:
          DATABASE_URL: postgresql://colmenapp:colmenapp_test@localhost:5432/colmenapp_test
          JWT_SECRET: test-secret-for-ci
        run: npx jest src/**/*.service.spec.ts --forceExit

      - name: Run e2e tests
        working-directory: backend
        env:
          DATABASE_URL: postgresql://colmenapp:colmenapp_test@localhost:5432/colmenapp_test
          JWT_SECRET: test-secret-for-ci
        run: npx jest --config test/jest-e2e.json --forceExit

  frontend-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install frontend dependencies
        working-directory: frontend
        run: npm ci

      - name: Build frontend
        working-directory: frontend
        run: npm run build
```

---

### Paso 4: Verificacion Post-Deploy

**Checklist:**

- [ ] Backend responde: `curl https://colmenapp-api.onrender.com/api/v1/auth/login` (debe dar 401, no 404)
- [ ] Frontend carga: abrir `https://colmenapp.vercel.app` en navegador
- [ ] Login funciona: demo@colmenapp.com / 123456
- [ ] CORS correcto: el frontend puede hacer requests al backend
- [ ] PWA instalable: Chrome muestra opcion "Instalar"
- [ ] Datos del seed visibles: apiarios, colmenas, inspecciones

---

## Despliegue Manual (Alternativa)

Si Vercel o Render no funcionan, se puede hacer deploy manual:

### Frontend: GitHub Pages

```bash
cd frontend
npm run build
# Subir contenido de dist/ a GitHub Pages
# O usar gh-pages: npx gh-pages -d dist
```

### Backend: Cualquier VPS con Node.js

```bash
# En el servidor
git clone https://github.com/CarlosSJM/COLMENAPP.git
cd COLMENAPP/backend
npm install
cp .env.example .env  # Editar con datos reales
npx prisma migrate deploy
npx prisma db seed
npm run build
node dist/main.js
# Usar PM2 para mantener corriendo: pm2 start dist/main.js
```

### Base de datos: Neon (alternativa gratuita permanente)

Si la BD gratis de Render expira (90 dias):
- Crear cuenta en https://neon.tech
- Crear proyecto → copiar connection string
- Actualizar DATABASE_URL en Render

---

## Diagrama de Flujo de Deploy

```
Developer                 GitHub                    Servicios
    │                        │                         │
    ├── git push main ──────►│                         │
    │                        ├── GitHub Actions ──────►│ Tests (58)
    │                        │   (CI: build + test)    │
    │                        │                         │
    │                        ├── Webhook ─────────────►│ Vercel
    │                        │   (auto-deploy front)   │ Build + Deploy
    │                        │                         │
    │                        ├── Webhook ─────────────►│ Render
    │                        │   (auto-deploy back)    │ Build + Migrate + Deploy
    │                        │                         │
    │                        │                    ┌────┤
    │                        │                    │    │ colmenapp.vercel.app
    │                        │                    │    │ colmenapp-api.onrender.com
    │◄────────────────────────────────────────────┘    │
    │   URLs publicas listas                           │
```

## Rollback

Si algo falla tras un deploy:

**Vercel:** Dashboard → Deployments → Click en deploy anterior → "Promote to Production"

**Render:** Dashboard → Events → Click en deploy anterior → "Rollback"

Ambos mantienen historial de deploys y permiten volver atras en segundos.
