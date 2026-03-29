# 🐝 Aplicación de Gestión Apícola - Documentación Completa

## 📋 Índice
1. [Visión General](#visión-general)
2. [Arquitectura de Datos](#arquitectura-de-datos)
3. [Módulos Principales](#módulos-principales)
4. [Stack Tecnológico](#stack-tecnológico)
5. [Roadmap de Desarrollo](#roadmap-de-desarrollo)
6. [Presupuesto y Costes](#presupuesto-y-costes)
7. [Infraestructura](#infraestructura)

---

## 🎯 Visión General

Aplicación web y móvil integral para la gestión profesional de apiarios, diseñada para apicultores que necesitan:
- Organizar múltiples apiarios y colmenas
- Registrar datos de campo de manera eficiente (incluso con guantes)
- Realizar seguimiento de salud, producción y mantenimiento
- Gestionar equipos de trabajo
- Comprar/vender productos apícolas
- Predecir enfermedades y optimizar producción con IA (futuro)

---

## 🏗️ Arquitectura de Datos

### Jerarquía
```
Cuenta Maestra (Multiusuario)
└── Apiarios
    └── Colmenas (con QR/NFC único)
        ├── Registros de Datos
        ├── Calendario de Mantenimiento
        ├── Historial de Eventos
        └── Análisis y Predicciones IA
```

---

## 📊 Módulos Principales

### 1️⃣ GESTIÓN DE APIARIOS Y COLMENAS

#### Apiarios
- Información básica: Nombre, ubicación GPS, número de colmenas
- Vista de mapa con localización
- Estadísticas generales de producción y salud
- Calendario compartido de mantenimientos
- Asignación de usuarios responsables

#### Colmenas
**Identificación única:**
- Código QR generado automáticamente (imprimible)
- Soporte para chip NFC (identificación rápida en campo)
- Número de serie único

**Ficha técnica:**
- Fecha de instalación
- Origen de la reina
- Tipo de colmena
- Estado actual (activa, cuarentena, invernada, etc.)

---

### 2️⃣ RECOGIDA DE DATOS EN CAMPO

#### Interfaz Optimizada
- **Botones grandes** (mínimo 60px) para uso con guantes
- **Controles de voz** para dictar sin tocar pantalla
- **Modo campo**: Alto contraste, fuente grande

#### Datos a Registrar

**Actividad:**
- Vuelos por minuto (contador visual)
- Peso (manual o báscula bluetooth)
- Temperatura y humedad

**Salud:**
- Contaje de varroa
- Plagas identificadas (lista check rápido)
- Tratamientos aplicados (con fecha y producto)

**Producción:**
- Cantidad de miel recolectada
- Panales operculados (conteo)
- Estado de la reina

**Notas:**
- 🎤 **Transcripción de audio**: Graba y convierte a texto
- Plantillas predefinidas + texto libre
- Fotos con geolocalización y timestamp

---

### 3️⃣ CALENDARIO Y NOTIFICACIONES

#### Tipos de Eventos
- Mantenimientos programados (revisión, tratamientos, alimentación)
- Eventos de producción (extracción de miel, polen)
- Alertas automáticas (baja actividad, peso anormal, varroa crítico)

#### Notificaciones Push
- ⏰ Recordatorios pre-evento (24h, 1h antes)
- 🚨 Alertas críticas
- ✅ Confirmaciones de equipo
- 📊 Resúmenes semanales

---

### 4️⃣ TODO LISTS Y CHECKLISTS

#### Listas Inteligentes por Actividad

**Revisión:**
- Ahumador y combustible
- Palanca, cepillo
- Traje y guantes
- Tablet/cuaderno

**Extracción de Miel:**
- Alzas vacías
- Escapes de abejas
- Extractor
- Filtros y envases

**Tratamiento:**
- Producto específico
- Equipos de protección
- Registro

#### Funcionalidades
- Templates predefinidas
- Listas personalizables
- Sincronización entre equipo
- Historial reutilizable

---

### 5️⃣ GESTIÓN MULTIUSUARIO

#### Roles y Permisos

**Administrador:**
- Acceso total
- Gestión de usuarios
- Configuración global
- Informes consolidados

**Gestor de Apiario:**
- Gestión de apiario(s) asignados
- Registro de datos
- Programación de eventos
- Reportes de zona

**Apicultor de Campo:**
- Recogida de datos
- Ver calendarios y tareas
- Registrar actividades
- Acceso limitado

#### Registro de Actividad
- Timeline de acciones (quién/qué/cuándo)
- Trazabilidad completa
- Comentarios entre usuarios
- Calendario de turnos

---

### 6️⃣ MARKETPLACE

#### Productos
- **Reinas**: Raza, edad, origen, certificaciones
- **Material Apícola**: Colmenas, herramientas, equipos
- **Productos**: Miel, polen, propóleo, cera

#### Funcionalidades
- 🔍 Búsqueda geolocalizada
- ⭐ Sistema de reputación y valoraciones
- 💬 Chat integrado vendedor-comprador
- 📦 Gestión de pedidos y seguimiento
- 🧾 Facturación automatizada

---

### 7️⃣ IDENTIFICACIÓN FÍSICA (QR/NFC)

#### Sistema QR
- Generación automática al crear colmena
- Incluye: ID, Apiario, Fecha
- PDF imprimible resistente a intemperie
- Escaneo rápido → Abrir ficha o registrar datos

#### Sistema NFC (Opcional)
- Tags pasivos resistentes (IP67)
- Lectura sin línea de visión
- No se desgasta por sol/lluvia
- Identificación inequívoca

---

### 8️⃣ ANÁLISIS DE DATOS E IA (Futuro)

#### Datos a Recopilar
- Series temporales: peso, vuelos, temperatura
- Registros de parásitos y tratamientos
- Eventos de enfermedad/mortalidad
- Correlaciones clima vs. producción

#### Funcionalidades IA

**Predicción:**
- Detección temprana de varroasis
- Riesgo de enjambrazón
- Predicción de producción
- Alertas de colapso

**Optimización:**
- Mejor momento para extracción
- Sugerencia de tratamientos
- Recomendaciones de alimentación

**Análisis de Imágenes:**
- Identificación de plagas en fotos
- Conteo automático de varroa
- Evaluación de patrón de cría

---

## 🛠️ Stack Tecnológico Recomendado

### Backend
- **Framework**: Node.js (Express) o Django
- **Base de datos**: PostgreSQL + MongoDB (multimedia)
- **Storage**: AWS S3 / Google Cloud Storage / Cloudflare R2
- **IA/ML**: Python (TensorFlow/PyTorch)

### Frontend
- **Web**: React o Vue.js
- **Móvil**: React Native o Flutter
- **UI/UX**: Material Design o custom apícola

### Servicios
- **Transcripción**: Google Cloud Speech-to-Text / Whisper API
- **Notificaciones**: Firebase Cloud Messaging
- **Mapas**: Google Maps / Mapbox
- **QR**: qrcode.js
- **NFC**: React Native NFC Manager

---

## 📈 Roadmap de Desarrollo

### 🔷 FASE 1 - MVP (3-4 meses)
**Objetivo**: Producto mínimo funcional para validación

**Funcionalidades:**
1. Gestión básica de apiarios y colmenas
2. Registro simple de datos (peso, vuelos)
3. Calendario de eventos
4. Sistema multiusuario básico
5. Generación de QR

**Entregables:**
- Web app funcional
- App móvil básica (iOS/Android)
- Sistema de autenticación
- Dashboard de usuario

---

### 🔷 FASE 2 - Funcionalidad Completa (2-3 meses)
**Objetivo**: Experiencia de usuario optimizada

**Funcionalidades:**
6. Recogida de datos avanzada con voz
7. Notificaciones push
8. TODO lists inteligentes
9. Soporte NFC
10. Versión móvil completa y optimizada

**Entregables:**
- Interfaz optimizada para campo
- Transcripción de audio funcional
- Sistema de notificaciones completo
- Modo offline con sincronización

---

### 🔷 FASE 3 - Marketplace (2 meses)
**Objetivo**: Ecosistema de compra/venta

**Funcionalidades:**
11. Sistema de compra/venta de productos
12. Gestión de pedidos y stock
13. Sistema de valoraciones y reseñas
14. Chat integrado entre usuarios

**Entregables:**
- Marketplace funcional
- Panel de vendedor
- Sistema de pagos integrado
- Gestión de transacciones

---

### 🔷 FASE 4 - Inteligencia Artificial (4-6 meses)
**Objetivo**: Predicción y optimización con IA

**Funcionalidades:**
15. Recopilación y estructuración de datos históricos
16. Modelos predictivos básicos (enfermedades)
17. Análisis de imágenes (plagas, varroa)
18. Recomendaciones automatizadas

**Entregables:**
- Data warehouse de datos apícolas
- Modelos ML entrenados
- Dashboard de predicciones
- Sistema de alertas inteligentes

⚠️ **Nota**: Esta fase requiere científico de datos especializado

---

## 💰 Presupuesto y Costes de Desarrollo

### Base de Cálculo
**Tarifa**: 45€/hora (desarrollador full-stack senior freelance España)

### Desglose por Fase

| Fase | Duración | Horas | Coste |
|------|----------|-------|-------|
| **Fase 1 - MVP** | 3-4 meses | 700h | **31.500€** |
| **Fase 2 - Completa** | 2-3 meses | 580h | **26.100€** |
| **Fase 3 - Marketplace** | 2 meses | 564h | **25.380€** |
| **Fase 4 - IA** | 4-6 meses | 1.328h | **59.760€** |
| | | | |
| **TOTAL COMPLETO** | **11-15 meses** | **3.172h** | **142.740€** |

### Opciones de Reducción de Costes

#### Opción 1: MVP Mínimo
- Solo web app (sin mobile inicial)
- Sin NFC, solo QR
- Sin transcripción de voz
- **Coste: 20.250€** (450h)

#### Opción 2: Sin IA
- Fases 1, 2 y 3 completas
- Funcionalidad operativa completa
- Marketplace funcional
- **Coste: 82.980€** (1.844h)

#### Opción 3: Desarrollo Ágil
- Lanzar Fase 1 y validar
- Iterar según feedback
- Decidir fases siguientes
- **Inversión inicial: 31.500€**

### Costes NO Incluidos
- Infraestructura (ver sección siguiente)
- Apple Developer: 99€/año
- Google Play: 25€ (único)
- Diseño UI/UX: 3.000-8.000€
- Testing QA: 5.000-10.000€
- Consultoría apícola: 2.000-5.000€

---

## 🏗️ Infraestructura y Costes Mensuales

### 🥉 OPCIÓN 1: BÁSICA (Startup/MVP)
**Ideal para**: Fase 1 - 100-500 usuarios

#### Stack
- Backend: Railway Hobby
- BD: PostgreSQL incluida
- Storage: Cloudflare R2
- Frontend: Vercel
- Mobile: Expo

#### Coste Mensual
| Servicio | Coste |
|----------|-------|
| Backend + BD (Railway) | 5€ |
| Storage (R2) | 0€ |
| Frontend (Vercel) | 0€ |
| Push (Firebase) | 0€ |
| Transcripción (Whisper) | 6€ |
| **TOTAL/MES** | **11€** |

**TOTAL AÑO 1**: 264€ (incluye Apple Dev + dominio)

#### Limitaciones
- Sin escalabilidad automática
- Backup manual
- Soporte limitado
- ~99% uptime

---

### 🥈 OPCIÓN 2: CALIDAD/PRECIO ⭐ RECOMENDADA
**Ideal para**: Fases 2-3 - 500-5.000 usuarios

#### Stack
- Backend: Railway Pro
- BD: Supabase Pro
- Storage: Cloudflare R2
- Frontend: Vercel Pro
- Mobile: Expo EAS

#### Coste Mensual
| Servicio | Coste |
|----------|-------|
| Backend (Railway Pro) | 20€ |
| BD (Supabase Pro) | 25€ |
| Storage (R2) | 1.50€ |
| Frontend (Vercel Pro) | 20€ |
| CDN (Cloudflare Pro) | 20€ |
| Cache (Redis Upstash) | 8€ |
| Mobile Builds (Expo EAS) | 29€ |
| Email (Resend Pro) | 20€ |
| Transcripción | 30€ |
| Mapas (Mapbox) | 5€ |
| Monitoring (Sentry) | 26€ |
| Logs (BetterStack) | 10€ |
| **TOTAL/MES** | **214.50€** |

**TOTAL AÑO**: 2.685€

#### Ventajas
- ✅ Escalabilidad automática
- ✅ Backups diarios automatizados
- ✅ Monitoring y alertas
- ✅ Soporte técnico 24h
- ✅ 99.9% uptime SLA
- ✅ Fácil de gestionar

---

### 🥇 OPCIÓN 3: PRODUCCIÓN ESCALABLE
**Ideal para**: Fase 4 + IA - 5.000+ usuarios

#### Stack
- Backend: AWS ECS Fargate
- BD: AWS RDS PostgreSQL
- Storage: AWS S3
- IA/ML: AWS SageMaker
- Frontend: Vercel Enterprise

#### Coste Mensual
| Categoría | Coste |
|-----------|-------|
| Compute (ECS + Lambda) | 120€ |
| BD (RDS Multi-AZ) | 180€ |
| Storage (S3 + CloudFront) | 45€ |
| Cache (ElastiCache) | 60€ |
| ML/IA (SageMaker + GPU) | 350€ |
| Frontend (Vercel Enterprise) | 150€ |
| Servicios adicionales | 380€ |
| Monitoring y seguridad | 200€ |
| **TOTAL/MES** | **1.485€** |

**TOTAL AÑO**: 17.931€

#### Ventajas
- ✅ Infraestructura enterprise-grade
- ✅ Escalabilidad masiva automática
- ✅ Multi-región (latencia global baja)
- ✅ 99.99% uptime SLA
- ✅ Soporte 24/7
- ✅ Disaster recovery

---

### 📊 Comparativa Rápida

| Aspecto | Básica | Calidad/Precio ⭐ | Escalable |
|---------|--------|-------------------|-----------|
| **Coste/mes** | 11€ | 215€ | 1.485€ |
| **Coste/año** | 264€ | 2.685€ | 17.931€ |
| **Usuarios** | 100-500 | 500-5.000 | 5.000+ |
| **Uptime** | ~99% | 99.9% | 99.99% |
| **Soporte** | Comunidad | Email 24h | 24/7 prioritario |
| **Backups** | Manual | Diario auto | Continuo |
| **Escalabilidad** | Manual | Auto | Ilimitada |
| **Setup** | 2-4h | 8-16h | 40-80h |
| **Complejidad** | Baja | Media | Alta |

---

### 🎯 Recomendación por Fase

**Fase 1 (Meses 0-6):**
- **Infraestructura BÁSICA** (11€/mes)
- Validar producto con bajo coste
- Migración sencilla si funciona

**Fases 2-3 (Meses 6-18):**
- **CALIDAD/PRECIO** (215€/mes) ⭐
- Balance perfecto
- Profesional y confiable
- Escalable para crecimiento

**Fase 4 (Mes 18+):**
- **ESCALABLE** (1.485€/mes)
- Solo si >5.000 usuarios activos
- O procesamiento IA intensivo
- O clientes enterprise

---

### 💡 Opción Serverless (Recomendada)

#### Stack
```
Backend: Supabase
Functions: Cloudflare Workers
Storage: Cloudflare R2
Frontend: Cloudflare Pages
```

#### Ventajas
- Pay-per-use real
- Escalabilidad automática infinita
- Sin servidores que mantener
- Coste inicial muy bajo

#### Coste Estimado
- 0-1.000 usuarios: **15-50€/mes**
- 1.000-5.000 usuarios: **50-150€/mes**
- 5.000-20.000 usuarios: **150-400€/mes**

**Muy recomendable para este proyecto** ✅

---

## 📈 Proyección Financiera Total (3 Años)

### Desarrollo
| Año | Fase | Coste Desarrollo |
|-----|------|------------------|
| Año 1 | Fase 1-2 | 57.600€ |
| Año 2 | Fase 3 | 25.380€ |
| Año 3 | Fase 4 (IA) | 59.760€ |
| **TOTAL** | | **142.740€** |

### Infraestructura
| Año | Fase | Usuarios | Infra/mes | Total Año |
|-----|------|----------|-----------|-----------|
| Año 1 | MVP → Fase 2 | 0 → 1.000 | 10€ → 100€ | 660€ |
| Año 2 | Fase 2-3 | 1.000 → 3.000 | 100€ → 250€ | 2.100€ |
| Año 3 | Fase 4 (IA) | 3.000 → 8.000 | 250€ → 800€ | 6.300€ |
| **TOTAL 3 AÑOS** | | | | **9.060€** |

### Resumen Total
- **Desarrollo**: 142.740€
- **Infraestructura**: 9.060€
- **Otros** (diseño, licencias, etc.): ~15.000€
- **TOTAL PROYECTO 3 AÑOS**: **~167.000€**

---

## 🎯 Recomendación Final

### Estrategia de Lanzamiento

**1. Comenzar con MVP (Fase 1)**
- Inversión inicial: **31.500€** desarrollo + **11€/mes** infra
- Validar con 20-50 apicultores beta
- Iterar según feedback real

**2. Si hay tracción → Fase 2**
- Inversión: **26.100€** + **215€/mes** infra
- Optimizar experiencia de usuario
- Crecer a 500-1.000 usuarios

**3. Con base de usuarios → Fase 3**
- Inversión: **25.380€**
- Monetizar con marketplace (comisiones)
- Generar ingresos recurrentes

**4. Con datos e ingresos → Fase 4**
- Inversión: **59.760€** + **800€/mes** infra
- Diferenciación tecnológica (IA)
- Producto premium

### Modelo de Monetización Sugerido
- **Freemium**: Hasta 5 colmenas gratis
- **Pro**: 9.90€/mes (hasta 50 colmenas)
- **Enterprise**: 49€/mes (ilimitado + soporte)
- **Marketplace**: 5-10% comisión por venta

---

## ✅ Próximos Pasos

1. **Validación de mercado**: Entrevistas con apicultores
2. **Diseño UX/UI**: Wireframes y prototipos
3. **Setup técnico inicial**: Infraestructura básica
4. **Desarrollo Fase 1**: Sprint de 3-4 meses
5. **Beta testing**: Con grupo reducido de usuarios
6. **Lanzamiento MVP**: Iteración y mejora continua

---

**Documento creado**: Diciembre 2025
**Versión**: 1.0
**Contacto**: [Tu información de contacto]

---

## 📎 ANEXO: Análisis de Mejoras y Consideraciones

> **Premisa fundamental**: Todas las decisiones tecnológicas y de producto deben priorizar **sencillez, practicidad y eficiencia**. Evitar sobre-ingeniería y complejidad innecesaria.

---

### A.1 Alcance del MVP - DEFINIDO ✅

**Decisión**: MVP enfocado en gestión profesional, monousuario, offline-first

#### Comparativa: Documento Original vs MVP Definido

| Aspecto | Doc. Original (Fase 1) | MVP Definido |
|---------|------------------------|--------------|
| **Plataforma** | Web + App móvil nativa | PWA única (web + móvil) |
| **Usuarios** | Multiusuario con roles | Monousuario |
| **Offline** | No incluido (Fase 2) | ✅ Incluido desde inicio |
| **Calendario** | Eventos y notificaciones | ❌ Excluido |
| **QR** | QR + preparación NFC | Solo QR |
| **Datos** | Básicos | Completos (varroa, tratamientos) |
| **Fotos** | Incluidas | ❌ Fase 2 |
| **Horas** | 700h | 310-350h |
| **Coste** | 31.500€ | 14.000-16.000€ |

#### Justificación de Cambios

1. **PWA en lugar de apps nativas**: Una sola base de código, instalable en móvil, sin coste de stores
2. **Monousuario inicial**: Simplifica auth y sync, suficiente para validar
3. **Offline desde el inicio**: Crítico para uso real en campo rural
4. **Sin calendario**: Complejidad alta (notificaciones push), poco valor inicial
5. **Datos completos de salud**: El usuario objetivo es profesional, necesita varroa/tratamientos
6. **Sin fotos**: Añade complejidad de storage, puede esperar a Fase 2

**Resultado**: MVP más enfocado, 55% menos horas, funcional para uso profesional real.

---

### A.2 Stack Tecnológico - DEFINIDO ✅

**Decisión**: Backend propio con NestJS + Offline-First en frontend

#### Stack Seleccionado

```
Frontend:  React 18 + Vite + TypeScript
UI:        Tailwind CSS + shadcn/ui (componentes)
PWA:       Vite PWA Plugin (Service Worker automático)
Offline:   Dexie.js (wrapper IndexedDB)
Backend:   NestJS + TypeScript
ORM:       Prisma (type-safe, migraciones fáciles)
Base datos: PostgreSQL
Auth:      Passport.js + JWT
Hosting:   Vercel (frontend) + Railway (backend + DB)
```

#### Arquitectura Offline-First

```
┌─────────────────────────────────────────────┐
│                  PWA (React)                │
├─────────────────────────────────────────────┤
│  Dexie.js (IndexedDB)  │  Cola de Sync     │
│  - Colmenas            │  - Operaciones    │
│  - Registros           │    pendientes     │
│  - Apiarios            │  - Timestamps     │
└──────────────┬─────────┴────────┬──────────┘
               │                  │
               │   Cuando hay red │
               ▼                  ▼
┌─────────────────────────────────────────────┐
│              NestJS API                     │
│  - Auth (JWT + Passport)                    │
│  - REST Controllers                         │
│  - Services (lógica de negocio)             │
│  - Prisma ORM                               │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│            PostgreSQL                       │
│  - Usuarios                                 │
│  - Apiarios                                 │
│  - Colmenas                                 │
│  - Inspecciones                             │
└─────────────────────────────────────────────┘
```

#### Justificación de Cada Elección

| Tecnología | Por qué |
|------------|---------|
| **React + Vite** | Rápido, ecosistema maduro, conocido por el desarrollador |
| **TypeScript** | Previene errores, compartir tipos frontend/backend |
| **Tailwind + shadcn/ui** | Componentes accesibles, sin CSS custom, rápido de prototipar |
| **Dexie.js** | API simple sobre IndexedDB, buen soporte de tipos |
| **NestJS** | Conocido por el desarrollador, arquitectura sólida, TypeScript nativo |
| **Prisma** | Type-safe, migraciones fáciles, buena DX |
| **PostgreSQL** | Robusto, gratuito, estándar de la industria |
| **Railway** | Deploy fácil, PostgreSQL incluido, buen free tier |

#### Estructura Backend (NestJS)

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   ├── apiaries/
│   │   ├── apiaries.module.ts
│   │   ├── apiaries.controller.ts
│   │   └── apiaries.service.ts
│   ├── hives/
│   │   ├── hives.module.ts
│   │   ├── hives.controller.ts
│   │   └── hives.service.ts
│   ├── inspections/
│   │   ├── inspections.module.ts
│   │   ├── inspections.controller.ts
│   │   └── inspections.service.ts
│   ├── sync/
│   │   ├── sync.module.ts
│   │   ├── sync.controller.ts
│   │   └── sync.service.ts
│   ├── prisma/
│   │   └── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── test/
└── package.json
```

#### Endpoints API (REST)

```
Auth:
  POST   /auth/register
  POST   /auth/login
  POST   /auth/refresh
  GET    /auth/me

Apiaries:
  GET    /apiaries
  GET    /apiaries/:id
  POST   /apiaries
  PATCH  /apiaries/:id
  DELETE /apiaries/:id

Hives:
  GET    /apiaries/:apiaryId/hives
  GET    /hives/:id
  POST   /hives
  PATCH  /hives/:id
  DELETE /hives/:id

Inspections:
  GET    /hives/:hiveId/inspections
  GET    /inspections/:id
  POST   /inspections
  PATCH  /inspections/:id
  DELETE /inspections/:id

Sync:
  POST   /sync/push    (enviar cambios locales)
  GET    /sync/pull    (obtener cambios desde timestamp)
```

#### Flujo de Sincronización

```
1. Usuario crea/edita registro
   └── Se guarda en IndexedDB con:
       - id: UUID local
       - syncStatus: 'pending'
       - updatedAt: timestamp

2. Hook detecta conexión (navigator.onLine + fetch test)
   └── Si hay red:
       - POST /sync/push con array de cambios pendientes
       - Backend procesa y responde con IDs confirmados
       - Marca syncStatus: 'synced' en local

3. Al abrir app con conexión
   └── GET /sync/pull?since=<lastSyncTimestamp>
   └── Backend devuelve cambios desde esa fecha
   └── Merge con datos locales
```

#### Gestión de Conflictos (estrategia simple)

```
Regla: Último escritor gana (last-write-wins)

- Cada registro tiene campo updatedAt
- Si conflicto: el timestamp más reciente prevalece
- Para MVP es suficiente (monousuario inicial)
```

#### Dependencias Frontend

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-router-dom": "^6.x",
    "dexie": "^4.x",
    "dexie-react-hooks": "^1.x",
    "@tanstack/react-query": "^5.x",
    "axios": "^1.x",
    "i18next": "^23.x",
    "react-i18next": "^14.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "vite-plugin-pwa": "^0.17.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x"
  }
}
```

#### Dependencias Backend

```json
{
  "dependencies": {
    "@nestjs/common": "^10.x",
    "@nestjs/core": "^10.x",
    "@nestjs/platform-express": "^10.x",
    "@nestjs/passport": "^10.x",
    "@nestjs/jwt": "^10.x",
    "@prisma/client": "^5.x",
    "passport": "^0.7.x",
    "passport-jwt": "^4.x",
    "passport-local": "^1.x",
    "bcrypt": "^5.x",
    "class-validator": "^0.14.x",
    "class-transformer": "^0.5.x"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.x",
    "prisma": "^5.x",
    "typescript": "^5.x"
  }
}
```

#### Costes de Infraestructura - DEFINIDO ✅

**Opción elegida**: Vercel (frontend) + Railway (backend + PostgreSQL)

| Servicio | Tier | Coste/mes |
|----------|------|-----------|
| Vercel (frontend) | Free | 0€ |
| Railway (backend) | Hobby ($5 crédito gratis) | ~5€ |
| Railway (PostgreSQL) | Incluido en Hobby | 0€ |
| Dominio | .com/.es | ~1€ |
| **Total MVP** | | **~5-6€/mes** |

---

#### Escalado de Precios por Crecimiento

**Vercel (Frontend)**

| Tier | Límites | Coste/mes |
|------|---------|-----------|
| Hobby | 100GB bandwidth | 0€ |
| Pro | 1TB bandwidth, equipo | 20€ |

**Railway (Backend + DB)**

| Tier | Límites | Coste/mes |
|------|---------|-----------|
| Hobby | $5 crédito, 512MB RAM, 1GB DB | ~5€ |
| Pro | Pay-as-you-go, sin límites | Variable |

---

#### Proyección por Usuarios Activos

| Usuarios | Visitas/mes | Vercel | Railway | **Total** |
|----------|-------------|--------|---------|-----------|
| 1-100 | <10k | 0€ | ~5€ | **~5€** |
| 100-500 | 10k-50k | 0€ | ~10€ | **~10€** |
| 500-1.000 | 50k-100k | 20€ | ~25€ | **~45€** |
| 1.000-5.000 | 100k-500k | 20€ | ~60€ | **~80€** |
| 5.000-10.000 | 500k-1M | 20€ | ~150€ | **~170€** |
| 10.000+ | >1M | 20€+ | ~300€+ | **~320€+** |

---

#### Puntos de Migración

| Señal | Acción Recomendada |
|-------|---------------------|
| Railway >100€/mes | Evaluar VPS (Hetzner ~20-40€) |
| PostgreSQL >50GB | Considerar Neon o Supabase DB |
| >10.000 usuarios | AWS/GCP con instancias reservadas |

*Nota: VPS es más barato pero requiere conocimientos DevOps (configuración, backups, seguridad).*

---

#### Estrategia de Infraestructura Recomendada

```
Fase MVP (0-500 usuarios):
  Vercel Free + Railway Hobby = ~5€/mes

Fase Crecimiento (500-2.000 usuarios):
  Vercel Pro + Railway Pro = ~50-80€/mes

Fase Escala (2.000+ usuarios):
  Evaluar migración a VPS = ~40-80€/mes
```

**Principio**: No optimizar para escala que no existe. Empezar barato, ajustar con datos reales.

---

### A.3 Modo Offline - DEFINIDO ✅

**Decisión**: Incluido en MVP como requisito core (no Fase 2)

**Tecnología seleccionada**: Dexie.js + Service Worker (ver A.2)

#### Comportamiento Esperado

| Situación | Qué ocurre |
|-----------|------------|
| Primera visita | Requiere conexión para descargar app y datos |
| Visitas posteriores sin red | App carga desde caché, datos desde IndexedDB |
| Crear registro sin red | Se guarda local con `syncStatus: pending` |
| Recuperar conexión | Sync automático en background |
| Conflicto de datos | Last-write-wins (timestamp más reciente) |

#### Indicadores UI Requeridos

```
┌─────────────────────────────────┐
│ 🔴 Sin conexión                 │  ← Banner visible
│ 3 cambios pendientes de sync   │
└─────────────────────────────────┘
```

#### Limitaciones Aceptadas para MVP

- Fotos se guardan local, suben cuando hay red (pueden ocupar espacio)
- Sin sync en tiempo real entre dispositivos (es monousuario inicial)
- Primer uso requiere conexión obligatoria

#### Retención de Datos Local

```
Política: Últimos 30 días en dispositivo

- Inspecciones > 30 días se eliminan de IndexedDB
- Historial completo disponible con conexión (consulta al servidor)
- Limpieza automática al sincronizar
- Reduce uso de almacenamiento en móviles
```

#### Resolución de Conflictos (MVP)

```
Estrategia: Último escritor gana (last-write-wins)

- Campo updatedAt determina versión más reciente
- Simple, sin intervención del usuario
- Riesgo: puede perder cambios si edición simultánea
- Aceptable para MVP monousuario
- Revisar en Fase 2 (multiusuario) si necesita mejora
```

---

### A.4 Transcripción de Voz - Consideraciones Prácticas

**Problema identificado:**
La transcripción es central para UX con guantes, pero depende de conectividad y tiene coste variable.

**Alternativas más simples:**
1. **Whisper local** (on-device): Sin coste por uso, funciona offline, pero requiere más recursos del dispositivo
2. **Grabación + transcripción diferida**: Grabar audio, transcribir cuando haya WiFi
3. **Comandos de voz predefinidos**: En lugar de texto libre, reconocer comandos específicos ("peso 15 kilos", "varroa alta")

**Recomendación**: Empezar con opción 2 o 3, más simple y económica.

---

### A.5 Marketplace - Evaluar Necesidad Real

**Problema identificado:**
- Requiere masa crítica de usuarios (efecto red)
- Compliance legal complejo (PSD2, facturación)
- Compite con plataformas gratuitas existentes (Wallapop, grupos de Facebook)

**Recomendación:**
1. **Validar demanda** antes de construir: ¿Los apicultores pagarían comisión?
2. **Alternativa simple**: Tablón de anuncios sin transacciones integradas
3. **Considerar excluir** de roadmap inicial y evaluar post-lanzamiento

**Principio**: No construir features que requieren escala para funcionar cuando aún no hay usuarios.

---

### A.6 Inteligencia Artificial - Dependencias No Resueltas

**Problema identificado:**
- Requiere científico de datos (no presupuestado)
- Necesita volumen de datos históricos significativo
- ROI incierto sin validación previa

**Propuesta práctica:**
1. **Fase 1-3**: Diseñar esquema de datos pensando en ML futuro (sin implementar ML)
2. **Recopilar datos**: Mínimo 12-18 meses de datos de 100+ colmenas antes de entrenar modelos
3. **Evaluar en Fase 4**: Con datos reales, decidir si ML aporta valor vs. reglas simples

**Alternativa simple**: Alertas basadas en reglas (ej: "peso bajó 20% en 3 días") pueden cubrir 80% de casos sin ML.

---

### A.7 Estimaciones de Coste - ACTUALIZADO ✅

#### MVP Definido vs Documento Original

| Concepto | Doc. Original | MVP Definido | Ahorro |
|----------|---------------|--------------|--------|
| **Fase 1 (MVP)** | 700h / 31.500€ | 350h / 15.750€ | 50% |
| **Infraestructura/mes** | 11€ | ~1€ | 91% |
| **Infra primer año** | 264€ | ~12€ + dominio | 95% |

#### Desglose MVP Definido

**Frontend (React + PWA)**

| Módulo | Horas | Coste (45€/h) |
|--------|-------|---------------|
| Setup (Vite, PWA, Dexie, Tailwind) | 12h | 540€ |
| Offline (Dexie, sync, cola) | 40h | 1.800€ |
| Auth (pantallas login/registro) | 12h | 540€ |
| CRUD Apiarios (UI) | 16h | 720€ |
| CRUD Colmenas (UI) | 20h | 900€ |
| Inspecciones (UI + formularios) | 32h | 1.440€ |
| QR (generación + scanner) | 16h | 720€ |
| Dashboard | 16h | 720€ |
| Exportación CSV | 8h | 360€ |
| UI/UX responsive | 32h | 1.440€ |
| i18n (multi-idioma) | 16h | 720€ |
| **Subtotal Frontend** | **220h** | **9.900€** |

**Backend (NestJS + Prisma)**

| Módulo | Horas | Coste (45€/h) |
|--------|-------|---------------|
| Setup (NestJS, Prisma, PostgreSQL) | 8h | 360€ |
| Auth (Passport, JWT, bcrypt) | 20h | 900€ |
| Módulo Users | 8h | 360€ |
| Módulo Apiaries (CRUD + validación) | 16h | 720€ |
| Módulo Hives (CRUD + validación) | 20h | 900€ |
| Módulo Inspections (CRUD + validación) | 24h | 1.080€ |
| Módulo Sync (push/pull) | 16h | 720€ |
| Prisma schema + migraciones | 8h | 360€ |
| **Subtotal Backend** | **120h** | **5.400€** |

**Común**

| Módulo | Horas | Coste (45€/h) |
|--------|-------|---------------|
| Testing (frontend + backend) | 40h | 1.800€ |
| Deploy y configuración | 12h | 540€ |
| **Subtotal Común** | **52h** | **2.340€** |

**Resumen**

| Parte | Horas | Coste |
|-------|-------|-------|
| Frontend | 220h | 9.900€ |
| Backend | 120h | 5.400€ |
| Común | 52h | 2.340€ |
| **TOTAL MVP** | **392h** | **17.640€** |
| Buffer 15% | +59h | +2.650€ |
| **TOTAL CON BUFFER** | **~450h** | **~20.000€** |

#### Infraestructura MVP

| Servicio | Coste/mes | Coste/año |
|----------|-----------|-----------|
| Railway (backend + DB) | 0-5€ | 0-60€ |
| Vercel Free | 0€ | 0€ |
| Dominio .es | ~1€ | ~12€ |
| **TOTAL** | **~5-10€** | **~60-120€** |

*Railway Hobby incluye $5 crédito/mes. Para MVP con poco tráfico puede ser suficiente.*

#### Fases Posteriores (Estimación Revisada)

| Fase | Funcionalidades | Horas | Coste |
|------|-----------------|-------|-------|
| **Fase 2** | Fotos, voz, multiusuario, calendario | 200-250h | 9.000-11.250€ |
| **Fase 3** | Marketplace básico | 300-400h | 13.500-18.000€ |
| **Fase 4** | IA/ML | 400-600h | 18.000-27.000€ |

#### Resumen Proyecto Completo (Revisado)

| Escenario | Alcance | Coste Total |
|-----------|---------|-------------|
| **Solo MVP** | Gestión completa, monousuario | ~20.000€ |
| **MVP + Fase 2** | + fotos, multiusuario, calendario | ~32.000€ |
| **Hasta Fase 3** | + marketplace | ~50.000€ |
| **Proyecto completo** | + IA | ~77.000€ |

*Nota: Con NestJS hay ~60h más de desarrollo que con BaaS, pero se gana control total y conocimiento del stack*

---

### A.8 Preguntas de Validación - RESUELTO ✅

| Área | Pregunta | Respuesta |
|------|----------|-----------|
| **Usuario objetivo** | ¿Hobby o profesional? | **Profesional (100+ colmenas)** |
| **Geografía** | ¿España solo? ¿Multi-idioma? | **Multi-idioma desde inicio** |
| **Competencia** | ¿Por qué no apps existentes? | **Proyecto aprendizaje/negocio** |
| **Validación** | ¿Entrevistas con apicultores? | **Sí, hay feedback real** |
| **Integraciones** | ¿Básculas/sensores? | **Futuro, no MVP** (entrada manual) |

---

#### Implicación: Internacionalización (i18n)

**Decisión**: Preparar multi-idioma desde el inicio

**Impacto en MVP**:
- Añade ~16-24h de desarrollo
- Todos los textos en ficheros de traducción (no hardcoded)
- Idioma inicial: Español
- Estructura lista para añadir: Inglés, Portugués, Francés...

**Stack i18n recomendado**:
```
react-i18next + i18next
```

**Estructura de archivos**:
```
src/
└── locales/
    ├── es/
    │   └── translation.json
    └── en/
        └── translation.json  (vacío inicial, para futuro)
```

**Ejemplo de uso**:
```typescript
// En lugar de:
<h1>Mis Apiarios</h1>

// Usar:
<h1>{t('apiaries.title')}</h1>

// locales/es/translation.json
{
  "apiaries": {
    "title": "Mis Apiarios",
    "empty": "No tienes apiarios. Crea el primero."
  }
}
```

**Coste adicional**: ~1.000€ (20-24h) sobre estimación base
**Beneficio**: Preparado para escalar a otros mercados sin reescribir

---

### A.9 MVP Definido - DEFINIDO ✅

**Perfil objetivo**: Apicultor profesional con 100+ colmenas, múltiples apiarios

**Objetivo**: App funcional para gestión real en ~350-400h de desarrollo

---

#### ✅ INCLUIDO EN MVP

**1. Autenticación**
- Login con email/password (NestJS + Passport.js + JWT)
- Recuperación de contraseña
- Sesión persistente

**2. Gestión de Apiarios**
- CRUD apiarios (crear, ver, editar, eliminar)
- Nombre, ubicación (texto), notas
- Listado con conteo de colmenas por apiario
- Ubicación GPS (opcional, si el usuario lo permite)

**3. Gestión de Colmenas**
- CRUD colmenas dentro de cada apiario
- Identificador único (número/código)
- Estado: activa, inactiva, cuarentena, pérdida
- Fecha de instalación
- Origen de la reina (texto libre)
- Generación de código QR (imprimible)

**4. Registro de Inspecciones**
- Fecha y hora (automático)
- Colmena inspeccionada
- Datos de actividad:
  - Peso (kg) - entrada manual
  - Nivel de actividad (bajo/medio/alto)
- Datos de salud:
  - Conteo de varroa (número)
  - Presencia de plagas (checklist: varroa, polilla, hormigas, otro)
  - Estado general (bueno/regular/malo)
- Datos de tratamiento:
  - Tratamiento aplicado (sí/no)
  - Producto usado (texto)
  - Dosis (texto)
- Notas libres (texto)

**5. Historial**
- Ver todas las inspecciones de una colmena
- Filtrar por fecha
- Ver evolución (lista cronológica)

**6. QR Scanner**
- Escanear QR → abrir ficha de colmena
- Acceso rápido a "Nueva inspección"

**7. Offline**
- Funciona sin conexión (tras primera carga)
- Sync automático al recuperar red
- Indicador visual de estado de conexión
- Contador de cambios pendientes

**8. Exportación**
- Exportar datos a CSV
- Por apiario o todas las colmenas

**9. Dashboard Simple**
- Total colmenas por estado
- Últimas inspecciones realizadas
- Colmenas sin inspeccionar (>30 días)

---

#### ❌ EXCLUIDO DEL MVP (Fases posteriores)

| Funcionalidad | Razón de exclusión | Fase sugerida |
|---------------|-------------------|---------------|
| Fotos | Añade complejidad de storage, puede esperar | Fase 2 |
| Transcripción de voz | Dependencia externa, coste variable | Fase 2 |
| Multiusuario/roles | MVP es monousuario, validar primero | Fase 2 |
| Calendario/recordatorios | Notificaciones push complejas | Fase 2 |
| NFC | Hardware específico, QR es suficiente | Fase 2+ |
| Mapas interactivos | Google Maps API, coste, complejidad | Fase 2 |
| Gráficos/estadísticas avanzadas | Después de tener datos reales | Fase 2 |
| Marketplace | Requiere masa crítica de usuarios | Fase 3 o nunca |
| IA/ML | Requiere datos históricos | Fase 4 o nunca |

---

#### Estructura de Pantallas MVP

```
├── Login / Registro
├── Dashboard (inicio)
│   ├── Resumen general
│   └── Accesos rápidos
├── Apiarios
│   ├── Lista de apiarios
│   ├── Detalle apiario
│   │   └── Lista de colmenas
│   └── Crear/Editar apiario
├── Colmenas
│   ├── Detalle colmena
│   │   ├── Info general
│   │   ├── Historial inspecciones
│   │   └── QR code
│   ├── Crear/Editar colmena
│   └── Nueva inspección
├── Scanner QR
├── Exportar datos
└── Configuración
    ├── Perfil
    └── Cerrar sesión
```

---

#### Modelo de Datos MVP

```typescript
// Apiario
{
  id: uuid
  userId: uuid
  name: string
  location: string
  gpsLat?: number
  gpsLng?: number
  notes?: string
  createdAt: timestamp
  updatedAt: timestamp
  syncStatus: 'pending' | 'synced'
}

// Colmena
{
  id: uuid
  apiaryId: uuid
  code: string (único por usuario)
  status: 'active' | 'inactive' | 'quarantine' | 'lost'
  installedAt?: date
  queenOrigin?: string
  notes?: string
  createdAt: timestamp
  updatedAt: timestamp
  syncStatus: 'pending' | 'synced'
}

// Inspección
{
  id: uuid
  hiveId: uuid
  inspectedAt: timestamp
  weight?: number
  activityLevel?: 'low' | 'medium' | 'high'
  varroaCount?: number
  ppiague: string[] (checklist)
  healthStatus?: 'good' | 'regular' | 'bad'
  treatmentApplied: boolean
  treatmentProduct?: string
  treatmentDose?: string
  notes?: string
  createdAt: timestamp
  syncStatus: 'pending' | 'synced'
}
```

---

#### Estimación de Esfuerzo

| Parte | Módulos | Horas |
|-------|---------|-------|
| **Frontend** | Setup, Offline, Auth UI, CRUDs, QR, Dashboard, i18n | 220h |
| **Backend** | NestJS setup, Auth, Módulos CRUD, Sync, Prisma | 120h |
| **Común** | Testing, Deploy | 52h |
| **TOTAL BASE** | | **392h** |
| **Buffer 15%** | | +59h |
| **TOTAL** | | **~450h** |

*Ver desglose completo en sección A.7*

**Coste estimado**: ~20.000€ (450h a 45€/h con buffer)
**Tiempo**: 3-4 meses (dedicación parcial) o 8-10 semanas (tiempo completo)

---

#### Criterios de "MVP Terminado"

- [ ] Usuario puede registrarse y hacer login
- [ ] Usuario puede crear apiarios y colmenas
- [ ] Usuario puede registrar inspecciones completas
- [ ] App funciona offline y sincroniza correctamente
- [ ] QR se genera y escanea correctamente
- [ ] Datos se pueden exportar a CSV
- [ ] UI es usable en móvil con pantalla pequeña
- [ ] Funciona en Chrome, Safari, Firefox (móvil y desktop)

---

### A.10 Principios de Diseño Recomendados

1. **YAGNI** (You Aren't Gonna Need It): No construir features "por si acaso"
2. **Offline-first**: Asumir que no hay conexión, sorprenderse cuando la hay
3. **Una base de código**: PWA antes que apps nativas separadas
4. **Stack conocido sobre tendencias**: Usar tecnologías que dominas (NestJS) sobre novedades
5. **Validar antes de escalar**: No optimizar para 10.000 usuarios cuando hay 10
6. **Datos sobre features**: Mejor recopilar buenos datos que tener muchas funciones

---

### A.11 Documentos del Proyecto

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| `app_apicultura.md` | Documentación técnica completa | Desarrollo interno |
| `propuesta_cliente_mvp.md` | Propuesta comercial del MVP | Cliente |

---

### A.12 Próximos Pasos - PENDIENTE

#### Fase de Preparación (antes de codificar)

- [ ] **Resolver preguntas pendientes** - Aclarar dudas adicionales sobre el proyecto
- [ ] **Diseño de base de datos** - Crear Prisma schema detallado
- [ ] **Wireframes básicos** - Bocetos de las 12 pantallas principales

#### Fase de Setup (inicio desarrollo)

- [ ] **Crear estructura del proyecto**
  - Monorepo o repos separados (frontend/backend)
  - Carpetas y arquitectura base

- [ ] **Setup Frontend**
  - Vite + React + TypeScript
  - Tailwind + shadcn/ui
  - PWA config (vite-plugin-pwa)
  - Dexie.js schema
  - i18next config
  - React Router

- [ ] **Setup Backend**
  - NestJS proyecto base
  - Prisma + PostgreSQL
  - Passport.js + JWT
  - Variables de entorno
  - Docker para desarrollo local (opcional)

- [ ] **Setup Infraestructura**
  - Crear cuenta Railway
  - Crear cuenta Vercel
  - Configurar PostgreSQL en Railway
  - Configurar dominio (opcional MVP)

#### Fase de Desarrollo MVP

- [ ] Backend: Auth (registro, login, JWT)
- [ ] Backend: CRUD Apiarios
- [ ] Backend: CRUD Colmenas
- [ ] Backend: CRUD Inspecciones
- [ ] Backend: Endpoints Sync
- [ ] Frontend: Auth screens
- [ ] Frontend: Dashboard
- [ ] Frontend: Apiarios (lista, detalle, form)
- [ ] Frontend: Colmenas (lista, detalle, form)
- [ ] Frontend: Inspecciones (form, historial)
- [ ] Frontend: QR (generación + scanner)
- [ ] Frontend: Offline + Sync
- [ ] Frontend: Exportar CSV
- [ ] Testing
- [ ] Deploy

---

**Anexo creado**: Diciembre 2025
**Última actualización**: Enero 2026
**Propósito**: Documentar consideraciones para revisión antes de inicio de desarrollo
