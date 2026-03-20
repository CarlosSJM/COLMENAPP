# Feature: Gestion de Colmenas

## Descripcion
Las colmenas pertenecen a un apiario. Cada colmena tiene un codigo unico, estado operativo, y datos de la reina. Incluye funcionalidad de QR para identificacion rapida.

## Pantalla

### Lista de Colmenas
- Grid de cards (1/2/3 columnas responsive)
- Cada card muestra: codigo (badge), estado (badge color), nombre, poblacion, cuadros, fecha ultima inspeccion, origen de reina
- Boton "Ver QR" en cada card
- Boton "Detalles" en cada card
- FAB (boton flotante) para escanear QR en esquina inferior derecha
- Si se accede desde un apiario: breadcrumb + filtrado automatico

### Formulario (Dialog)
- Campos: codigo, nombre, apiario (si no viene de un apiario), estado, origen de reina, poblacion, cuadros, fecha de instalacion, notas
- Selector de apiario solo si se accede desde ruta general

### Detalle (Dialog)
- Informacion completa de la colmena
- Boton "Ver QR"
- Alerta visual si estado es quarantine o lost

## QR Scanner
- **FAB**: Boton flotante con icono de escaneo
- **Formato QR**: `colmenapp://hive/{code}`
- **Accion**: Redirige al detalle de la colmena

## QR Modal
- Codigo QR generado para la colmena
- Muestra: QR grande, codigo, nombre, apiario
- Botones: Imprimir, Cerrar

## Estados con Colores

| Estado | Color |
|--------|-------|
| active | Verde |
| inactive | Gris |
| quarantine | Naranja |
| lost | Rojo |

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /api/v1/hives | Listar todas las colmenas |
| POST | /api/v1/hives | Crear colmena |
| GET | /api/v1/hives/:id | Obtener colmena |
| PUT | /api/v1/hives/:id | Actualizar colmena |
| DELETE | /api/v1/hives/:id | Eliminar colmena (CASCADE) |
| GET | /api/v1/hives/code/:code | Buscar por codigo (QR) |

## Modelo
Ver `docs/database/schema.md` - Hive
