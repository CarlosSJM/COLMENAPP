# Feature: Registro de Inspecciones

## Descripcion
Las inspecciones son el nucleo del seguimiento de salud. Combinan datos del documento tecnico (peso, varroa, tratamientos) con observaciones estandar de Figma (queen_seen, brood_pattern, temperament).

## Pantalla

### Lista de Inspecciones
- Cards verticales con informacion resumida
- Cada card muestra: nombre de colmena, fecha formateada, badges de brood_pattern y health_status
- Detalle: queen_seen, temperament, peso, actividad, varroa, diseases
- Seccion de tratamiento (si aplica) con fondo azul
- Notas al final de cada card

### Formulario (Dialog, scrollable)
Secciones del formulario:

1. **Basico**: Colmena (dropdown), fecha
2. **Reina y cria**: queen_seen (checkbox), brood_pattern (select), temperament (select)
3. **Metricas**: peso (kg), conteo de varroa
4. **Estado**: activity_level (select), health_status (select)
5. **Enfermedades**: diseases (texto libre, separado por comas)
6. **Tratamiento**: checkbox treatment_applied -> si activo, muestra product + dose
7. **Notas**: textarea

## Badges de Color

### brood_pattern
| Valor | Color |
|-------|-------|
| excellent | Verde |
| good | Azul |
| fair | Amarillo |
| poor | Rojo |

### health_status
| Valor | Color |
|-------|-------|
| healthy / Saludable | Verde |
| weak / Debil | Amarillo |
| sick / Enferma | Naranja |
| critical / Critica | Rojo |

### temperament
| Valor | Color |
|-------|-------|
| calm | Verde |
| normal | Azul |
| aggressive | Rojo |

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /api/v1/inspections | Listar inspecciones |
| POST | /api/v1/inspections | Crear inspeccion |
| GET | /api/v1/inspections/:id | Obtener inspeccion |
| PUT | /api/v1/inspections/:id | Actualizar inspeccion |
| DELETE | /api/v1/inspections/:id | Eliminar inspeccion |
| GET | /api/v1/hives/:id/inspections | Inspecciones de una colmena |

## Modelo
Ver `docs/database/schema.md` - Inspection
