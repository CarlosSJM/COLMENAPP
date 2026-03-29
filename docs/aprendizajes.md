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

## 5. Aprendizajes Fase 4 (QR + PWA)

### 5.1 Generar QR localmente es mejor que depender de una API

El componente Figma original usaba `api.qrserver.com` para generar QR. Esto implica: dependencia de red, latencia, y falla en offline. Con `qrcode.react` el QR se genera instantaneamente en el navegador como SVG.

**Leccion:** Para contenido que se puede generar en el cliente (QR, graficos, previsualizaciones), siempre preferir librerias locales sobre APIs externas.

### 5.2 El formato del QR debe ser un protocolo propio

Usar `colmenapp://hive/{code}` como formato del QR permite distinguir codigos de COLMENAPP de cualquier otro QR. El scanner parsea este formato pero tambien acepta texto plano como fallback.

**Leccion:** Definir un esquema URI propio para los datos de la app. Es una decision barata que da flexibilidad futura (deep links, integracion con otras apps).

### 5.3 La PWA es el 80/20 del offline

El manifest + service worker + meta tags dan el 80% del valor offline (app instalable, assets cacheados, carga rapida) con el 20% del esfuerzo. Dexie.js + sync queue darian el 20% restante (mutaciones offline) pero con el 80% del esfuerzo.

**Leccion:** Para un MVP, PWA basica (cache de assets + fallback API) es suficiente. La sincronizacion offline completa es una feature de v2.

### 5.4 html5-qrcode es pesada pero funcional

La libreria html5-qrcode anadio ~380KB al bundle (de 813KB a 1196KB). Funciona bien pero es pesada.

**Leccion:** Para produccion, considerar lazy loading del scanner (solo cargarlo cuando el usuario pulsa el FAB). En el MVP es aceptable.

---

## 6. Aprendizajes Fase 4b (Edicion y Eliminacion)

### 6.1 Analizar antes de implementar ahorra el 80% del trabajo

Antes de escribir codigo, se analizo que capas necesitaban cambios. Resultado: backend y BD ya estaban listos (PUT/DELETE + updated_at). Solo faltaba frontend. Sin este analisis, se habria perdido tiempo revisando o reescribiendo backend innecesariamente.

**Leccion:** Antes de implementar una feature nueva, hacer un inventario rapido de que ya existe en cada capa. La tabla "tiene/falta" evita duplicar trabajo.

### 6.2 Un componente reutilizable vale mas que cinco copias

ConfirmDeleteDialog se creo una vez y se uso en 5 entidades. Sin el, habria 5 implementaciones ligeramente diferentes de dialogs de confirmacion, con inconsistencias visuales.

**Leccion:** Cuando 3+ componentes necesitan la misma UI, extraer un componente reutilizable ANTES de implementar los casos individuales. Definir la interfaz primero (props), implementar despues.

### 6.3 No todo necesita edicion en un MVP

Inspecciones y Produccion son registros historicos. Editarlos no tiene sentido en la practica apicola (se registra una nueva inspeccion, no se edita la anterior). Tener los endpoints backend listos por si acaso es suficiente.

**Leccion:** Cuestionar cada accion CRUD: "El usuario realmente necesita esto?". Crear y listar son obligatorios. Editar y eliminar dependen del dominio.

### 6.4 Los warnings CASCADE son UX critica

Cuando un apicultor elimina un apiario con 8 colmenas y anos de datos, un simple "Estas seguro?" no es suficiente. El warning "Se eliminaran 8 colmenas y todos sus registros" previene perdida de datos accidental.

**Leccion:** En operaciones destructivas con CASCADE, el dialog de confirmacion debe mostrar el IMPACTO concreto (numero de registros afectados), no solo pedir confirmacion generica.

### 6.5 Cerrar dialog antes de abrir otro

En Colmenas, al pulsar "Editar" desde el detalle, primero se cierra el detalle y luego se abre el editor. Apilar dialogs genera problemas de z-index, overlays multiples, y confusion visual.

**Leccion:** Nunca apilar dialogs modales. Si una accion dentro de un dialog abre otro dialog, cerrar el primero antes.

---

## 7. Aprendizajes Fase 5 (Testing)

### 7.1 Tests e2e contra BD real valen mas que mocks

Los tests e2e ejecutan contra PostgreSQL real en Docker. Esto descubrio que el error de unique constraint en `code` de Hive devuelve un 500 generico (Prisma no lo convierte a 409 automaticamente). Con mocks, este comportamiento nunca se habria detectado.

