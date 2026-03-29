# Feature: Registro de Produccion

## Descripcion
Registro de cosechas de miel, cera y propoleo vinculadas a cada colmena.

## Pantalla

### Vista Principal
- **3 tarjetas de estadisticas**: Miel total (kg), Cera total (kg), Propoleo total (g)
  - Cada tarjeta muestra promedio por cosecha
  - Iconos: Droplet (miel), Package (cera), Sparkles (propoleo)
- **Grafico de barras**: Produccion agrupada por colmena (miel + cera)
- **Tabla de registros**: Fecha, colmena, miel, cera, propoleo
  - Filas con alternancia de color

### Formulario (Dialog)
- Campos: colmena (dropdown), fecha, miel (kg), cera (kg), propoleo (g)
- Valores numericos con step 0.1 para kg, step 1 para g

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /api/v1/productions | Listar registros de produccion |
| POST | /api/v1/productions | Registrar produccion |
| GET | /api/v1/productions/:id | Obtener registro |
| PUT | /api/v1/productions/:id | Actualizar registro |
| DELETE | /api/v1/productions/:id | Eliminar registro |
| GET | /api/v1/hives/:id/productions | Produccion de una colmena |
| GET | /api/v1/productions/stats | Estadisticas agregadas |

## Modelo
Ver `docs/database/schema.md` - Production
