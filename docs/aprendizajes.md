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

## 8. Aprendizajes de Despliegue

### 8.1 El free tier es suficiente para un MVP academico

Render Free + Vercel Hobby dan despliegue completo a coste cero. El sleep de 15 minutos en Render Free es la unica limitacion real, y para una demo es aceptable (el primer request tarda ~30s).

**Leccion:** Antes de pagar hosting, verificar si el free tier cubre las necesidades. Para MVPs y demos, casi siempre es suficiente. El coste de infraestructura no debe ser un bloqueante para entregar.

### 8.2 Auto-deploy por webhook es mas simple que CI/CD para deploy

Vercel y Render detectan push a main y despliegan automaticamente. No necesitan GitHub Actions para deploy. GitHub Actions se usa solo para CI (correr tests), no para CD.

**Leccion:** No sobreingenierar el pipeline. Si la plataforma ya tiene auto-deploy, usarlo. GitHub Actions para deploy solo aporta valor si necesitas steps custom (build Docker, etc).

### 8.3 Siempre tener un plan B de deploy manual

Si Render o Vercel fallan, tener documentado como desplegar manualmente en un VPS o GitHub Pages. Un documento de 10 lineas con los comandos evita panico el dia de la demo.

**Leccion:** Documentar la alternativa manual aunque nunca se use. Es un seguro barato.

### 8.4 Las variables de entorno de produccion son diferentes a las de desarrollo

DATABASE_URL, JWT_SECRET, CORS_ORIGIN, PORT - todas cambian entre dev y prod. Si no se documentan explicitamente, alguien (o tu yo futuro) intentara usar las de desarrollo.

**Leccion:** Crear un checklist de variables por entorno. El .env.example de desarrollo NO es la configuracion de produccion.

---

### 8.5 Swagger protegido es mejor que Swagger publico o sin Swagger

Sin Swagger, los evaluadores no pueden explorar la API. Con Swagger publico, cualquiera puede ver los endpoints. Con basic auth, solo quien tiene credenciales puede acceder. Es un equilibrio entre transparencia y seguridad.

**Leccion:** Para proyectos academicos y demos, Swagger con basic auth es ideal: muestra profesionalidad sin exponer la API al mundo. Las credenciales se comparten con los evaluadores.

### 8.6 Los wildcards de rutas cambian entre versiones de Express

`/api/docs*` funciona en Express 4 pero falla en Express 5 (path-to-regexp v8). Un error silencioso que solo aparece al ejecutar, no al compilar.

**Leccion:** Cuando una libreria falla con un error de path/routing, verificar la version de Express y path-to-regexp. Preferir arrays de rutas explicitas sobre wildcards.

### 8.7 El primer deploy siempre falla (y esta bien)

El despliegue en Render requirio 5 iteraciones: peer deps, devDependencies, path de dist, shell no disponible, seed duplicando datos. Cada error se resolvio en minutos con un fix y push.

**Leccion:** Planificar tiempo para problemas de deploy. El entorno de produccion siempre difiere del local (version de Node, instalacion de deps, paths, permisos). Cada fix es un aprendizaje que se documenta para el siguiente proyecto.

### 8.8 El seed debe ser idempotente y no destructivo

Primer intento: el seed borraba y recreaba datos del usuario demo en cada deploy (destruiria datos de produccion). Solucion: skip si el usuario ya existe. Asi el seed solo corre la primera vez.

**Leccion:** Si el seed se ejecuta en el pipeline de deploy, debe ser seguro de ejecutar N veces sin perder datos. `upsert` o `findFirst + skip` son patrones seguros. `delete + create` es peligroso en produccion.

### 8.9 El plan Free de Render no tiene shell - planificar para ello

Sin acceso a shell, no se pueden ejecutar comandos ad-hoc (seed, migraciones manuales). Todo debe estar en el Build Command o Start Command.

**Leccion:** Antes de elegir un hosting, verificar que el plan free incluye las herramientas que necesitas. Si no tiene shell, todo comando debe ser automatizable en el pipeline de build.

### 8.10 Vercel cachea la rama default al importar - no se puede cambiar despues

Al importar un repo en Vercel, cachea la rama default de GitHub en ese momento. Si luego cambias la rama default en GitHub, Vercel sigue usando la original. La unica solucion es eliminar el proyecto en Vercel y reimportarlo.

**Leccion:** Antes de importar en Vercel, asegurarse de que la rama default en GitHub es la que contiene el codigo a desplegar. Si trabajas en feature branches, cambiar la default antes de importar.

### 8.11 El backend dormido de Render causa falsos errores de CORS

