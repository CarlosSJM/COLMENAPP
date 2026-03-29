# Feature: Edicion y Eliminacion de Registros

## Contexto
El MVP inicial permitia crear y listar registros pero no editarlos ni eliminarlos. Los endpoints del backend (PUT y DELETE) ya estaban implementados. El trabajo fue exclusivamente frontend.

## Estado de Implementacion

| Entidad | Crear | Listar | Editar | Eliminar | updated_at |
|---------|-------|--------|--------|----------|------------|
| Apiarios | ✅ | ✅ | ✅ Dialog pre-rellenado | ✅ CASCADE warning | ✅ En card |
| Colmenas | ✅ | ✅ | ✅ Dialog desde detalle | ✅ CASCADE warning | - |
| Inspecciones | ✅ | ✅ | - | ✅ Confirmacion | - |
| Produccion | ✅ | ✅ | - | ✅ En cada fila | - |
| Tareas | ✅ | ✅ + toggle | ✅ Dialog completo | ✅ Confirmacion | - |

## Componente Reutilizable: ConfirmDeleteDialog

Componente creado en `src/components/ConfirmDeleteDialog.tsx` que se usa en todas las entidades:

```typescript
interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;           // "Eliminar Apiario"
  description: string;     // "¿Estás seguro de eliminar 'Apiario Norte'?"
  warning?: string;        // "Se eliminarán X colmenas y todos sus registros"
  isLoading?: boolean;
}
```

**Caracteristicas:**
- Icono AlertTriangle rojo en titulo
- Warning en recuadro rojo si hay CASCADE
- Boton "Eliminar" rojo con estado de carga
- Boton "Cancelar" deshabilitado durante eliminacion

## Implementacion por Entidad

### Apiarios
- **Editar**: Boton Pencil en header de card → Dialog con formulario pre-rellenado (nombre, ubicacion, lat/lng, notas) → PUT /apiaries/:id → reload
- **Eliminar**: Boton Trash2 en header de card → ConfirmDeleteDialog con warning si tiene colmenas ("Se eliminaran X colmena(s) y todos sus registros") → DELETE /apiaries/:id → reload
- **updated_at**: Mostrado en footer de card como "Editado: DD MMM YYYY, HH:mm" solo si difiere de created_at
- **Formulario reutilizado**: Funcion `renderForm()` genera el mismo form para crear y editar con defaultValues

### Colmenas
- **Editar**: Boton Pencil en dialog de detalle → Dialog con todos los campos (code, name, status, queen_origin, population, frames, installed_at, notes) → PUT /hives/:id → reload
- **Eliminar**: Boton Trash2 en dialog de detalle → ConfirmDeleteDialog con warning CASCADE ("Se eliminaran inspecciones, produccion y tareas") → DELETE /hives/:id → reload
- **Flujo**: Detalle se cierra al abrir edicion o eliminacion para evitar dialogs apilados

### Tareas
- **Editar**: Boton Pencil en cada card de tarea → Dialog (titulo, descripcion, fecha, prioridad, colmena opcional) → PUT /tasks/:id → reload
- **Eliminar**: Boton Trash2 en cada card → ConfirmDeleteDialog simple → DELETE /tasks/:id → reload
- **Botones**: Ubicados en la zona inferior de cada card junto a la fecha y colmena

### Inspecciones
- **Eliminar**: Boton Trash2 en header de cada card (junto a badges) → ConfirmDeleteDialog con fecha y nombre de colmena → DELETE /inspections/:id → reload
- **Sin edicion**: Decisión de MVP - las inspecciones son registros historicos, no se editan normalmente

### Produccion
- **Eliminar**: Boton Trash2 en cada fila de la tabla → ConfirmDeleteDialog con fecha y nombre de colmena → DELETE /productions/:id → reload
- **Sin edicion**: Decisión de MVP - los registros de produccion son historicos

## Decisiones Tecnicas

### Por que no se implemento edicion en Inspecciones y Produccion
Son registros historicos de datos de campo. En la practica apicola, una inspeccion ya realizada no se "edita" - se registra una nueva. Lo mismo con cosechas. Editar estos registros podria comprometer la integridad del historial.

Si fuera necesario en el futuro, los endpoints PUT ya estan listos en el backend.

### Por que updated_at solo en Apiarios
Es la entidad mas editada (cambiar notas, ubicacion). En Colmenas, el estado se ve en el badge. En Tareas, el toggle de completado es la accion principal. No tiene sentido visual mostrar updated_at en todas las entidades del MVP.

### Patron de cierre de dialogs al editar/eliminar desde detalle
En Colmenas, al pulsar "Editar" o "Eliminar" desde el dialog de detalle, primero se cierra el detalle y luego se abre el dialog de edicion/eliminacion. Esto evita apilar multiples dialogs con overlays.
