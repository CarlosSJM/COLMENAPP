# Feature: Edicion y Eliminacion de Registros

## Contexto
El MVP actual permite crear y listar registros en todas las entidades, pero no permite editarlos ni eliminarlos desde la UI. Los endpoints del backend (PUT y DELETE) ya estan implementados y funcionan. El trabajo pendiente es exclusivamente en el frontend.

## Estado de Implementacion

| Entidad | Crear | Listar | Editar | Eliminar | updated_at |
|---------|-------|--------|--------|----------|------------|
| Apiarios | ✅ | ✅ | ✅ | ✅ (CASCADE warning) | ✅ |
| Colmenas | ✅ | ✅ | ✅ | ✅ (CASCADE warning) | - |
| Inspecciones | ✅ | ✅ | - | ✅ | - |
| Produccion | ✅ | ✅ | - | ✅ | - |
| Tareas | ✅ | ✅ (+ toggle) | ✅ | ✅ | - |

## Analisis por Capa

### Backend - No requiere cambios
- PUT endpoints ya implementados en todos los modulos
- DELETE endpoints ya implementados con CASCADE/SET NULL
- `updated_at` ya existe en el schema Prisma con `@updatedAt` (se actualiza automaticamente)
- Los DTOs de Update (PartialType) ya aceptan campos parciales

### Base de Datos - No requiere cambios
- `updated_at` con `@updatedAt` ya se actualiza automaticamente en cada UPDATE
- Las politicas CASCADE (Apiary→Hive→Inspection/Production) y SET NULL (Hive→Task) ya estan definidas

### Frontend - Requiere implementacion

#### 1. Edicion de Registros

Cada entidad necesita:
- **Boton "Editar"** en la card o dialog de detalle
- **Dialog de edicion** que reutilice el formulario de creacion, pre-rellenado con datos actuales
- **Llamada API** al endpoint PUT correspondiente
- **Reload de datos** tras edicion exitosa
- **Toast de confirmacion** "Registro actualizado exitosamente"

| Entidad | Boton en | Formulario | Endpoint |
|---------|----------|-----------|----------|
| Apiarios | Card | Dialog (nombre, ubicacion, lat/lng, notas) | PUT /apiaries/:id |
| Colmenas | Card / Detalle dialog | Dialog (code, name, status, queen_origin, population, frames, notes) | PUT /hives/:id |
| Inspecciones | Card | Dialog (todos los campos de inspeccion) | PUT /inspections/:id |
| Produccion | Fila de tabla | Dialog (colmena, fecha, miel, cera, propoleo) | PUT /productions/:id |
| Tareas | Card | Dialog (titulo, descripcion, fecha, prioridad, colmena) | PUT /tasks/:id |

#### 2. Eliminacion de Registros

Cada entidad necesita:
- **Boton "Eliminar"** en la card o dialog de detalle (icono Trash, color rojo)
- **Dialog de confirmacion** antes de eliminar: "Estas seguro? Esta accion no se puede deshacer."
- **Advertencia CASCADE** para Apiarios ("Se eliminaran todas las colmenas del apiario") y Colmenas ("Se eliminaran inspecciones, produccion y tareas asociadas")
- **Llamada API** al endpoint DELETE correspondiente
- **Reload de datos** tras eliminacion
- **Toast de confirmacion** "Registro eliminado"

| Entidad | Advertencia CASCADE | Endpoint |
|---------|-------------------|----------|
| Apiarios | "Se eliminaran X colmenas y todos sus registros" | DELETE /apiaries/:id |
| Colmenas | "Se eliminaran inspecciones, produccion y tareas vinculadas" | DELETE /hives/:id |
| Inspecciones | Sin advertencia extra | DELETE /inspections/:id |
| Produccion | Sin advertencia extra | DELETE /productions/:id |
| Tareas | Sin advertencia extra | DELETE /tasks/:id |

#### 3. Mostrar updated_at

- En la card o detalle de cada entidad, mostrar "Ultima actualizacion: DD/MM/YYYY HH:mm"
- Solo mostrar si `updated_at` difiere de `created_at` (es decir, si fue editado)
- Formato: fecha relativa para recientes ("hace 2 horas") o fecha absoluta para antiguas
- Color: texto amber-600, tamano xs

## Componente Reutilizable: ConfirmDeleteDialog

Para evitar duplicar el dialog de confirmacion en cada entidad:

```typescript
interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;          // "Eliminar Apiario"
  description: string;    // "Se eliminaran todas las colmenas..."
  isLoading: boolean;
}
```

## Prioridad de Implementacion

| Orden | Entidad | Justificacion |
|-------|---------|---------------|
| 1 | Apiarios | Mas simple, sirve de base para las demas |
| 2 | Colmenas | La mas usada en campo |
| 3 | Tareas | Toggle ya existe, agregar edit/delete es natural |
| 4 | Inspecciones | Formulario mas complejo pero mismo patron |
| 5 | Produccion | Patron identico a inspecciones |
