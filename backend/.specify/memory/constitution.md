# COLMENAPP Backend - Constitution

## Core Principles

### I. Sencillez (YAGNI)
Solo implementar lo que se necesita ahora. No disenar para requisitos hipoteticos futuros. Tres lineas similares es mejor que una abstraccion prematura. Minimo codigo necesario para la tarea actual.

### II. Sync-Ready
El frontend gestiona el offline. El backend debe estar preparado para sincronizacion:
- Aceptar lotes de datos atrasados (sync batch con timestamps del cliente)
- Ser idempotente: reintentar una operacion no debe duplicar datos
- Manejar `created_at` del cliente vs `synced_at` del servidor
- Resolver conflictos con estrategia last-write-wins (configurable a futuro)
- Devolver estado de sincronizacion en responses cuando aplique

### III. Stack Conocido sobre Tendencias
NestJS + Prisma + PostgreSQL. No cambiar de tecnologia sin justificacion clara. Preferir soluciones probadas sobre novedades.

### IV. Datos sobre Features
Priorizar la captura correcta de datos apicolas (varroa, tratamientos, salud) sobre features esteticas. El valor esta en los datos, no en la interfaz.

### V. Validar antes de Escalar
MVP para un usuario. No optimizar para 10.000 usuarios hasta tener validacion real con apicultores.

### VI. Seguridad y Aislamiento
- Input validation en todos los endpoints (class-validator)
- Passwords hasheados con bcrypt (salt 10)
- JWT para autenticacion (expira 24h)
- Prisma ORM previene SQL injection
- No hardcodear secrets (todo via .env)
- **Ownership isolation**: Un usuario NUNCA puede ver, modificar o eliminar datos de otro. Toda query debe filtrar por user_id (directo o via relacion con Apiary)
- CORS restringido al dominio del frontend
- Rate limiting basico en endpoints de auth

### VII. Integridad de Datos Apicolas
Los datos son el valor core del producto. El backend debe proteger la coherencia del dominio:
- Al crear/eliminar colmena → actualizar `hive_count` del apiario
- Al crear inspeccion → actualizar `last_inspection` de la colmena
- Validaciones de dominio: no aceptar `varroa_count` negativo, `weight` debe ser positivo, `population` >= 0, `frames` >= 0
- Las relaciones CASCADE garantizan que no existan registros huerfanos
- Task→Hive usa SET NULL: al eliminar colmena, las tareas se desvinculan pero no se pierden
- Los enums de BD son la unica fuente de verdad para estados validos

## Convenciones Backend

- API REST con prefijo `/api/v1/`
- Enums en BD en ingles, traduccion a espanol en frontend
- Campos denormalizados `_name` resueltos en queries con `include`, no almacenados
- DTOs con class-validator para toda entrada
- Cada modulo: module + controller + service + DTOs
- Responses: `{ data, meta?, error? }`
- Prisma como unica fuente de verdad para schema de BD
- Usar `include` de Prisma para relaciones, nunca queries N+1

## Restricciones (NO hacer)

- **No agregar endpoints sin spec documentada** en `.specify/memory/spec.md`
- **No hardcodear valores de dominio**: los enums de Prisma los definen
- **No hacer queries N+1**: usar `include` o `select` de Prisma
- **No exponer password_hash** en ningun response (usar `select` para excluirlo)
- **No eliminar datos sin CASCADE**: respetar las politicas de eliminacion del schema
- **No saltar ownership checks**: toda operacion verifica que el recurso pertenece al usuario autenticado

## Governance

La constitution guia todas las decisiones tecnicas. Cambios requieren discusion con el usuario y documentacion en docs/design/DESIGN_DECISIONS.md.

**Version**: 1.1 | **Ratified**: 2026-03-21 | **Last Amended**: 2026-03-21
