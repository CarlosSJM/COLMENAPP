# Backlog Futuro - Tareas Post-MVP

Tareas planificadas para versiones posteriores al MVP. No se implementaran en la Entrega 2 pero quedan documentadas como tickets para desarrollo futuro.

---

## TK-F001: Gestion de Perfil de Usuario

**Tipo:** Full-stack (Backend + Frontend)
**Prioridad:** Alta
**Historia:** Como usuario quiero gestionar mis datos personales y credenciales para mantener mi cuenta actualizada.

### Descripcion
Implementar pantalla de perfil de usuario accesible desde el header, con gestion de datos personales y seguridad de la cuenta.

### Funcionalidades
- Pantalla/modal de perfil accesible desde el header (icono usuario o nombre)
- Edicion de datos personales: nombre, apellidos, telefono
- Cambio de email (con verificacion del nuevo email)
- Cambio de contrasena (requiere contrasena actual + nueva + confirmar)
- Visualizacion de fecha de registro y ultimo acceso

### Cambios necesarios

**Backend:**
- Nuevo endpoint PUT `/api/v1/auth/profile` para actualizar datos personales
- Nuevo endpoint PUT `/api/v1/auth/change-password` con validacion de contrasena actual
- Nuevo endpoint PUT `/api/v1/auth/change-email` con flujo de verificacion
- Ampliar modelo User en schema.prisma: apellidos, telefono, ultimo_acceso
- Migracion de BD

**Frontend:**
- Nuevo componente ProfileModal o pagina /profile
- Formulario de datos personales (nombre, apellidos, telefono)
- Formulario de cambio de contrasena (actual, nueva, confirmar)
- Formulario de cambio de email
- Boton en header/layout para acceder al perfil

### Criterios de aceptacion
- [ ] Usuario puede ver y editar su nombre y apellidos
- [ ] Usuario puede cambiar su contrasena verificando la actual
- [ ] Usuario puede cambiar su email
- [ ] Feedback con toast en cada accion
- [ ] Validacion de campos (email formato, contrasena minimo 6 chars)

---

## TK-F002: Historico de Inspecciones y Tareas por Colmena

**Tipo:** Frontend (endpoints ya existen)
**Prioridad:** Media
**Historia:** Como apicultor quiero ver el historico completo de inspecciones y tareas de cada colmena para analizar su evolucion.

### Descripcion
En el dialog de detalle de colmena, agregar dos botones que abran modales con el historico de inspecciones y tareas asociadas a esa colmena.

### Funcionalidades
- Boton "Inspecciones" en detalle de colmena → abre modal con lista cronologica
- Boton "Tareas" en detalle de colmena → abre modal con lista de tareas vinculadas
- Cada registro muestra fecha, datos principales y estado
- Ordenado por fecha descendente (mas reciente primero)

### Cambios necesarios

**Backend:**
- No requiere cambios. Endpoints ya existen:
  - GET `/api/v1/hives/:id/inspections`
  - GET `/api/v1/tasks` (filtrar por hive_id en frontend)

**Frontend:**
- Nuevo componente HiveInspectionsModal (lista cronologica de inspecciones)
- Nuevo componente HiveTasksModal (lista de tareas vinculadas)
- Agregar botones "Ver Inspecciones" y "Ver Tareas" en dialog detalle de Hives.tsx
- Badges de health_status y prioridad en cada item

### Criterios de aceptacion
- [ ] Boton "Inspecciones" muestra historico de esa colmena
- [ ] Boton "Tareas" muestra tareas vinculadas a esa colmena
- [ ] Listas ordenadas cronologicamente
- [ ] Estado vacio si no hay registros
- [ ] No se apilan modales (cerrar detalle al abrir historico)

---

## TK-F003: Produccion por Colmena con Graficas Comparativas

**Tipo:** Frontend (endpoints ya existen)
**Prioridad:** Media
**Historia:** Como apicultor quiero ver la produccion de cada colmena con graficas para comparar rendimiento en el tiempo.

### Descripcion
En el dialog de detalle de colmena, agregar boton "Produccion" que abre modal con listado de registros de produccion y grafica comparativa temporal.

### Funcionalidades
- Boton "Produccion" en detalle de colmena → abre modal
- Tabla con registros: fecha, miel (kg), cera (kg), propoleo (g)
- Grafica de lineas temporal: evolucion de produccion en el tiempo
- Si hay varios registros, comparativa visual entre periodos
- Totales acumulados en la parte superior

