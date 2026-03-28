# Aprendizajes del Proyecto COLMENAPP

Documento de lecciones aprendidas durante el diseno, desarrollo e implementacion de COLMENAPP. Recoge aprendizajes tecnicos, funcionales, de diseno y de interaccion humano-IA.

**Proyecto:** TFM Master AI4Devs / LIDR.co
**Periodo:** Enero - Marzo 2026

---

## 1. Aprendizajes Tecnicos

### 1.1 Tailwind v4 y shadcn/ui no son plug-and-play juntos

Los componentes de shadcn/ui estan disenados para Tailwind v3. Al usar Tailwind v4 (via `@tailwindcss/vite`), las clases de tema como `bg-background`, `bg-popover`, `border-input` no se resuelven automaticamente.

**Problema:** Modales transparentes, selects sin fondo, inputs sin borde visible.

**Solucion:** CSS global explicito con `!important` para los data-slots de Radix UI:
- `[data-slot="dialog-content"]` con `background-color: white`
- `[data-slot="select-trigger"]` y `[data-slot="select-content"]` con fondos blancos
- El overlay del Dialog requirio `box-shadow: 0 0 0 9999px rgba(0,0,0,0.6)` porque el overlay de Radix no renderizaba visualmente aunque tenia las propiedades CSS correctas

**Leccion:** Cuando se adopta una version mayor nueva de un framework CSS, hay que verificar la compatibilidad de TODOS los componentes UI antes de avanzar. Un prototipo rapido con un modal + select + input habria detectado estos problemas en 10 minutos.

### 1.2 Prisma 7 vs Prisma 6 - breaking changes silenciosos

Al instalar Prisma sin fijar version, se instalo la v7 que cambio la configuracion del datasource (ya no soporta `url` en schema.prisma).

**Leccion:** Fijar versiones mayores de dependencias criticas (`prisma@6`, no `prisma@latest`). Leer release notes antes de actualizar.

### 1.3 Puertos en conflicto con servicios locales

El Docker de PostgreSQL no arrancaba en puerto 5432 (ocupado por PG local) ni 5433 (ocupado por otro servicio). Termino en 5434.

**Leccion:** En el `.env.example` y documentacion, indicar que el puerto puede necesitar ajuste. Mejor aun: usar un puerto no estandar desde el principio (ej: 5434) para evitar conflictos con servicios locales.

### 1.4 Los campos denormalizados requieren una capa de adaptacion

El backend devuelve `{ apiary: { name: "..." } }` (relacion Prisma con include), pero los componentes de Figma esperan `{ apiary_name: "..." }` (campo plano).

**Solucion:** Capa `services/adapters.ts` que mapea las respuestas del backend al formato que esperan los componentes.

**Leccion:** Definir el contrato de datos entre backend y frontend al inicio. Si el frontend se disena primero (como con Figma), documentar el formato esperado y crear los adapters desde el principio, no al integrar.

### 1.5 Los enums deben tener una unica fuente de verdad

Los componentes de Figma usaban enums en espanol (`Saludable`, `Comprada`) mientras el backend los definia en ingles (`healthy`, `purchased`).

**Solucion:** Enums siempre en ingles en BD y API. Mapeo centralizado en `utils/enums.ts` para traducir a espanol en UI.

**Leccion:** Decidir el idioma de los enums ANTES de disenar la UI. Un archivo de mapeo centralizado evita traduciones inline dispersas por el codigo.

### 1.6 El focus ring de inputs es un detalle que afecta mucho la percepcion

Un `ring-[3px]` en Tailwind crea un borde de focus que se superpone a los labels si no hay suficiente espacio. Un detalle que parece menor genera una sensacion de "app rota".

**Leccion:** Los estilos de focus, hover y active deben probarse visualmente en todos los formularios antes de dar por terminada la UI. Un outline sutil (2px, baja opacidad) funciona mejor que un ring grueso.

---

## 2. Aprendizajes Funcionales

### 2.1 La comparacion Figma vs Documentacion es imprescindible

El diseno de Figma y la documentacion tecnica divergian en 8 puntos criticos: estados de colmena diferentes, campos faltantes, pantallas no incluidas, modelo de datos inconsistente.

**Leccion:** Nunca asumir que un diseno UI y una spec tecnica estan alineados. La revision punto por punto (9 decisiones documentadas) evito implementar una UI que no encajaba con el backend.

### 2.2 Las reglas de dominio apicola deben estar en el backend

Reglas como "al crear inspeccion, actualizar last_inspection de la colmena" o "al crear/eliminar colmena, actualizar hive_count del apiario" son logica de dominio que debe vivir en el backend, no en el frontend.

**Leccion:** Identificar las reglas de integridad del dominio al disenar el schema y documentarlas en la constitution del backend. No dejar que el frontend gestione la consistencia de datos.

### 2.3 El MVP no necesita todo lo que parece necesitar

Produccion y Tareas se incluyeron en el MVP por decision del usuario, pero el Dashboard se simplifico eliminando graficos de produccion. El QR scanner se incluyo pero el offline sync completo (Dexie.js + cola) es cuestionable para el MVP.

**Leccion:** En cada feature, preguntarse: "Si no esta, el usuario puede usar la app?". Si la respuesta es si, es candidata a fase posterior.

### 2.4 El seed de datos es tan importante como la migracion

Sin datos de prueba realistas (6 colmenas, 5 inspecciones, 3 apiarios), es imposible validar que la UI funciona correctamente. El seed revela problemas de formato, campos vacios, y edge cases.

