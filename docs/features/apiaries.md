# Feature: Gestion de Apiarios

## Descripcion
Los apiarios son el nivel jerarquico superior. Cada usuario puede tener multiples apiarios, y cada apiario contiene multiples colmenas.

## Pantalla

### Lista de Apiarios
- Grid de cards (1/2/3 columnas responsive)
- Cada card muestra: nombre, ubicacion, numero de colmenas, notas
- Coordenadas GPS opcionales
- Click en card -> navega a colmenas del apiario
- Boton "Nuevo Apiario"
- Estado vacio con mensaje de bienvenida

### Formulario (Dialog)
- Campos: nombre, ubicacion, latitud (opcional), longitud (opcional), notas
- Botones: Cancelar, Agregar Apiario

## Navegacion Jerarquica

```
Sidebar: Apiarios -> [Click apiario] -> Colmenas del apiario
Breadcrumb: Apiarios > Apiario Norte > Colmenas
```

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /api/v1/apiaries | Listar apiarios del usuario |
| POST | /api/v1/apiaries | Crear apiario |
| GET | /api/v1/apiaries/:id | Obtener apiario |
| PUT | /api/v1/apiaries/:id | Actualizar apiario |
| DELETE | /api/v1/apiaries/:id | Eliminar apiario (CASCADE) |
| GET | /api/v1/apiaries/:id/hives | Listar colmenas del apiario |

## Modelo
Ver `docs/database/schema.md` - Apiary