### Cambios necesarios

**Backend:**
- No requiere cambios. Endpoint ya existe:
  - GET `/api/v1/hives/:id/productions`

**Frontend:**
- Nuevo componente HiveProductionModal
- Tabla de registros con fecha y cantidades
- Grafica Recharts LineChart con series para miel, cera, propoleo en eje temporal
- Tarjetas de totales (miel total, cera total, propoleo total)

**Seed de Prisma:**
- Ampliar seed.ts con mas registros de produccion por colmena (minimo 5-6 registros por colmena en diferentes fechas) para que las graficas temporales tengan sentido

### Criterios de aceptacion
- [ ] Boton "Produccion" en detalle de colmena abre modal
- [ ] Tabla muestra todos los registros de produccion de esa colmena
- [ ] Grafica de lineas muestra evolucion temporal
- [ ] Totales acumulados visibles
- [ ] Si no hay registros, mensaje de estado vacio
- [ ] Seed actualizado con datos suficientes para graficas

---

## TK-F004: Soft Delete para Todos los Modelos

**Tipo:** Full-stack (Backend + Frontend + BD)
**Prioridad:** Media-Alta
**Historia:** Como administrador quiero que los datos eliminados se conserven para analisis futuro, no se borren permanentemente.

### Descripcion
Implementar soft delete en todos los modelos. Los registros "eliminados" se marcan con un campo `deleted_at` pero permanecen en la BD. El frontend usa soft delete, el backend conserva la capacidad de hard delete para administracion.

### Funcionalidades
- Al eliminar desde el frontend: se marca `deleted_at = now()` en vez de DELETE
- Las queries de listado excluyen registros con `deleted_at != null`
- Los datos eliminados se conservan para analisis de datos futuro
- Posibilidad futura: papelera de reciclaje para restaurar registros

### Cambios necesarios

**Base de datos:**
- Agregar campo `deleted_at DateTime?` a todos los modelos: User, Apiary, Hive, Inspection, Production, Task
- Migracion de BD

**Backend:**
- Crear middleware o interceptor de Prisma que filtre automaticamente `deleted_at: null` en todas las queries findMany/findFirst
- Modificar metodos `remove()` de todos los services: en vez de `prisma.xxx.delete()` hacer `prisma.xxx.update({ data: { deleted_at: new Date() } })`
- Mantener endpoints DELETE pero que hagan soft delete
- Nuevo endpoint (admin futuro): hard delete real si es necesario

**Frontend:**
- No requiere cambios visibles (los endpoints DELETE siguen funcionando igual)
- Futuro: seccion "Papelera" para ver y restaurar registros eliminados

### Criterios de aceptacion
- [ ] DELETE desde frontend marca deleted_at en vez de borrar
- [ ] Registros eliminados no aparecen en listados
- [ ] Los registros siguen existiendo en BD (verificable con Prisma Studio)
- [ ] Las relaciones CASCADE se manejan correctamente (soft delete en cascada)
- [ ] Tests e2e actualizados para verificar soft delete

---

## TK-F005: Historico de Ediciones (Audit Log)

**Tipo:** Full-stack (Backend + BD)
**Prioridad:** Baja
**Historia:** Como apicultor quiero ver como han cambiado los datos de un apiario o colmena en el tiempo para entender la evolucion.

### Descripcion
Implementar tablas de auditoria que registren cada edicion de apiarios y colmenas. Al editar un registro, se guarda una copia del estado anterior en una tabla de historial.

### Funcionalidades
- Cada vez que se edita un apiario o colmena, se guarda snapshot del estado anterior
- Accesible desde el detalle: boton "Ver historial de cambios"
- Lista cronologica de cambios con: fecha, que cambio, valor anterior, valor nuevo
- Solo lectura (el historial no se edita)

### Cambios necesarios

**Base de datos:**
- Nueva tabla `apiary_history`:
  - id, apiary_id (FK), changed_at, changed_by (user_id), field_name, old_value, new_value
- Nueva tabla `hive_history`:
  - id, hive_id (FK), changed_at, changed_by (user_id), field_name, old_value, new_value
- Migraciones de BD
- Indices en apiary_id, hive_id, changed_at

**Backend:**
- Interceptor o servicio de auditoria que al hacer UPDATE:
  1. Lee el estado actual del registro
  2. Compara con los nuevos datos
  3. Guarda las diferencias en la tabla de historial
- Nuevos endpoints:
  - GET `/api/v1/apiaries/:id/history`
  - GET `/api/v1/hives/:id/history`

