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

### V. UX de Campo
La app se usa en el apiario: sol directo, guantes, abejas, prisa. Toda decision de UI debe pasar este filtro:
- Touch targets minimo 44px (botones, checkboxes, selects)
- No depender de hover (no existe en movil)
- Preferir selects/toggles sobre texto libre (menos escritura en campo)
- Formularios largos divididos en secciones visibles, no scroll interminable
- La accion mas comun (nueva inspeccion) accesible en maximo 2 toques desde cualquier pantalla
- Priorizar campos de salud (varroa, tratamientos, health_status) sobre campos esteticos
- Feedback inmediato en cada accion (toast de confirmacion/error)

### VI. Paleta Visual y Legibilidad Exterior
Colores amber/miel con contraste suficiente para lectura en exteriores:
- Componentes shadcn/ui como base, Lucide React para iconos, Sonner para toasts
- Texto principal en amber-900 (oscuro) sobre fondos claros (amber-50, white)
- Badges de estado distinguibles incluso con brillo al maximo
- Contraste minimo WCAG AA para todo texto legible
- No mezclar librerias de UI

### VII. Coherencia con el Dominio Apicola
- Los colores de badges reflejan severidad real: verde=bien, amarillo=atencion, naranja=preocupante, rojo=critico
- Los formularios de inspeccion agrupan campos por logica apicola (reina, cria, metricas, tratamiento)
- Los estados de colmena (active/quarantine/lost) deben ser visualmente distinguibles de un vistazo
- El dashboard prioriza alertas (atencion requerida, inspecciones pendientes) sobre metricas generales

### VIII. Rendimiento en Campo
Un movil en el campo tiene bateria limitada y conexion inestable:
- Lazy loading de rutas (solo cargar la pantalla que se visita)
- No animaciones pesadas que consuman bateria
- QR generado en local (qrcode.react), no fetch a API externa
- Bundle size controlado: no importar librerias enteras
- Preferir APIs nativas del browser (Intl para fechas, navigator.onLine para conexion)

### IX. Componentizacion
La logica de negocio se concentra en los componentes padre. Los hijos son principalmente presentacionales.
- **Componentes padre (pages)**: Centralizan estado, llamadas API, handlers y logica de negocio. Es normal y esperado que sean largos si la funcionalidad lo requiere.
- **Componentes hijo**: Principalmente reciben datos y callbacks via props. Evitar logica de negocio en hijos salvo que haya una razon justificada (ej: logica de UI compleja propia del hijo).
- **Props tipadas**: Interfaces de props definidas con TypeScript.
- **Criterio pragmatico**: Extraer hijos cuando mejore la legibilidad o haya reutilizacion real, no por tamano del padre.

## Convenciones Frontend

- Componentes React funcionales con hooks
- TypeScript para todo el codigo
- Enums llegan del backend en ingles, se traducen a espanol en UI con mapeo centralizado en `utils/enums.ts`
- Campos denormalizados `_name` vienen del backend para evitar joins en frontend
- React Router para navegacion
- Recharts para graficos
- Mock data en desarrollo, API real en produccion
- **3 estados por pantalla**: Toda vista que carga datos debe manejar: loading (skeleton), datos, error (con boton reintentar). Patron consistente en toda la app.
- **Estructura de componente page**:
  ```
  HivesPage (padre inteligente)
  ├── HiveFilters (hijo: recibe filtros, emite onChange)
  ├── HiveGrid (hijo: recibe hives[], emite onSelect)
  │   └── HiveCard (hijo: recibe hive, emite onClick/onQR)
  ├── HiveDetailDialog (hijo: recibe hive, open, onClose)
  ├── HiveFormDialog (hijo: recibe onSubmit, open, onClose)
  └── QRModal (hijo: recibe code/name, open, onClose)
  ```

## Restricciones (NO hacer)

- **No mezclar librerias UI**: solo shadcn/ui + Tailwind
- **No traducir enums inline**: siempre usar el mapeo centralizado de `utils/enums.ts`
- **No hacer fetch sin manejar error**: toda llamada API debe tener feedback al usuario (toast)
- **No crear componentes sin responsive**: todo debe funcionar en movil (mobile-first)
- **No omitir estados vacios**: toda lista debe tener un mensaje cuando no hay datos
- **No importar dependencias pesadas**: no moment.js (usar Intl nativo o date-fns), no lodash entero (import especifico si acaso)
- **Logica en padres**: evitar logica de negocio en hijos en la medida de lo posible, aunque puede ser necesario en casos puntuales
- **Padres grandes son aceptables**: si un padre concentra mucha funcionalidad es normal que sea largo. No forzar divisiones artificiales
- **Token JWT**: almacenar en memoria (AuthContext) durante la sesion. Para persistencia offline, refresh token en IndexedDB (Dexie) encriptado. No usar localStorage para tokens.

## Governance

La constitution guia todas las decisiones tecnicas. Cambios requieren discusion con el usuario y documentacion en docs/design/DESIGN_DECISIONS.md.

**Version**: 1.2 | **Ratified**: 2026-03-21 | **Last Amended**: 2026-03-21
