# Feature: Gestion de Tareas

## Descripcion
Tareas vinculadas opcionalmente a colmenas. Permiten planificar y dar seguimiento a actividades del apiario.

## Pantalla

### Vista Principal
- **3 tarjetas de estadisticas**: Pendientes, Vencidas, Completadas
- **Filtros**: Todas / Pendientes / Completadas (botones toggle)
- **Lista de tareas**: Cards con checkbox, titulo, descripcion, fecha, prioridad, colmena

### Card de Tarea
- Checkbox para marcar completada (con feedback toast)
- Titulo (tachado si completada)
- Descripcion
- Badge de prioridad (colores)
- Badge "Vencida" si fecha pasada y no completada
- Fecha de vencimiento formateada
- Badge con nombre de colmena (si vinculada)
- Opacidad reducida si completada

### Formulario (Dialog)
- Campos: titulo, descripcion, fecha de vencimiento, prioridad (dropdown), colmena (dropdown, opcional con opcion "Ninguna")

## Prioridades con Colores

| Prioridad | Color |
|-----------|-------|
| high | Rojo |
| medium | Amarillo |
| low | Verde |

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /api/v1/tasks | Listar tareas |
| POST | /api/v1/tasks | Crear tarea |
| GET | /api/v1/tasks/:id | Obtener tarea |
| PUT | /api/v1/tasks/:id | Actualizar tarea |
| PATCH | /api/v1/tasks/:id/toggle | Toggle completada |
| DELETE | /api/v1/tasks/:id | Eliminar tarea |

## Modelo
Ver `docs/database/schema.md` - Task
