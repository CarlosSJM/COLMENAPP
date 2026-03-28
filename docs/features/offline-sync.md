# Feature: Offline / Sync / PWA

## Descripcion
COLMENAPP funciona como PWA (Progressive Web App) instalable en movil con soporte offline basico. Los assets se cachean localmente y las respuestas API tienen fallback cache.

## Estado de Implementacion

| Componente | Estado | Detalle |
|------------|--------|---------|
| PWA Manifest | Implementado | App instalable, standalone, iconos, tema amber |
| Service Worker | Implementado | Cache de assets + fallback API |
| Indicadores Online/Offline | Implementado | Badge en header via AuthContext |
| Dexie.js (IndexedDB) | Pendiente | Storage local de entidades |
| Sync Queue | Pendiente | Cola de operaciones pendientes |
| Resolucion conflictos | Pendiente | Modal mantener local / usar servidor |

## PWA - Progressive Web App

### Que es
Una PWA permite que la app web se instale en el movil como si fuera una app nativa. Se accede desde el icono del escritorio, funciona a pantalla completa (sin barra del navegador), y puede funcionar offline.

### Ventajas para COLMENAPP
- **Sin app stores**: El apicultor accede desde el navegador y la instala con un toque
- **Actualizaciones automaticas**: Sin descargar nuevas versiones
- **Una sola base de codigo**: Funciona en Android, iOS, y escritorio
- **Funciona sin conexion**: Critico para uso en campo sin cobertura

### Configuracion

**manifest.json** (`public/manifest.json`):
```json
{
  "name": "COLMENAPP - Gestión Apícola",
  "short_name": "COLMENAPP",
  "display": "standalone",
  "theme_color": "#d97706",
  "background_color": "#fffbeb",
  "start_url": "/",
  "orientation": "portrait-primary"
}
```

**Meta tags** (`index.html`):
- `<meta name="theme-color">` - Color de la barra de estado del navegador
- `<meta name="apple-mobile-web-app-capable">` - Soporte iOS
- `<link rel="manifest">` - Referencia al manifest

### Como instalar
1. Abrir la app en Chrome mobile
2. Chrome muestra banner "Agregar a pantalla de inicio"
3. Aceptar → se instala como app nativa

## Service Worker

### Que es
Un script que corre en segundo plano entre la app y la red. Intercepta peticiones HTTP y puede servir respuestas cacheadas cuando no hay conexion.

### Estrategia implementada

| Tipo de recurso | Estrategia | Descripcion |
|-----------------|-----------|-------------|
| Assets (JS, CSS, imagenes) | Cache-first | Sirve del cache si existe, si no descarga y cachea |
| API calls (GET) | Network-first | Intenta la red primero, si falla sirve del cache |
| API calls (POST, PUT, DELETE) | Network-only | No se cachean mutaciones |

### Archivo: `public/sw.js`
```
Install → Cachea assets estaticos (/, manifest.json)
Activate → Limpia caches antiguos
Fetch → Intercepta requests y aplica estrategia segun tipo
```

### Ventajas
- La app carga instantaneamente en visitas posteriores (assets cacheados)
- Si se pierde conexion, las paginas ya visitadas siguen funcionando con datos cacheados
- Las respuestas GET de la API se cachean como fallback

### Limitaciones actuales
- Las mutaciones (crear, editar, eliminar) requieren conexion
- No hay cola de operaciones offline (requiere Dexie.js, fase futura)
- El cache de API es basico (no sincroniza automaticamente)

## Indicadores UI en Header

### Estado de Conexion
| Estado | Badge | Icono | Color |
|--------|-------|-------|-------|
| Online | "Online" | Cloud | Verde (green-50, green-300, green-700) |
| Offline | "Offline" | CloudOff | Naranja (orange-50, orange-300, orange-700) |

### Sincronizacion Pendiente
- Badge "[N] pendientes" visible solo cuando hay cambios sin sincronizar
- Color: naranja
- Actualmente el contador es estatico (0) hasta implementar Dexie.js

### Layout del Header
```
COLMENAPP                          [3 pendientes] [Offline]
Sistema de Gestion Apicola
```

### Implementacion
```typescript
// AuthContext.tsx
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));
}, []);
```

## Feedback en Acciones (Toasts)

| Accion | Mensaje |
|--------|---------|
| Guardar offline | "Guardado localmente. Se sincronizara cuando haya conexion." |
| Sincronizando | "Sincronizando..." |
| Sincronizado | "Sincronizado correctamente" |
| Error | Mensaje de error + opcion reintentar |

## Fase Futura: Dexie.js + Sync Queue

### Pendiente de implementar
1. **Dexie.js**: Schemas IndexedDB para cada entidad (apiaries, hives, inspections, production, tasks)
2. **Sync Queue**: Cola de operaciones pendientes con timestamps
3. **Resolucion de conflictos**: Modal "Mantener local" / "Usar servidor"
4. **Estrategia**: Last-write-wins configurable

### Flujo futuro
```
1. Usuario crea/edita → Guardar en IndexedDB + encolar operacion
2. Cuando hay conexion → Enviar cola al backend en orden
3. Servidor responde → Actualizar IndexedDB + limpiar cola
4. Si conflicto → Mostrar modal de resolucion
```
