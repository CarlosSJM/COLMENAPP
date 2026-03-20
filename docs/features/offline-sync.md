# Feature: Offline / Sync / PWA

## Descripcion
COLMENAPP funciona como PWA con capacidad offline. Los datos se almacenan localmente en IndexedDB (via Dexie.js) y se sincronizan cuando hay conexion.

## Indicadores UI en Header

### Estado de Conexion
| Estado | Badge | Icono | Color |
|--------|-------|-------|-------|
| Online | "Online" | Cloud | Verde (green-50, green-300, green-700) |
| Offline | "Offline" | CloudOff | Naranja (orange-50, orange-300, orange-700) |

### Sincronizacion Pendiente
- Badge "[N] pendientes" visible solo cuando hay cambios sin sincronizar
- Color: naranja

### Layout del Header
```
COLMENAPP                          [3 pendientes] [Offline]
Sistema de Gestion Apicola
```

## Feedback en Acciones (Toasts)

| Accion | Mensaje |
|--------|---------|
| Guardar offline | "Guardado localmente. Se sincronizara cuando haya conexion." |
| Sincronizando | "Sincronizando..." |
| Sincronizado | "Sincronizado correctamente" |
| Error | Mensaje de error + opcion reintentar |

## Resolucion de Conflictos
- Modal mostrando diferencias entre version local y servidor
- Opciones: "Mantener local" / "Usar servidor"
- Solo aparece cuando hay conflictos reales (misma entidad modificada en ambos lados)

## Stack Offline

| Tecnologia | Uso |
|------------|-----|
| **Dexie.js** | Wrapper sobre IndexedDB para almacenamiento local |
| **Service Worker** | Cache de assets y API responses |
| **Web App Manifest** | Instalacion como PWA |

## Estrategia de Sincronizacion

```
1. Operacion del usuario -> Guardar en IndexedDB + marcar como pendiente
2. Cuando hay conexion -> Enviar cambios pendientes al servidor
3. Servidor responde -> Actualizar IndexedDB + limpiar marca pendiente
4. Si conflicto -> Mostrar modal de resolucion
```

## Estado en AuthContext

```typescript
interface AuthContextState {
  user: User | null;
  isOnline: boolean;      // Navigator.onLine
  pendingSync: number;    // Cambios pendientes de sincronizar
  login: (email, password) => Promise<void>;
  register: (name, email, password) => Promise<void>;
  logout: () => void;
}
```
