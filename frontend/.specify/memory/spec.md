# COLMENAPP Frontend - Specification

## Overview
PWA de gestion apicola. Interfaz responsive mobile-first con soporte offline. Paleta amber/miel con componentes shadcn/ui.

## Pantallas de Autenticacion
- **Login**: Email + contrasena, enlace a registro y recuperar contrasena
- **Registro**: Nombre, email, contrasena, confirmar contrasena (min 6 chars)
- **Recuperar contrasena**: Email, feedback de envio
- Estilo: Card centrada, gradiente amber, logo hexagonal COLMENAPP

## Layout Principal
- **Header**: Logo + nombre + badges Online/Offline + pendientes sync
- **Navegacion**: Tab bar horizontal (Dashboard, Apiarios, Colmenas, Inspecciones, Produccion, Tareas)
- **Contenido**: Outlet de React Router

## Dashboard
- 4 tarjetas estadisticas: Total colmenas (desglose estado), Requieren atencion, Inspecciones pendientes (15+ dias), Tareas pendientes
- Grafico barras: Colmenas por apiario (Recharts BarChart)
- Lista: Ultimas 5 inspecciones con health_status

## Apiarios
- Grid de cards (responsive 1/2/3 cols): nombre, ubicacion, hive_count, coordenadas, notas
- Dialog crear/editar: nombre, ubicacion, lat/lng opcionales, notas
- Click en card → navega a colmenas del apiario
- Estado vacio con mensaje

## Colmenas
- Breadcrumb si viene de apiario: Apiarios > [Nombre] > Colmenas
- Grid de cards: code (badge), status (badge color), nombre, poblacion, cuadros, ultima inspeccion, queen_origin
- Boton "Ver QR" en cada card
- Dialog crear: code, nombre, apiario, status, queen_origin, poblacion, cuadros, installed_at, notas
- Dialog detalle: toda la info + boton Ver QR + alerta si quarantine/lost
- FAB (boton flotante) escanear QR en esquina inferior derecha
- QR Modal: codigo QR generado, codigo + nombre + apiario, botones Imprimir/Cerrar

## Inspecciones
- Lista de cards verticales: colmena, fecha, badges brood_pattern + health_status
- Detalle en card: queen_seen, temperament, peso, actividad, varroa, diseases, tratamiento, notas
- Dialog crear (scrollable): colmena, fecha, queen_seen, brood_pattern, temperament, peso, varroa, activity_level, health_status, diseases (texto comas), tratamiento condicional, notas

## Produccion
- 3 tarjetas: Miel total (kg), Cera total (kg), Propoleo total (g) con promedios
- Grafico barras: produccion por colmena (miel + cera)
- Tabla registros: fecha, colmena, miel, cera, propoleo
- Dialog crear: colmena, fecha, miel, cera, propoleo

## Tareas
- 3 tarjetas stats: Pendientes, Vencidas, Completadas
- Filtros toggle: Todas / Pendientes / Completadas
- Lista cards: checkbox, titulo, descripcion, fecha, prioridad (badge), colmena (badge), vencida (badge)
- Dialog crear: titulo, descripcion, fecha, prioridad, colmena (opcional)

## Offline/Sync
- Badge Online (verde) / Offline (naranja + CloudOff) en header
- Badge "[N] pendientes" cuando hay sync pendiente
- Toasts: guardado local, sincronizando, sincronizado, error
- Modal conflictos: mantener local / usar servidor

## Colores por Estado
- Status colmena: active=verde, inactive=gris, quarantine=naranja, lost=rojo
- Prioridad: high=rojo, medium=amarillo, low=verde
- Health: healthy=verde, weak=amarillo, sick=naranja, critical=rojo
- Brood: excellent=verde, good=azul, fair=amarillo, poor=rojo
- Temperament: calm=verde, normal=azul, aggressive=rojo
