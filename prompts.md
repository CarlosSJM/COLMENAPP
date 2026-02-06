# COLMENAPP - Registro de Prompts

## Índice

1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

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

## 3. Modelo de Datos

*Prompts pendientes de documentar durante el desarrollo*

---

## 4. Especificación de la API

*Prompts pendientes de documentar durante el desarrollo*

---

## 5. Historias de Usuario

*Prompts pendientes de documentar durante el desarrollo*

---

## 6. Tickets de Trabajo

*Prompts pendientes de documentar durante el desarrollo*

---

## 7. Pull Requests

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
| **Claude Code (CLI)** | Análisis, documentación, arquitectura, código |
| *Pendiente* | *Se añadirán según se usen* |

---

## Estadísticas

- **Total prompts documentados:** 6
- **Categoría dominante:** Arquitectura del sistema
- **Fecha inicio:** Enero 2026
