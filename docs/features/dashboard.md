# Feature: Dashboard

## Descripcion
Vista resumen con las metricas mas importantes. Version simplificada enfocada en salud de colmenas, no en produccion.

## Pantalla

### 4 Tarjetas de Estadisticas

| Tarjeta | Datos | Icono | Color |
|---------|-------|-------|-------|
| Total Colmenas | Numero total + desglose por estado (activas, inactivas, cuarentena, perdidas) | Hexagon | Amber |
| Requieren Atencion | Colmenas en quarantine + inspecciones con health_status critico | AlertTriangle | Rojo |
| Inspecciones Pendientes | Colmenas sin inspeccion en 15+ dias | ClipboardList | Naranja |
| Tareas Pendientes | Total no completadas + indicador de alta prioridad | CheckSquare | Azul |

### 2 Visualizaciones

#### Grafico de Barras: Colmenas por Apiario
- Libreria: Recharts (BarChart)
- Eje X: nombre del apiario
- Eje Y: numero de colmenas
- Color: amber (#f59e0b)

#### Lista: Ultimas 5 Inspecciones
- Cada item muestra: nombre de colmena, fecha (dia + mes), health_status con color
- Icono contextual: AlertTriangle (rojo) si critica/enferma, ClipboardList (verde) si saludable
- Notas truncadas (1 linea)

## Datos Calculados

```typescript
// Logica de calculo
totalHives = count(hives)
needsAttention = count(quarantine) + count(critical inspections sin duplicar)
needsInspection = count(hives donde last_inspection < 15 dias atras)
pendingTasks = count(tasks donde completed = false)
highPriorityTasks = count(tasks donde completed = false AND priority = high)
```

## No incluido en MVP
- Graficos de produccion (estan en pantalla Production)
- Linea temporal
- Estadisticas de miel/cera/propoleo