Cuando el backend de Render Free esta dormido (15min inactividad), las peticiones preflight OPTIONS no reciben respuesta. El navegador interpreta esto como error CORS, no como timeout. El mensaje "No Access-Control-Allow-Origin header" es enganoso.

**Leccion:** Si ves errores CORS en produccion con Render Free, primero verifica que el backend esta despierto visitando su URL directamente. Espera ~30 segundos a que responda. Luego reintenta desde el frontend.

### 8.12 Desplegar frontend y backend por separado es mas flexible que un monorepo deploy

Frontend en Vercel y backend en Render se despliegan independientemente. Si hay un bug en frontend, se arregla sin tocar el backend (y viceversa). Los deploys son mas rapidos porque cada plataforma solo construye su parte.

**Leccion:** Para proyectos fullstack con monorepo, desplegar frontend y backend en plataformas separadas con Root Directory diferente. La complejidad extra de configurar CORS y env vars se compensa con deploys mas rapidos y rollbacks independientes.

### 8.13 Verificar en produccion con datos reales, no asumir que funciona

El deploy "exitoso" en Vercel y Render no significa que la app funciona. Hubo problemas adicionales: SPA routing (404 en rutas directas), CORS con URL incorrecta, Vercel authentication bloqueando acceso publico. Solo la verificacion real con login + navegacion confirma que todo funciona.

**Leccion:** Despues de cada deploy, seguir una checklist de verificacion con acciones reales (login, crear dato, navegar). "Build successful" no es "app funciona".

---

## 10. Aprendizajes Fase 6 (Mejoras Post-Correccion)

### 10.1 Security hardening es un quick win con alto valor percibido

Instalar helmet y @nestjs/throttler toma menos de 30 minutos pero anade 2 capas de seguridad visibles: headers HTTP y rate limiting. Para un evaluador, ver `X-Content-Type-Options: nosniff` o un 429 Too Many Requests demuestra conciencia de seguridad en produccion.

**Leccion:** Las medidas de seguridad de infraestructura (headers, rate limiting) deben instalarse al inicio del proyecto, no como mejora posterior. Son 5 lineas de codigo con impacto desproporcionado en la percepcion de profesionalidad.

### 10.2 El rate limiting debe ser mas agresivo en endpoints de autenticacion

El rate limit global (100 req/min) protege contra abuso general, pero login y register necesitan limites mucho mas estrictos (5 req/min) para prevenir ataques de fuerza bruta. NestJS Throttler permite override por ruta con `@Throttle()`.

**Leccion:** No aplicar un rate limit uniforme a toda la API. Los endpoints de autenticacion son los principales vectores de ataque y necesitan limites especificos. La configuracion es un decorator por ruta, sin complejidad adicional.

### 10.3 npm audit fix sin --force es la unica opcion segura

`npm audit fix` resuelve vulnerabilidades actualizando dentro del rango de versiones compatible. `npm audit fix --force` puede downgradeear paquetes core (ej: @nestjs/swagger@11 → @2.x) rompiendo todo el proyecto. Las vulnerabilidades restantes son dependencias transitivas de NestJS que se resolveran en futuras releases.

**Leccion:** Nunca ejecutar `npm audit fix --force` en un proyecto funcional. Las vulnerabilidades en dependencias transitivas de frameworks core (NestJS, React) son responsabilidad del framework, no del desarrollador. Documentar las vulnerabilidades aceptadas con su justificacion es suficiente.

### 10.4 Vitest + Testing Library es el stack minimo viable para testing frontend React

Con 5 dependencias (vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom) se cubren tests de utilidades puras, servicios con fetch mockeado, componentes con interacciones, y contextos React. La configuracion toma 10 minutos y el primer test se ejecuta en <1 segundo.

**Leccion:** No postponer testing frontend por pereza de configuracion. El setup es trivial y los primeros 50 tests cubren la logica mas critica (adapters, API, autenticacion, componentes reutilizables). Los tests de utilidades puras (enums, adapters) son los de mayor ROI: 0 configuracion de DOM, 0 mocks.

### 10.5 Testear la capa de adaptacion es mas valioso que testear componentes UI

Los tests de `adapters.ts` (18 tests) y `api.ts` (14 tests) cubren la logica que mas bugs produce: transformaciones de datos y comunicacion con el backend. Los tests de componentes UI verifican comportamiento pero dependen de la implementacion del DOM.

**Leccion:** Priorizar tests de logica pura (adapters, utils, services) sobre tests de componentes UI. Un adapter roto afecta a toda la app; un boton mal renderizado es visible al instante.

