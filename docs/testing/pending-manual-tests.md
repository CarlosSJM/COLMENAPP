# Tests Manuales Pendientes

## PWA - Instalacion y comportamiento

- [ ] Abrir https://colmenapp.vercel.app en Chrome mobile
- [ ] Verificar que aparece banner "Agregar a pantalla de inicio"
- [ ] Instalar como PWA y verificar que abre en standalone (sin barra navegador)
- [ ] Verificar que el icono aparece en el escritorio del movil
- [ ] Verificar que el theme-color amber se aplica en la barra de estado

## Offline - Cache de assets

- [ ] Abrir la app con conexion, navegar por varias pantallas
- [ ] Activar modo avion en el movil
- [ ] Verificar que la app carga (assets cacheados por Service Worker)
- [ ] Verificar que el badge cambia de "Online" a "Offline"
- [ ] Verificar que los datos previamente cargados se muestran desde cache
- [ ] Verificar que al intentar crear/editar sin conexion muestra error con toast

## Sincronizacion

- [ ] Con conexion: crear un apiario, colmena, inspeccion, produccion y tarea
- [ ] Verificar que los datos persisten tras recargar la pagina
- [ ] Verificar que un segundo usuario (registrado desde otro navegador) no ve los datos del primero
- [ ] Verificar que al desconectar y reconectar, la app recupera datos del servidor

**Nota:** El sync offline completo (Dexie.js + cola de operaciones) no esta implementado en el MVP. Las mutaciones requieren conexion. Solo los assets y respuestas GET cacheadas funcionan offline.