**Leccion:** Crear el seed inmediatamente despues de la migracion, con datos que cubran todos los estados posibles (active, inactive, quarantine, lost, con/sin tratamiento, etc.).

---

## 3. Aprendizajes de Diseno

### 3.1 Disenar para el campo cambia todo

COLMENAPP se usa en un apiario: sol directo, guantes, abejas, prisa. Esto implica:
- Touch targets grandes (44px minimo)
- No depender de hover
- Selects > texto libre (menos escritura)
- Colores con alto contraste (WCAG AA para sol directo)
- Feedback inmediato (toasts en cada accion)

**Leccion:** El contexto de uso fisico del usuario debe ser el primer principio de diseno, no un afterthought. "Disenar para guantes" es un filtro mas potente que cualquier design system.

### 3.2 Los colores de estado deben reflejar severidad real

Verde no es "bonito", es "la colmena esta bien". Rojo no es "destacar", es "accion urgente requerida". Amarillo no es "alternativo", es "atencion necesaria".

**Leccion:** En apps de dominio profesional, los colores son informacion, no decoracion. El mapeo color-severidad debe ser consistente en toda la app.

### 3.3 Figma AI genera codigo funcional pero necesita revision

El codigo exportado de Figma AI funciona, pero usa mock data inline, mezcla idiomas en enums, y puede no incluir pantallas criticas (como login). Es un excelente punto de partida, NO un producto terminado.

**Leccion:** Tratar el export de Figma como un "borrador funcional". Planificar tiempo para: revision contra specs, correccion de tipos, adaptacion de imports, y testing visual.

### 3.4 El patron padres inteligentes / hijos presentacionales debe ser flexible

Forzar reglas rigidas ("no mas de 150 lineas", "nunca logica en hijos") genera codigo artificial. Un padre largo con mucha logica es aceptable si la funcionalidad lo requiere.

**Leccion:** Las convenciones de componentizacion deben ser guias pragmaticas, no leyes. Extraer hijos cuando hay reutilizacion real o cuando mejora la legibilidad, no por cumplir una metrica.

---

## 4. Aprendizajes de Interaccion Humano-IA

### 4.1 La revision iterativa punto por punto funciona mejor que la validacion en bloque

Las 9 decisiones de diseno se tomaron una por una, con aprobacion explicita del usuario en cada paso. Esto evito malentendidos y permitio ajustes en tiempo real.

**Leccion:** Cuando hay multiples decisiones interrelacionadas, presentarlas una a una con opciones claras. No asumir que el usuario quiere A o B; presentar ambas con pros/contras y dejar que decida.

### 4.2 "Registra todo en la documentacion" cambia la dinamica

Cuando el usuario pidio documentar cada decision, el proyecto paso de "hacer cosas" a "hacer cosas con trazabilidad". Esto creo un artefacto valioso (DESIGN_DECISIONS.md) que sirvio como referencia durante toda la implementacion.

**Leccion:** La documentacion no es overhead, es contexto futuro. Documentar decisiones con su justificacion permite retomar el trabajo semanas despues sin perder el hilo.

### 4.3 La IA debe proponer pero no imponer restricciones

Las restricciones de componentizacion iniciales ("no mas de 150 lineas", "nunca logica en hijos") eran demasiado rigidas para el usuario. Al suavizarlas, se convirtieron en guias utiles.

**Leccion:** Proponer best practices como sugerencias, no como reglas absolutas. El usuario conoce su contexto mejor que la IA. Si rechaza una restriccion, es porque tiene una razon valida.

### 4.4 Spec Kit como metodologia da estructura al caos

Sin Spec Kit, las decisiones estaban dispersas entre conversaciones, docs, y codigo. Con los 4 documentos core (constitution, spec, plan, tasks), todo tiene un lugar y una referencia.

**Leccion:** Un framework de especificaciones (aunque sea ligero) es mas valioso que documentacion ad-hoc. La constitution como "principios inmutables" es especialmente util para evitar decisiones inconsistentes.

### 4.5 Preguntar antes de actuar evita retrabajo

Cada vez que se pregunto "que opinas?" o "te parece correcto?" antes de implementar, se evitaron cambios posteriores. Las veces que se asumio la respuesta, hubo que corregir.

**Leccion:** En proyectos colaborativos humano-IA, la confirmacion explicita en puntos de decision criticos ahorra mas tiempo del que cuesta. "Explica lo que vas a hacer antes de hacerlo" es una regla de oro.

### 4.6 Los commits frecuentes y descriptivos son la mejor documentacion de progreso

14 commits en la rama feature, cada uno con un mensaje descriptivo y scope (feat, fix, docs). Esto permite navegar el historial y entender que se hizo y por que.

**Leccion:** Commitear despues de cada tarea completada, no al final del dia. El mensaje de commit debe responder "que" y "por que", no solo "que archivos cambiaron".

---

## 5. Metricas del Proyecto

| Metrica | Valor |
|---------|-------|
| Commits en feature branch | 14 |
| Prompts documentados | 21 |
| Modelos de BD | 6 |
| Enums de BD | 7 |
| Endpoints API | 33 |
| Pantallas UI | 9 |
| Componentes UI (shadcn) | ~15 |
| Fixes UI (Tailwind v4) | 7 |
| Fases completadas | 3 de 5 |
| Documentos en docs/ | 16+ |

---

*Documento vivo - se actualizara con nuevos aprendizajes en fases posteriores.*