### 10.6 El wrapper offlineApi es mejor que modificar api.ts directamente

Para implementar offline-first, se creo `offlineStore.ts` como wrapper sobre `api.ts` en vez de modificar el servicio API original. Esto mantiene `api.ts` limpio (solo HTTP), separando la logica offline (IndexedDB + cola) en una capa dedicada. Los componentes importan `offlineApi` en vez de `api`.

**Leccion:** Cuando se anade una capa de abstraccion (cache, offline, retry), hacerlo como wrapper externo sobre el servicio existente, no como modificacion inline. Esto permite testear cada capa por separado y revertir facilmente si algo falla.

### 10.7 Dexie.js simplifica IndexedDB pero las operaciones update necesitan cast

Dexie tipifica estrictamente los `update()` contra el schema de la entidad. Los datos de formularios llegan como `Record<string, unknown>`, que no es compatible. Un `as any` en los update es aceptable porque los datos ya estan validados por el backend en modo online.

**Leccion:** Cuando se integra una libreria con tipos estrictos (Dexie, Prisma) con datos dinamicos (formularios), aceptar casts puntuales en la frontera de datos en vez de crear tipos intermedios innecesarios.

### 10.8 La sincronizacion automatica on-reconnect es la UX minima viable

El evento `window.addEventListener('online', syncNow)` procesa la cola automaticamente al recuperar conexion. El usuario no necesita hacer nada. El toast "X cambio(s) sincronizado(s)" confirma que funciono.

**Leccion:** La sincronizacion automatica al detectar conexion es la pieza mas critica del offline-first. Sin ella, el usuario tendria que recordar sincronizar manualmente, lo que nadie hace. El boton manual es complementario, no primario.

### 10.9 Tipar retroactivamente expone bugs reales de null safety

Al reemplazar `any[]` por tipos estrictos (`Hive[]`, `Inspection[]`), TypeScript detecto 8 accesos a campos opcionales sin null-check (`hive.population`, `hive.last_inspection`, `inspection.brood_pattern`). Estos eran bugs reales: si el backend devuelve `null`, la UI crashearia con `.toLocaleString() of undefined`.

**Leccion:** El tipado estricto no es solo "limpiar codigo". Cada `: any` eliminado es un null-check que TS puede validar. Los campos opcionales del schema (`population?`, `installed_at?`) deben tratarse con `??` o ternarios en la UI.

### 10.10 La documentacion se desincroniza silenciosamente con cada mejora

Tras implementar 5 mejoras (security, audit, tests, offline, tipado), el README.md raiz tenia 15 inconsistencias: Railway en vez de Render, 58 tests en vez de 114, features listadas como pendientes que ya estaban completadas, y un campo `sync_status` en el modelo de datos que nunca existio en el schema real.

**Leccion:** Despues de cada iteracion de mejoras, hacer una pasada de coherencia documental. Las inconsistencias mas peligrosas son las que parecen correctas a primera vista (ej: "58 tests" era correcto hace 2 semanas). Una checklist simple (README ↔ estado real, tablas ↔ features implementadas, diagramas ↔ infra actual) detecta desajustes en 30 minutos.

### 10.11 Las vulnerabilidades en devDependencies no afectan produccion

De las 10 vulnerabilidades restantes en el backend, 6 estan en devDependencies (@nestjs/cli, jest, eslint). Estas herramientas no se ejecutan en produccion ni se incluyen en el bundle.

**Leccion:** Al evaluar vulnerabilidades, clasificar entre runtime (peligrosas) y dev-only (bajo riesgo). Las de devDeps solo afectan al entorno de desarrollo local.

---

## 11. Metricas del Proyecto

| Metrica | Valor |
|---------|-------|
| Commits en feature branch | 44 |
| Prompts documentados | 31 |
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
| Tests unitarios frontend | 56 (5 suites) |
| Tests totales | 114 |
| Fases completadas | 5 de 5 |
| Vulnerabilidades encontradas/corregidas | 3 |
| CI/CD | GitHub Actions (tests) + auto-deploy (Vercel/Render) |
| Documentos en docs/ | 22 |
| Bundle size | ~1200KB (~360KB gzip) |
| Swagger API docs | /api/docs (basic auth) |
| Problemas de deploy resueltos | 9 (6 Render + 3 Vercel) |
| Deploy coste | 0€/mes |
| Verificacion post-deploy | 11 checks pasados |
| Aprendizajes documentados | 57 |

---

*Documento vivo - se actualizara con nuevos aprendizajes en fases posteriores.*
