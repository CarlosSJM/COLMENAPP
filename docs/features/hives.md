# Feature: Gestion de Colmenas

## Descripcion
Las colmenas pertenecen a un apiario. Cada colmena tiene un codigo unico, estado operativo, y datos de la reina. Incluye funcionalidad de QR para identificacion rapida en campo.

## Pantalla

### Lista de Colmenas
- Grid de cards (1/2/3 columnas responsive)
- Cada card muestra: codigo (badge), estado (badge color), nombre, poblacion, cuadros, fecha ultima inspeccion, origen de reina
- Boton "Ver QR" en cada card → abre QR Modal
- Boton "Detalles" en cada card → abre Dialog detalle
- FAB (boton flotante) para escanear QR en esquina inferior derecha
- Si se accede desde un apiario: breadcrumb + filtrado automatico

### Formulario (Dialog)
- Campos: codigo, nombre, apiario (si no viene de un apiario), estado, origen de reina, poblacion, cuadros, fecha de instalacion, notas
- Selector de apiario solo si se accede desde ruta general

### Detalle (Dialog)
- Informacion completa de la colmena
- Boton "Ver QR"
- Alerta visual si estado es quarantine o lost

## QR Scanner (Implementado)

### Que es
Permite al apicultor escanear el codigo QR pegado en una colmena fisica para acceder instantaneamente a su ficha digital.

### Como funciona
1. El apicultor pulsa el FAB (boton flotante) con icono de escaneo
2. Se abre la camara del movil (solicita permiso)
3. Al detectar un QR, extrae el codigo de colmena
4. Busca la colmena via API (`GET /api/v1/hives/code/{code}`)
5. Si la encuentra, abre el dialog de detalle
6. Si no la encuentra, muestra toast de error

### Formato del QR
```
colmenapp://hive/{code}
```
Ejemplo: `colmenapp://hive/AN-001`

El scanner tambien acepta texto plano (solo el codigo) como fallback.

### Implementacion tecnica
- Libreria: `html5-qrcode` (acceso a camara via Web API)
- Componente: `QRScanner.tsx`
- Usa camara trasera (`facingMode: "environment"`) ideal para uso en campo
- FPS: 10, zona de deteccion: 250x250px
- Manejo de errores: muestra mensaje si no hay permiso de camara

### Ventajas
- **Identificacion instantanea**: Sin buscar manualmente en la lista
- **Uso con guantes**: Un solo toque en el FAB + apuntar la camara
- **Sin conexion a internet**: El QR contiene el codigo, la busqueda es local si hay cache

## QR Modal (Implementado)

### Que es
Genera y muestra el codigo QR unico de cada colmena para imprimirlo y pegarlo en la colmena fisica.

### Como funciona
1. En la card o detalle de colmena, pulsar "Ver QR"
2. Se abre modal con el QR generado localmente
3. Muestra: codigo QR grande, codigo de colmena, nombre, apiario
4. Boton "Imprimir" para imprimir el QR
5. Boton "Cerrar"

### Implementacion tecnica
- Libreria: `qrcode.react` (QRCodeSVG)
- Generado 100% en local (sin llamadas a APIs externas)
- Color: amber-900 (#78350f) para coherencia visual
- Formato SVG para impresion de alta calidad
- Nivel de correccion: M (15% de tolerancia a dano)

### Ventajas
- **Sin dependencia de red**: QR se genera en el navegador
- **Imprimible**: SVG escala sin perder calidad
- **Resistente**: Nivel M de correccion tolera suciedad parcial en el QR

## Flujo completo QR

```
Apicultor                       App
    |                            |
    |  1. Imprime QR desde app   |
    |  2. Pega QR en colmena     |
    |        ...tiempo...        |
    |  3. En campo, pulsa FAB    |
    |                            |  Abre camara
    |  4. Apunta a QR            |
    |                            |  Lee "colmenapp://hive/AN-001"
    |                            |  Busca por codigo
    |  5. Ve ficha de colmena    |  Abre detalle
    |  6. Registra inspeccion    |
```

## Estados con Colores

| Estado | Color | Significado |
|--------|-------|-------------|
| active | Verde | Colmena en produccion normal |
| inactive | Gris | Temporalmente sin actividad |
| quarantine | Naranja | Requiere atencion/tratamiento |
| lost | Rojo | Colmena perdida o muerta |

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /api/v1/hives | Listar todas las colmenas |
| POST | /api/v1/hives | Crear colmena |
| GET | /api/v1/hives/:id | Obtener colmena |
| PUT | /api/v1/hives/:id | Actualizar colmena |
| DELETE | /api/v1/hives/:id | Eliminar colmena (CASCADE) |
| GET | /api/v1/hives/code/:code | Buscar por codigo (QR scanner) |

## Modelo
Ver `docs/database/schema.md` - Hive