**Leccion:** Para APIs con reglas de BD (unique, cascade, foreign keys), testear contra la BD real. Los mocks ocultan el comportamiento real de las constraints.

### 7.2 El aislamiento por email unico con timestamp es simple y efectivo

Cada suite usa `test-auth-{Date.now()}@colmenapp.com` como email. Esto permite ejecutar tests en paralelo o repetidamente sin conflictos. El cleanup en `afterAll` borra por email, y CASCADE limpia todo lo asociado.

**Leccion:** Para tests e2e, usar identificadores unicos con timestamp en vez de datos fijos. Limpiar por ese identificador al final. CASCADE simplifica la limpieza.

### 7.3 Ownership isolation se testea mejor con dos usuarios

Los tests de Apiaries crean dos usuarios y verifican que user2 no puede ver/editar/eliminar datos de user1. Esto es un test de seguridad critico que requiere dos tokens JWT separados.

**Leccion:** Siempre testear ownership con al menos 2 usuarios. Un solo usuario no revela fallos de aislamiento.

### 7.4 El test de password_hash no expuesto es un test de seguridad minimo

Un simple `expect(res.body.password_hash).toBeUndefined()` en el endpoint `/me` verifica que no se filtra el hash. Es un test de una linea con impacto de seguridad alto.

**Leccion:** Los tests de seguridad mas valiosos son a menudo los mas simples. Un `toBeUndefined()` en campos sensibles vale mas que un audit complejo.

---

### 7.5 La revision de seguridad encuentra bugs de diseño, no solo de codigo

La revision de seguridad descubrio que el modelo Task no tenia `user_id`. No era un bug de codigo (el codigo hacia lo que podia con el schema), era un bug de diseño de datos. La tabla de tareas no podia vincular tareas generales a un usuario.

**Leccion:** Las revisiones de seguridad deben incluir el schema de BD, no solo el codigo. Un campo faltante en el modelo puede ser mas critico que un bug en un endpoint.

### 7.6 CORS abierto es un error silencioso

`enableCors()` sin parametros funciona perfectamente en desarrollo. Nadie nota que cualquier sitio web podria hacer requests a la API. Es un error que solo se detecta con una checklist explicita.

**Leccion:** Los valores por defecto "permisivos" de los frameworks son peligrosos. Siempre configurar explicitamente: CORS, rate limiting, headers de seguridad.

### 7.7 Documentar la configuracion de produccion DURANTE el desarrollo, no despues

La configuracion de CORS para produccion se documento inmediatamente despues de corregirla en desarrollo. Si se hubiera dejado para "cuando despleguemos", se habria olvidado o se habria desplegado con CORS abierto.

**Leccion:** Cada fix de seguridad debe incluir documentacion de como configurarlo en produccion. El mismo PR que corrige el problema en dev debe documentar que hacer en prod. La documentacion de despliegue no es un "despues", es parte del fix.

---

### 7.8 Los unit tests con mocks complementan los e2e, no los reemplazan

Los tests e2e descubrieron que las tareas generales no se listaban (bug de ownership). Los unit tests verifican que la logica de hive_count y last_inspection se ejecuta correctamente. Ambos son necesarios: e2e para integracion real, unitarios para logica aislada.

**Leccion:** e2e primero (encuentran bugs reales), unitarios despues (verifican reglas de dominio con precision). No elegir uno u otro, usar ambos con propositos distintos.

---

## 8. Metricas del Proyecto

| Metrica | Valor |
|---------|-------|
| Commits en feature branch | 30 |
| Prompts documentados | 27 |
| Modelos de BD | 6 |
| Enums de BD | 7 |
| Endpoints API | 33 |
| Pantallas UI | 9 |
| Componentes UI (shadcn) | ~15 |
| Componentes custom | QRScanner, QRModal, ConfirmDeleteDialog, adapters |
| Fixes UI (Tailwind v4) | 7 |
| Entidades con CRUD completo | 5 (Apiarios, Colmenas, Inspecciones, Produccion, Tareas) |
| Tests e2e backend | 34 (4 suites) |
| Tests unitarios backend | 24 (4 suites) |
| Tests totales | 58 |
| Fases completadas | 5 de 5 |
| Vulnerabilidades encontradas/corregidas | 3 |
| Documentos en docs/ | 21 |
| Bundle size | ~1200KB (~360KB gzip) |
| Aprendizajes documentados | 33 |

---

*Documento vivo - se actualizara con nuevos aprendizajes en fases posteriores.*