**Frontend:**
- Nuevo componente HistoryModal
- Boton "Ver historial" en detalle de apiario y colmena
- Lista de cambios: fecha, campo, valor anterior → valor nuevo
- Timeline visual (opcional)

### Criterios de aceptacion
- [ ] Al editar un apiario se registra el cambio en apiary_history
- [ ] Al editar una colmena se registra el cambio en hive_history
- [ ] Boton "Ver historial" muestra lista cronologica de cambios
- [ ] Se muestra: que campo cambio, de que valor a que valor, cuando y quien
- [ ] El historial es solo lectura

---

## TK-F006: Sistema de Logs de Errores del Backend

**Tipo:** Backend
**Prioridad:** Alta
**Historia:** Como desarrollador quiero que todos los errores del backend queden registrados con contexto suficiente para poder diagnosticar fallos en produccion.

### Descripcion
Implementar un sistema centralizado de logging que capture todos los errores y excepciones del backend, con contexto (usuario, endpoint, payload, timestamp) y persistencia para su analisis posterior.

### Funcionalidades
- Captura automatica de todas las excepciones no controladas
- Log de errores HTTP (4xx, 5xx) con request context
- Log de errores de Prisma (queries fallidas, constraints)
- Log de fallos de autenticacion (login fallido, token invalido/expirado)
- Niveles de log: ERROR, WARN, INFO, DEBUG
- Rotacion de logs (evitar que crezcan indefinidamente)
- En produccion: persistencia en archivo y/o servicio externo

### Cambios necesarios

**Backend:**
- Instalar libreria de logging: `winston` o `pino` (recomendado pino por rendimiento)
- Crear modulo LoggerModule con servicio centralizado
- Implementar ExceptionFilter global que capture todas las excepciones:
  ```typescript
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      // Log: timestamp, method, url, status, message, stack, userId
    }
  }
  ```
- Implementar LoggingInterceptor para registrar requests/responses:
  ```typescript
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
      // Log: method, url, duration, status
    }
  }
  ```
- Configurar transports:
  - Desarrollo: consola con formato legible (pretty print)
  - Produccion: archivo JSON rotativo + opcionalmente servicio externo

**Estructura de un log de error:**
```json
{
  "timestamp": "2026-03-29T10:30:00Z",
  "level": "error",
  "method": "POST",
  "url": "/api/v1/inspections",
  "statusCode": 500,
  "message": "Unique constraint failed on code",
  "userId": "uuid-123",
  "requestBody": { "hive_id": "...", "date": "..." },
  "stack": "PrismaClientKnownRequestError...",
  "duration": "45ms"
}
```

**Opciones de persistencia en produccion:**

| Opcion | Coste | Descripcion |
|--------|-------|-------------|
| Archivos JSON rotativos | 0€ | Logs en disco del servidor, rotacion diaria |
| Logtail / Better Stack | Gratis (1GB/mes) | Dashboard web, busqueda, alertas |
| Sentry | Gratis (5K eventos/mes) | Tracking de errores, agrupacion, alertas |
| Datadog | Gratis (limitado) | Metricas + logs + APM |

**Recomendacion MVP:** Winston/Pino con archivos JSON en disco + opcionalmente Sentry para errores criticos.

**Frontend:**
- No requiere cambios directos
- Futuro: pagina de admin para visualizar logs (post-MVP)

### Criterios de aceptacion
- [ ] Todas las excepciones quedan registradas con timestamp, endpoint y mensaje
- [ ] Los errores de autenticacion registran el email intentado (no la contrasena)
- [ ] Los errores de Prisma registran el modelo y la operacion
- [ ] En desarrollo: logs legibles en consola con colores
- [ ] En produccion: logs en formato JSON persistidos en archivo
- [ ] Los logs NO contienen passwords, tokens JWT completos ni datos sensibles
- [ ] Rotacion de archivos configurada (maximo 7 dias o 100MB)

---

## Prioridad de Implementacion

| Ticket | Prioridad | Complejidad | Dependencias |
|--------|-----------|-------------|-------------|
| TK-F001 | Alta | Media | Ninguna |
| TK-F006 | Alta | Media | Ninguna |
| TK-F002 | Media | Baja | Ninguna (endpoints existen) |
| TK-F003 | Media | Media | Ampliar seed |
| TK-F004 | Media-Alta | Alta | Afecta todos los modelos |
| TK-F005 | Baja | Alta | TK-F004 recomendado antes |
