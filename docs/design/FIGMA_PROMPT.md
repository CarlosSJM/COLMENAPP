# Prompt para Figma AI - COLMENAPP

Copia este prompt en Figma AI para actualizar los diseños del MVP.

---

## PROMPT:

Actualiza el diseño de COLMENAPP (aplicación de gestión apícola) con los siguientes cambios:

### 1. AGREGAR - Pantallas de Autenticación
Crear 3 pantallas nuevas:
- **Login**: Email, contraseña, botón "Iniciar sesión", enlace a registro y recuperar contraseña
- **Registro**: Nombre, email, contraseña, confirmar contraseña, botón "Crear cuenta"
- **Recuperar contraseña**: Email, botón "Enviar enlace"

Mantener el estilo visual con colores amber/miel del diseño actual.

### 2. AGREGAR - Gestión de Apiarios
Crear nueva sección "Apiarios" en el sidebar (entre Dashboard y Colmenas).

**Pantalla de lista de Apiarios:**
- Grid de cards con: nombre, ubicación, número de colmenas
- Botón "Nuevo Apiario"

**Formulario de Apiario:**
- Campos: nombre, ubicación (texto), coordenadas (lat/lng opcionales), notas

**Navegación jerárquica:**
- Al hacer click en un apiario → mostrar sus colmenas
- Breadcrumb: Apiarios > [Nombre Apiario] > Colmenas

### 3. MODIFICAR - Pantalla de Colmenas
Actualizar los campos del formulario de colmena:

**Campos a mantener:** name, notes, population, frames

**Campos a agregar:**
- code (texto, ej: "A-001")
- installed_at (fecha)
- Sección de QR con botones "Ver QR" e "Imprimir QR"

**Campos a cambiar:**
- status: cambiar opciones de "healthy/warning/critical" a "active/inactive/quarantine/lost" con colores apropiados
- Reemplazar queen_age por queen_origin: dropdown con opciones "Comprada/Criada/Enjambre/Desconocida"

**Campos a eliminar:** location (ahora está en Apiario)

**Agregar FAB** (botón flotante) con icono de QR/cámara para escanear códigos.

### 4. MODIFICAR - Pantalla de Inspecciones
Agregar campos adicionales al formulario de inspección:

**Mantener de Figma:** queen_seen, brood_pattern, temperament, diseases, notes

**Agregar nuevos campos:**
- weight (número, kg)
- varroa_count (número)
- Sección "Tratamiento": checkbox treatment_applied, si está activo mostrar: treatment_product (texto), treatment_dose (texto)
- activity_level: dropdown "Baja/Media/Alta"
- health_status: dropdown "Saludable/Débil/Enferma/Crítica" con colores

### 5. SIMPLIFICAR - Dashboard
Reducir a 4 tarjetas de estadísticas:
1. Total Colmenas (con desglose por estado)
2. Requieren Atención (colmenas en quarantine o críticas)
3. Inspecciones Pendientes (sin inspección en 15 días)
4. Tareas Pendientes (con indicador de alta prioridad)

Reducir a 2 gráficos:
1. Gráfico de barras: Colmenas por Apiario
2. Lista: Últimas 5 inspecciones

Eliminar gráficos de producción del dashboard.

### 6. MANTENER - Producción
Mantener la pantalla de Producción como está, con:
- 3 tarjetas: Miel total, Cera total, Propóleo total
- Gráfico de barras por colmena
- Tabla de registros

### 7. AGREGAR - Pantalla de Tareas
Crear pantalla dedicada para tareas:
- Lista de tareas con filtros: Todas/Pendientes/Completadas
- Cards con: título, descripción, fecha límite, prioridad (badge color), colmena asociada (si aplica)
- Checkbox para marcar completada
- Formulario: título, descripción, fecha límite, prioridad (alta/media/baja), dropdown colmena (opcional)

### 8. AGREGAR - Indicadores Offline/Sync en Header
Modificar el header para incluir:
- Badge de estado de conexión: verde "Online" o naranja "Offline" con icono de nube tachada
- Badge de sincronización: "[N pendientes]" cuando hay cambios sin sincronizar
- Ubicación: esquina superior derecha del header

Layout del header:
```
COLMENAPP                    [3 pendientes] [Offline]
```

### 9. AGREGAR - Modal de QR
Crear modal para mostrar código QR de colmena:
- Código QR grande centrado
- Texto con código de la colmena (ej: "A-001")
- Nombre del apiario
- Botones: "Imprimir" y "Cerrar"

### NOTAS DE ESTILO:
- Mantener paleta de colores amber/miel actual
- Mantener componentes shadcn/ui
- Diseño responsive (mobile-first)
- Usar iconos de Lucide React consistentes con el diseño actual
