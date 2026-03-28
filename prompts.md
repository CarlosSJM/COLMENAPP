# COLMENAPP - Registro de Prompts

## Índice

1. [Descripción general del producto](#1-descripción-general-del-producto) (3 prompts)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema) (3 prompts)
3. [Diseño UI/UX](#3-diseño-uiux) (4 prompts)
4. [Modelo de datos](#4-modelo-de-datos) (2 prompts)
5. [Infraestructura y entorno](#5-infraestructura-y-entorno) (1 prompt)
6. [Documentación](#6-documentación) (1 prompt)
7. [Implementación Backend](#7-implementación-backend) (2 prompts)
8. [Spec Kit (SDD)](#8-spec-kit-sdd) (2 prompts)
9. [Implementación Frontend](#9-implementación-frontend) (3 prompts)
10. [Historias de usuario](#10-historias-de-usuario) (pendiente)
11. [Tickets de trabajo](#11-tickets-de-trabajo) (pendiente)
12. [Pull requests](#12-pull-requests)

---

## 1. Descripción General del Producto

### Prompt 1: Análisis inicial del documento semilla

**Contexto:** Revisión del documento inicial `app_apicultura.md` para identificar mejoras y definir alcance del MVP.

```
Revisa @app_apicultura.md si ves que puede tener posibles mejoras hazme un análisis
y las discutimos, es la semilla de un nuevo proyecto, sé cuidadoso
```

**Resultado clave:**
> Se identificaron 6 áreas de mejora: alcance MVP, stack tecnológico, modo offline,
> transcripción de voz, marketplace y estimaciones de coste. Se creó un anexo
> completo con análisis detallado.

**Impacto:** Estableció la base para reducir el MVP de 700h a ~450h manteniendo funcionalidad core.

---

### Prompt 2: Definición de principios del proyecto

**Contexto:** Establecer criterios de decisión para todas las elecciones técnicas.

```
Guarda estas posibles mejoras en un anexo al final del documento, con la premisa
de que todas las mejoras y el proyecto a nivel tecnológico tiene que buscar la
sencillez, practicidad y eficiencia
```

**Resultado clave:**
> Se definieron 6 principios de diseño: YAGNI, Offline-first, Una base de código (PWA),
> Stack conocido sobre tendencias, Validar antes de escalar, Datos sobre features.

**Impacto:** Guía todas las decisiones técnicas del proyecto.

---

### Prompt 3: Definición del perfil de usuario objetivo

**Contexto:** Determinar el alcance del MVP según el usuario objetivo.

```
[Respuesta a preguntas de validación]
- Usuario objetivo: Profesional (100+ colmenas)
- Geografía: Multi-idioma desde inicio
- Validación: Hay feedback real de apicultores
```

**Resultado clave:**
> MVP orientado a apicultor profesional con datos completos (varroa, tratamientos),
> no versión hobby simplificada. Añadido i18n al stack desde el inicio.

**Impacto:** Define funcionalidades obligatorias vs opcionales.

---

## 2. Arquitectura del Sistema

### Prompt 1: Elección de stack tecnológico

**Contexto:** Decidir entre BaaS (Supabase) vs backend propio (NestJS).

```
Hay un tema respecto al backend, ¿por qué Supabase en lugar de Node con NestJS?
Yo me siento más cómodo con NestJS
```

**Resultado clave:**
> Stack final: React + Vite + TypeScript (frontend), NestJS + Prisma + PostgreSQL (backend),
> Dexie.js para offline. Añade ~60-80h vs BaaS pero da control total.

**Impacto:** Define toda la arquitectura técnica del proyecto.

---

### Prompt 2: Definición del modo offline

**Contexto:** Definir estrategia de sincronización y gestión de conflictos.

```
Háblame más de modo offline y qué stack conlleva, tipos de bases de datos, etc.
antes de tomar una decisión
```

**Resultado clave:**
> Arquitectura offline-first con Dexie.js (IndexedDB), Service Worker,
> cola de sincronización, estrategia last-write-wins para conflictos.

**Impacto:** Funcionalidad core del MVP - uso en campo sin cobertura.

---

### Prompt 3: Definición de infraestructura

**Contexto:** Elegir plataforma de hosting con costes mínimos para MVP.

```
¿Cómo y dónde podría desplegar front y servidor con su base de datos?
```

**Resultado clave:**
> Vercel (frontend gratuito) + Railway (backend + PostgreSQL ~5€/mes).
> Proyección de escalado hasta 10.000+ usuarios documentada.

**Impacto:** Costes de infraestructura ~6€/mes para MVP.

---

## 3. Diseño UI/UX

### Prompt 1: Análisis de diseños Figma vs documentación

**Contexto:** Se creó un primer borrador en Figma con Figma AI y se exportó como código React. Se necesitaba comparar con la documentación técnica para identificar diferencias y tomar decisiones.

```
ahora quiero hacer los diseños para ello hice un borrador en figma, con un prompt general
lo he descargado quiero que lo compares con la documentacion que tenemos primeramente...
```

**Resultado clave:**
> Se identificaron 8 puntos de divergencia entre el diseño de Figma y la documentación. Análisis de componentes exportados: Dashboard.tsx, Hives.tsx, Inspections.tsx, Production.tsx, mockData.ts.

**Impacto:** Base para la revisión punto por punto de todo el diseño del MVP.

---

### Prompt 2: Decisiones de diseño punto por punto (9 puntos)

**Contexto:** Revisión iterativa comparando Figma con documentación. Cada punto se discutió y aprobó individualmente.

```
sí, vamos punto por punto
```

**Decisiones tomadas (9 puntos):**

| Punto | Decisión | Detalle |
|-------|----------|---------|
| 1. Login/Registro | AGREGAR | 3 pantallas de autenticación |
| 2. Apiarios | AGREGAR (Opción B) | Navegación jerárquica, colmenas dentro de apiario |
| 3. Colmenas | MODIFICAR | Combinar campos, status active/inactive/quarantine/lost |
| 4. Inspecciones | COMBINAR | Doc (varroa, tratamiento) + Figma (queen_seen, brood_pattern, temperament) |
| 5. Dashboard | SIMPLIFICAR | 4 cards + 2 gráficos, sin producción |
| 6. Producción | INCLUIR | Mantener del Figma original |
| 7. Tareas | INCLUIR | Lista con filtros, prioridades, vinculación a colmena |
| 8. Offline/Sync UI | AGREGAR | Badges Online/Offline + pendientes sync en header |
| 9. QR Scanner | INCLUIR | FAB + modal QR + impresión |

**Impacto:** Definió completamente las 9 pantallas/features del MVP y sus modelos de datos.

---

### Prompt 3: Generación de prompt para Figma AI

**Contexto:** Con todas las decisiones tomadas, se creó un prompt completo para actualizar los diseños en Figma AI.

```
[Generado automáticamente tras completar los 9 puntos de decisión]
```

**Resultado clave:**
> Prompt detallado de 9 secciones para Figma AI con todas las modificaciones necesarias. Guardado en `docs/design/FIGMA_PROMPT.md`.

**Impacto:** Permitió regenerar los diseños de Figma alineados al 100% con los requisitos.

---

### Prompt 4: Validación de diseños actualizados

**Contexto:** Se actualizaron los diseños en Figma con el prompt generado y se exportaron nuevamente. Se necesitaba verificar cumplimiento.

```
en el directorio /Colmenapp Bee Hive Manager-nueva/ estan los nuevos estilos que
desarrollamos revisalos, y verifica que cumplen nuestros requerimientos para el proyecto
```

**Resultado clave:**
> Validación componente por componente: 9/9 categorías al 100%. Se identificaron diferencias menores (enums en español vs inglés, campos denormalizados) que se resolvieron.

**Impacto:** Diseño final validado y listo para implementación.

---

## 4. Modelo de Datos

### Prompt 1: Decisión de idioma en enums

**Contexto:** Los diseños de Figma usaban enums en español (Saludable, Comprada) mientras la documentación los tenía en inglés (healthy, purchased).

```
ahora comparemos si hay novedades, para actualizar la documentacion
```

**Resultado clave:**
> Decisión: inglés en BD, español en UI. Se documentó tabla completa de mapeo de 7 enums (28 valores). Se actualizaron modelos con campos denormalizados (_name) y modelo User.

**Impacto:** Convención clara para todo el desarrollo.

---

### Prompt 2: Creación del schema de Prisma

**Contexto:** Con los modelos de datos finalizados, crear el schema de base de datos.

```
ahora creemos el schema de prisma
```

**Resultado clave:**
> Schema Prisma completo con 6 modelos, 7 enums, relaciones con CASCADE/SET NULL, índices de performance. Archivo: `backend/prisma/schema.prisma`.

**Impacto:** Base de datos lista para migración inicial.

---

## 5. Infraestructura y Entorno

### Prompt 1: Setup inicial del proyecto

**Contexto:** Configurar estructura base del proyecto para Entrega 2.

```
empecemos con la entrega 2, pero hagamos una aproximacion de lo que necesitamos antes
```

**Resultado clave:**
> docker-compose.yml (PostgreSQL 16), .env.example, .gitignore, estructura backend/ y frontend/ con READMEs.

**Impacto:** Entorno de desarrollo local listo.

---

## 6. Documentación

### Prompt 1: Organización de documentación en subdirectorios

**Contexto:** Toda la documentación estaba dispersa. Se necesitaba estructura organizada.

```
documenta tanto en front como en back los pasos que vamos dando, infraestructura diseños,
en la carpeta /docs generar toda la documentacion en diferentes directorios
```

**Resultado clave:**
> 16 archivos de documentación organizados en 6 subdirectorios: entrega1/, architecture/, design/, infrastructure/, database/, features/. Más READMEs actualizados en backend/ y frontend/.

**Impacto:** Documentación completa y navegable de todo el proyecto.

---

## 7. Implementación Backend

### Prompt 1: Inicialización NestJS

**Contexto:** Inicializar el proyecto backend con NestJS y dependencias core.

```
inicialicemos proyecto NestJS
```

**Resultado clave:**
> Proyecto NestJS scaffoldeado con Prisma 6.x, @nestjs/passport, @nestjs/jwt, bcrypt,
> class-validator, @nestjs/config. Build verificado sin errores.

**Impacto:** Backend listo para desarrollo de módulos.

---

### Prompt 2: Módulo Auth (PrismaService + register/login/JWT)

**Contexto:** Configurar los módulos base del backend.

```
[Continuación tras inicialización - configurar módulos base]
```

**Resultado clave:**
> PrismaModule global, AuthModule completo (register, login, profile), JwtStrategy,
> JwtAuthGuard, DTOs con validación, ValidationPipe + CORS en main.ts.
> Eliminados archivos de ejemplo de NestJS.

**Impacto:** API de autenticación funcional con 3 endpoints protegidos.

---

## 8. Spec Kit (SDD)

### Prompt 1: Configuración de Spec Kit en backend y frontend

**Contexto:** Implementar Spec-Driven Development con GitHub Spec Kit, adaptando documentación existente.

```
me refiero a esto /home/carlossjm/modelos_IA/speckit_claude_code.md revisalo y dime que te parece
```

**Resultado clave:**
> Spec Kit v0.3.2 inicializado en backend/ y frontend/. 4 documentos core por cada uno
> (constitution, spec, plan, tasks) rellenados con contenido real del proyecto.
> CLAUDE.md creado en raíz con convenciones globales.

**Impacto:** Metodología SDD implementada con documentación como fuente de verdad.

---

### Prompt 2: Refinamiento de constitutions

**Contexto:** Análisis iterativo de las constitutions para mejorarlas según la naturaleza del proyecto.

```
se te ocurre alguna mejora para el constitution del backend dada la naturaleza del proyecto?
```

**Decisiones tomadas:**

**Backend v1.0 → v1.1:**
- Principio II reescrito: "Offline-First" → "Sync-Ready" (idempotencia, timestamps, batch sync)
- Principio VI ampliado: Seguridad + Ownership isolation
- Principio VII nuevo: Integridad de Datos Apícolas (reglas de dominio)
- Sección nueva: Restricciones (no endpoints sin spec, no queries N+1, no exponer password_hash)

**Frontend v1.0 → v1.2:**
- Principio V: UX de Campo (touch 44px, 2 toques, selects>texto)
- Principio VIII nuevo: Rendimiento en Campo (lazy loading, no animaciones, APIs nativas)
- Principio IX nuevo: Componentización (padres con lógica, hijos presentacionales, pragmático)
- Legibilidad exterior (WCAG AA), restricciones de dependencias pesadas

**Impacto:** Constitutions adaptadas al dominio apícola y uso en campo.

---

## 9. Implementación Frontend

### Prompt 1: Inicialización React + Vite + integración Figma

**Contexto:** Inicializar el frontend con React+Vite+TypeScript e integrar los componentes exportados de Figma.

```
si vayamos a por la fase 3
```

**Resultado clave:**
> Proyecto React 18 + Vite + TypeScript scaffoldeado. Instaladas dependencias (Tailwind, shadcn/ui,
> Recharts, Lucide, Sonner, React Router, Radix UI). Integrados los 9 componentes de Figma
> (Dashboard, Apiaries, Hives, Inspections, Production, Tasks, QRModal, Layout, auth/).
> Creados: AuthContext, API service, types, enums mapping, routing con rutas protegidas.
> Build verificado (813KB).

**Impacto:** Frontend funcional con mock data y toda la UI integrada.

---

### Prompt 2: Conexión frontend-backend (API real)

**Contexto:** Reemplazar mock data por llamadas API reales al backend.

```
conectemos frontend con backend
```

**Resultado clave:**
> Creado seed de BD (demo@colmenapp.com/123456) con datos de prueba.
> Creado services/adapters.ts para mapear respuestas backend (hive.apiary.name → apiary_name).
> Modificados 6 componentes: Dashboard, Apiaries, Hives, Inspections, Production, Tasks.
> Todos los componentes ahora hacen fetch al API y reload tras mutaciones.

**Impacto:** App funcional end-to-end con datos reales de PostgreSQL.

---

### Prompt 3: Fixes de UI (Tailwind v4 + compatibilidad)

**Contexto:** Al probar la app en el navegador se detectaron varios problemas visuales causados por la incompatibilidad de los componentes shadcn/ui (diseñados para Tailwind v3) con Tailwind v4.

```
fijate todo los modales de creacion son transparentes no se ve nada
fijate como se ven los seleccionables
cuando hacemos focus en un input al salir el borde se come parte del label
en modal de colmena cuando esta activa o inactiva se pega mucho la etiqueta a la x de cerrar
```

**Fixes aplicados:**

| Issue | Causa | Solución |
|-------|-------|----------|
| Modales transparentes | Overlay de Radix no renderiza con Tailwind v4 | box-shadow 9999px en dialog-content como backdrop |
| Dialog content sin fondo | `bg-background` no se resuelve en TW4 | CSS global: `background-color: white !important` |
| Selects sin fondo/borde | `bg-popover`, `border-input` no se resuelven | CSS global para select-trigger y select-content |
| Selects sin placeholder | `<SelectValue />` sin prop placeholder | Agregado `placeholder="Seleccionar..."` |
| Enums en español en selects | Values de SelectItem en español (Baja, Saludable) | Corregido a inglés (low, healthy) para coincidir con backend |
| Input focus borde come label | `ring-[3px]` se superpone al label | CSS global con outline sutil + margin-bottom en labels |
| Badge pegado a X de cerrar | DialogTitle sin padding-right | `pr-10` + CSS global `padding-right: 2.5rem` en dialog-title |

**Impacto:** UI consistente y legible en todos los modales, formularios e inputs.

---

## 10. Historias de Usuario

*Prompts pendientes de documentar durante el desarrollo*

---

## 11. Tickets de Trabajo

*Prompts pendientes de documentar durante el desarrollo*

---

## 12. Pull Requests

### PR #1: Documentación técnica (Entrega 1)

**Contexto:** Primera entrega del proyecto final del máster AI4Devs.

**URL:** https://github.com/CarlosSJM/COLMENAPP/pull/1

**Contenido:**
- README.md con secciones 0-7 completas
- prompts.md con registro de uso de IA
- Documentación técnica en /docs

**Proceso con IA:**
- Análisis de documento semilla y definición de MVP
- Generación de diagramas Mermaid (arquitectura, ER, deployment)
- Redacción de historias de usuario y tickets de trabajo
- Validación iterativa punto por punto con el usuario

---

## Herramientas de IA Utilizadas

| Herramienta | Uso |
|-------------|-----|
| **Claude Code (CLI)** | Análisis, documentación, arquitectura, modelo de datos, código, Spec Kit |
| **Figma AI** | Generación de diseños UI a partir de prompts |
| **GitHub Spec Kit** | Spec-Driven Development (constitution, spec, plan, tasks) |

---

## Estadísticas

- **Total prompts documentados:** 21
- **Categorías:** Producto (3), Arquitectura (3), Diseño UI/UX (4), Modelo de datos (2), Infraestructura (1), Documentación (1), Backend (2), Spec Kit (2), Frontend (3)
- **Fecha inicio:** Enero 2026
- **Última actualización:** Marzo 2026
