# COLMENAPP Frontend - Constitution

## Core Principles

### I. Sencillez (YAGNI)
Solo implementar lo que se necesita ahora. No disenar para requisitos hipoteticos futuros. Componentes simples y directos. Minimo codigo necesario para la tarea actual.

### II. Offline-First
La app se usa en campo sin cobertura. El frontend es el responsable de la experiencia offline:
- Dexie.js (IndexedDB) como storage local para todas las entidades
- Service Worker para cache de assets y respuestas API
- Toda operacion se guarda primero en local, luego se sincroniza
- Cola de operaciones pendientes con timestamps del cliente
- Feedback visual claro: Online/Offline badge + contador de pendientes
- Al reconectar: enviar cola al backend, resolver conflictos si los hay

### III. PWA como Unica Base de Codigo
Una sola app web progresiva que funciona en movil y escritorio. No apps nativas separadas. Mobile-first en diseno.

### IV. Stack Conocido sobre Tendencias
React 18 + Vite + TypeScript + Tailwind + shadcn/ui. No cambiar de tecnologia sin justificacion clara.

### V. Datos sobre Features
La UI debe facilitar la captura rapida de datos en campo (incluso con guantes). Formularios claros, feedback inmediato, minimos toques necesarios. Priorizar campos de salud (varroa, tratamientos, health_status) sobre campos esteticos.

### VI. Paleta Visual Consistente
Colores amber/miel. Componentes shadcn/ui. Lucide React para iconos. Sonner para toasts. No mezclar librerias de UI.

### VII. Coherencia con el Dominio Apicola
- Los colores de badges reflejan severidad real: verde=bien, amarillo=atencion, naranja=preocupante, rojo=critico
- Los formularios de inspeccion agrupan campos por logica apicola (reina, cria, metricas, tratamiento)
- Los estados de colmena (active/quarantine/lost) deben ser visualmente distinguibles de un vistazo
- El dashboard prioriza alertas (atencion requerida, inspecciones pendientes) sobre metricas generales

## Convenciones Frontend

- Componentes React funcionales con hooks
- TypeScript para todo el codigo
- Enums llegan del backend en ingles, se traducen a espanol en UI con mapeo centralizado en `utils/enums.ts`
- Campos denormalizados `_name` vienen del backend para evitar joins en frontend
- React Router para navegacion
- Recharts para graficos
- Mock data en desarrollo, API real en produccion

## Restricciones (NO hacer)

- **No mezclar librerias UI**: solo shadcn/ui + Tailwind, no Material UI, no Bootstrap, no otras
- **No traducir enums inline**: siempre usar el mapeo centralizado de `utils/enums.ts`
- **No hacer fetch sin manejar error**: toda llamada API debe tener feedback al usuario (toast)
- **No crear componentes sin responsive**: todo debe funcionar en movil (mobile-first)
- **No almacenar tokens en localStorage**: usar httpOnly cookies o memoria (AuthContext)
- **No omitir estados vacios**: toda lista debe tener un mensaje cuando no hay datos

## Governance

La constitution guia todas las decisiones tecnicas. Cambios requieren discusion con el usuario y documentacion en docs/design/DESIGN_DECISIONS.md.

**Version**: 1.1 | **Ratified**: 2026-03-21 | **Last Amended**: 2026-03-21
