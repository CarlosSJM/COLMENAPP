# 🐝 Propuesta MVP - Aplicación de Gestión Apícola

> *Tu colmenar, siempre en tu bolsillo*

**Documento para**: Cliente
**Fecha**: Enero 2026
**Versión**: 1.0

---

## 📋 Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Funcionalidades del MVP](#2-funcionalidades-del-mvp)
3. [Lo que NO incluye el MVP](#3-lo-que-no-incluye-el-mvp)
4. [Arquitectura Técnica](#4-arquitectura-técnica)
5. [Puntos Fuertes](#5-puntos-fuertes-del-mvp)
6. [Costes de Desarrollo](#6-costes-de-desarrollo)
7. [Costes de Infraestructura](#7-costes-de-infraestructura)
8. [Modelo de Negocio](#8-modelo-de-negocio-sugerido)
9. [Cronograma](#9-cronograma-propuesto)
10. [Entregables](#10-entregables)
11. [Siguientes Pasos](#11-siguientes-pasos)
12. [Presupuesto](#12-presupuesto-de-desarrollo)
13. [Comparativa de Precios](#13-comparativa-freelance-vs-consultoríaagencia)

---

## 1. 🎯 Resumen Ejecutivo

Desarrollo de una **aplicación web progresiva (PWA)** para la gestión profesional de apiarios y colmenas.

### ¿Qué problema resuelve?

> 📱 Una app que funciona **sin internet en el campo**, permite registrar inspecciones, hacer seguimiento de salud y tratamientos, y sincroniza automáticamente cuando hay conexión.

### Datos clave

| 📊 Concepto | 📝 Detalle |
|-------------|------------|
| 🌐 **Tipo de aplicación** | PWA (funciona en web y móvil) |
| 👤 **Usuario objetivo** | Apicultor profesional (100+ colmenas) |
| ⏱️ **Horas de desarrollo** | ~450 horas |
| 📅 **Tiempo estimado** | 8-10 semanas |
| 💰 **Coste infraestructura** | Desde ~5€/mes |

---

## 2. ✨ Funcionalidades del MVP

### 2.1 🔐 Autenticación de Usuario

| Funcionalidad | Descripción |
|:-------------:|-------------|
| 📝 Registro | Crear cuenta con email y contraseña |
| 🔑 Login | Acceso seguro a la aplicación |
| 🔄 Recuperar contraseña | Restablecer acceso por email |
| ✅ Sesión persistente | Mantener sesión activa entre visitas |

---

### 2.2 🏡 Gestión de Apiarios

| Funcionalidad | Descripción |
|:-------------:|-------------|
| ➕ Crear apiario | Registrar nuevo apiario con nombre y ubicación |
| 📋 Ver apiarios | Lista de todos los apiarios con resumen |
| ✏️ Editar apiario | Modificar información del apiario |
| 🗑️ Eliminar apiario | Borrar apiario (con confirmación) |
| 📍 Ubicación GPS | Guardar coordenadas del apiario (opcional) |
| 📝 Notas | Campo libre para observaciones |

---

### 2.3 🐝 Gestión de Colmenas

| Funcionalidad | Descripción |
|:-------------:|-------------|
| ➕ Crear colmena | Registrar colmena dentro de un apiario |
| 🏷️ Código único | Identificador único para cada colmena |
| 🚦 Estados | Activa, Inactiva, Cuarentena, Pérdida |
| 📅 Fecha instalación | Registro de cuándo se instaló |
| 👑 Origen de reina | Información sobre procedencia |
| 📱 Código QR | Generación automática para identificación |
| 🖨️ Imprimir QR | Descargar QR en PDF para pegar en colmena |

---

### 2.4 📊 Registro de Inspecciones

> 💡 *Esta es la funcionalidad principal para el trabajo de campo*

#### 📈 Datos de Actividad

| Campo | Tipo | Descripción |
|:-----:|:----:|-------------|
| 📅 Fecha/hora | Automático | Se registra al crear la inspección |
| ⚖️ Peso | Número (kg) | Peso actual de la colmena |
| 🔄 Nivel actividad | Selector | Bajo / Medio / Alto |

#### 🏥 Datos de Salud

| Campo | Tipo | Descripción |
|:-----:|:----:|-------------|
| 🔬 Conteo varroa | Número | Cantidad de varroa detectada |
| 🐛 Plagas | Checklist | Varroa, Polilla, Hormigas, Otro |
| 💚 Estado general | Selector | Bueno / Regular / Malo |

#### 💊 Datos de Tratamiento

| Campo | Tipo | Descripción |
|:-----:|:----:|-------------|
| ✅ Tratamiento aplicado | Sí/No | Si se aplicó algún tratamiento |
| 🧪 Producto | Texto | Nombre del producto usado |
| 📏 Dosis | Texto | Cantidad aplicada |

#### 📝 Notas

| Campo | Tipo | Descripción |
|:-----:|:----:|-------------|
| 💬 Observaciones | Texto libre | Cualquier nota adicional |

---

### 2.5 📚 Historial de Inspecciones

| Funcionalidad | Descripción |
|:-------------:|-------------|
| 📖 Ver historial | Todas las inspecciones de una colmena |
| 🔍 Filtrar por fecha | Buscar inspecciones en rango de fechas |
| 📈 Evolución | Ver cambios a lo largo del tiempo |

---

### 2.6 📷 Escáner QR

| Funcionalidad | Descripción |
|:-------------:|-------------|
| 📱 Escanear código | Usar cámara del móvil para leer QR |
| ⚡ Acceso rápido | Abre directamente la ficha de la colmena |
| ➕ Nueva inspección | Acceso directo a registrar inspección |

#### 🎬 Caso de uso típico

```
1️⃣ Apicultor llega a colmena en campo
2️⃣ Escanea QR con el móvil
3️⃣ Se abre la ficha de esa colmena
4️⃣ Pulsa "Nueva inspección"
5️⃣ Registra los datos
6️⃣ Se guarda automáticamente ✅
```

---

### 2.7 📴 Modo Offline (Sin Internet)

> 🌟 *Funcionalidad crítica para trabajo en campo rural*

| Situación | Comportamiento |
|:---------:|----------------|
| 🌐 **Primera visita** | Requiere internet para descargar la app |
| 📴 **Visitas posteriores** | Funciona completamente sin internet |
| ✏️ **Crear inspección sin red** | Se guarda en el dispositivo |
| 📶 **Recuperar conexión** | Sincroniza automáticamente con el servidor |
| 👁️ **Indicador visual** | Muestra estado de conexión y cambios pendientes |

#### 📱 Ejemplo visual

```
┌─────────────────────────────────────┐
│  🔴 Sin conexión                    │
│  📤 3 cambios pendientes de sync    │
└─────────────────────────────────────┘
```

#### 💾 Retención de datos

- ✅ Los últimos **30 días** de datos se guardan en el dispositivo
- ✅ Historial más antiguo disponible cuando hay conexión

---

### 2.8 📤 Exportación de Datos

| Funcionalidad | Descripción |
|:-------------:|-------------|
| 📊 Exportar a CSV | Descargar datos en formato Excel compatible |
| 🏡 Por apiario | Exportar solo un apiario específico |
| 📋 Todo | Exportar todas las colmenas e inspecciones |

---

### 2.9 🏠 Dashboard (Panel Principal)

| Elemento | Descripción |
|:--------:|-------------|
| 📊 Resumen general | Total de apiarios y colmenas |
| 🚦 Por estado | Cuántas activas, en cuarentena, etc. |
| 🕐 Últimas inspecciones | Las más recientes realizadas |
| ⚠️ Alertas | Colmenas sin inspeccionar hace más de 30 días |

---

### 2.10 🌍 Multi-idioma (Preparado)

| Característica | Descripción |
|:--------------:|-------------|
| 🇪🇸 Idioma inicial | Español |
| 🌐 Preparado para | Inglés, Portugués, Francés... |
| ⚙️ Implementación | Añadir idiomas sin modificar código |

---

## 3. ❌ Lo que NO incluye el MVP

> 💡 *Para mantener el enfoque y cumplir plazos, estas funcionalidades quedan para versiones futuras*

| Funcionalidad | Razón de exclusión | Fase futura |
|:-------------:|-------------------|:-----------:|
| 📸 **Fotos** | Añade complejidad de almacenamiento | Fase 2 |
| 🎤 **Transcripción de voz** | Requiere servicio externo de pago | Fase 2 |
| 👥 **Múltiples usuarios** | MVP es para un solo usuario | Fase 2 |
| 📅 **Calendario/recordatorios** | Notificaciones push son complejas | Fase 2 |
| 📡 **NFC** | QR es suficiente inicialmente | Fase 2+ |
| 🗺️ **Mapas interactivos** | Requiere API de pago | Fase 2 |
| 📈 **Gráficos avanzados** | Primero recopilar datos | Fase 2 |
| 🛒 **Marketplace** | Requiere masa crítica de usuarios | Fase 3 |
| 🤖 **Inteligencia Artificial** | Requiere datos históricos | Fase 4 |

---

## 4. 🏗️ Arquitectura Técnica

### 4.1 🔭 Visión General

```
┌─────────────────────────────────────────────────────────────┐
│                    👤 USUARIO                                │
│              (Móvil o Ordenador)                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              📱 APLICACIÓN WEB (PWA)                        │
│                                                             │
│   ✅ Se instala como app en el móvil                       │
│   ✅ Funciona sin internet                                  │
│   ✅ Guarda datos localmente                                │
│   ✅ Sincroniza cuando hay conexión                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ (cuando hay internet)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    🖥️ SERVIDOR                              │
│                                                             │
│   ✅ Procesa las peticiones                                 │
│   ✅ Gestiona usuarios y sesiones                          │
│   ✅ Guarda datos de forma permanente                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  💾 BASE DE DATOS                           │
│                                                             │
│   ✅ Almacena toda la información                          │
│   ✅ Apiarios, colmenas, inspecciones                      │
│   ✅ Backups automáticos                                   │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 🛠️ Tecnologías Utilizadas

| Capa | Tecnología | Propósito |
|:----:|------------|-----------|
| 📱 **Aplicación** | React + TypeScript | Interfaz de usuario moderna |
| 🖥️ **Servidor** | NestJS | Lógica de negocio robusta |
| 💾 **Base de datos** | PostgreSQL | Almacenamiento fiable |
| 🌐 **Hosting app** | Vercel | Despliegue rápido y CDN global |
| ☁️ **Hosting servidor** | Railway | Servidor y base de datos |

### 4.3 💪 Ventajas de esta Arquitectura

| Ventaja | Beneficio para el usuario |
|:-------:|--------------------------|
| 📱 **PWA** | Una sola app para web y móvil, sin tiendas de apps |
| 📴 **Offline-first** | Funciona en campo sin cobertura |
| 🔄 **Sync automático** | No hay que hacer nada manual |
| 🚀 **Tecnologías modernas** | Fácil de mantener y escalar |
| 🔒 **Código propio** | Sin dependencia de terceros |

---

## 5. 💪 Puntos Fuertes del MVP

### 5.1 ✅ Ventajas

| Ventaja | Descripción |
|:-------:|-------------|
| 📴 **Funciona sin internet** | Crítico para trabajo en campo rural |
| 📱 **Una sola app** | Funciona igual en móvil y ordenador |
| 🚫 **Sin tiendas de apps** | No hay que publicar en Apple Store o Google Play |
| ⚡ **Actualizaciones instantáneas** | Los usuarios siempre tienen la última versión |
| 📱 **QR para identificación** | Acceso rápido a cada colmena |
| 📊 **Datos completos** | Varroa, tratamientos, peso... todo lo necesario |
| 📤 **Exportación CSV** | Compatible con Excel para análisis |
| 🌍 **Multi-idioma preparado** | Listo para expandir a otros mercados |
| 💰 **Coste bajo** | Infraestructura desde 5€/mes |
| 📈 **Escalable** | Crece según las necesidades |

### 5.2 ⚠️ Limitaciones del MVP

| Limitación | Mitigación |
|:----------:|------------|
| 👤 Un solo usuario | Suficiente para validar, multiusuario en Fase 2 |
| 📷 Sin fotos | Se pueden añadir notas descriptivas |
| 🔔 Sin recordatorios | Lista de "pendientes" en dashboard |
| 📈 Sin gráficos avanzados | Exportar a Excel para análisis |

---

## 6. 💰 Costes de Desarrollo

### 6.1 📱 Frontend (Aplicación visible)

| Tarea | Horas |
|-------|:-----:|
| ⚙️ Configuración inicial | 12h |
| 📴 Sistema offline y sincronización | 40h |
| 🔐 Pantallas de login/registro | 12h |
| 🏡 Gestión de apiarios | 16h |
| 🐝 Gestión de colmenas | 20h |
| 📊 Formulario de inspecciones | 32h |
| 📱 Generación y escáner QR | 16h |
| 🏠 Dashboard | 16h |
| 📤 Exportación CSV | 8h |
| 📐 Diseño responsive | 32h |
| 🌍 Multi-idioma | 16h |
| **📱 Subtotal Frontend** | **220h** |

### 6.2 🖥️ Backend (Servidor)

| Tarea | Horas |
|-------|:-----:|
| ⚙️ Configuración inicial | 8h |
| 🔐 Sistema de autenticación | 20h |
| 👤 Gestión de usuarios | 8h |
| 🏡 API de apiarios | 16h |
| 🐝 API de colmenas | 20h |
| 📊 API de inspecciones | 24h |
| 🔄 Sistema de sincronización | 16h |
| 💾 Base de datos | 8h |
| **🖥️ Subtotal Backend** | **120h** |

### 6.3 🔧 Tareas Comunes

| Tarea | Horas |
|-------|:-----:|
| 🧪 Testing (pruebas) | 40h |
| 🚀 Despliegue y configuración | 12h |
| **🔧 Subtotal Común** | **52h** |

### 6.4 📊 Resumen de Horas

| Concepto | Horas |
|----------|:-----:|
| 📱 Frontend | 220h |
| 🖥️ Backend | 120h |
| 🔧 Común | 52h |
| **📦 Total base** | **392h** |
| 🔄 Buffer imprevistos (15%) | 58h |
| **✅ TOTAL** | **~450h** |

### 6.5 📅 Tiempo Estimado

| Dedicación | Duración |
|:----------:|:--------:|
| ⏰ Tiempo completo (40h/semana) | 8-10 semanas |
| 🕐 Media jornada (20h/semana) | 16-20 semanas |
| 🕑 Parcial (10h/semana) | 32-40 semanas |

---

## 7. 🏗️ Costes de Infraestructura

### 7.1 🚀 Fase Inicial (10 usuarios)

| Servicio | Descripción | Coste/mes |
|:--------:|-------------|:---------:|
| 🌐 Vercel | Hosting de la aplicación | 0€ (gratis) |
| ☁️ Railway | Servidor + Base de datos | ~5€ |
| 🔗 Dominio | tuapp.es o similar | ~1€ |
| **💰 TOTAL** | | **~6€/mes** |

> 📅 **Coste anual inicial: ~72€**

### 7.2 📈 Proyección de Escalado

| 👥 Usuarios | 📊 Visitas/mes | 💰 Coste/mes | 📅 Coste/año |
|:-----------:|:--------------:|:------------:|:------------:|
| **10** | ~1.000 | **~6€** | ~72€ |
| 50 | ~5.000 | ~8€ | ~96€ |
| 100 | ~10.000 | ~10€ | ~120€ |
| 250 | ~25.000 | ~15€ | ~180€ |
| 500 | ~50.000 | ~25€ | ~300€ |
| 1.000 | ~100.000 | ~45€ | ~540€ |
| 2.500 | ~250.000 | ~70€ | ~840€ |
| 5.000 | ~500.000 | ~100€ | ~1.200€ |
| 10.000 | ~1.000.000 | ~170€ | ~2.040€ |

### 7.3 📊 Escenarios de Crecimiento Realistas

#### 🐢 Escenario Conservador (Año 1)

```
📅 Mes 1-3:   10 usuarios   →  6€/mes
📅 Mes 4-6:   25 usuarios   →  8€/mes
📅 Mes 7-9:   50 usuarios   →  10€/mes
📅 Mes 10-12: 100 usuarios  →  15€/mes

💰 Coste total Año 1: ~120€
```

#### 🐇 Escenario Moderado (Año 1-2)

```
📅 Año 1: 10 → 100 usuarios    →  ~120€
📅 Año 2: 100 → 500 usuarios   →  ~300€

💰 Coste total 2 años: ~420€
```

#### 🚀 Escenario Optimista (Año 1-2)

```
📅 Año 1: 10 → 500 usuarios     →  ~250€
📅 Año 2: 500 → 2.000 usuarios  →  ~700€

💰 Coste total 2 años: ~950€
```

### 7.4 ⚠️ Cuándo Preocuparse por los Costes

| Señal | Acción |
|:-----:|--------|
| 💸 Factura Railway > 50€/mes | Revisar optimizaciones |
| 💸 Factura Railway > 100€/mes | Evaluar servidor propio (VPS) |
| 👥 Más de 5.000 usuarios | Considerar arquitectura más robusta |

> 💡 **Nota importante:** Estos costes son muy bajos comparados con el valor que aporta la aplicación. Un solo usuario que pague 10€/mes cubre los costes de infraestructura para los primeros 100 usuarios.

---

## 8. 💵 Modelo de Negocio Sugerido

> *Para cuando la app esté lista y validada*

| 📦 Plan | 💰 Precio | 🐝 Límite |
|:-------:|:---------:|:---------:|
| 🆓 **Gratuito** | 0€/mes | Hasta 5 colmenas |
| ⭐ **Profesional** | 9.90€/mes | Hasta 100 colmenas |
| 🏢 **Empresa** | 29€/mes | Ilimitado + soporte |

### 📊 Proyección de ingresos vs costes

| 👥 Usuarios de pago | 💵 Ingreso/mes | 🏗️ Coste infra | 📈 Beneficio |
|:-------------------:|:--------------:|:--------------:|:------------:|
| 5 | 50€ | 10€ | **40€** |
| 20 | 200€ | 20€ | **180€** |
| 50 | 500€ | 35€ | **465€** |
| 100 | 1.000€ | 50€ | **950€** |

---

## 9. 📅 Cronograma Propuesto

```
🗓️ Semana 1-2:   ⚙️ Setup inicial + Base de datos
🗓️ Semana 3-4:   🖥️ Backend (Auth + APIs básicas)
🗓️ Semana 5-6:   📱 Frontend (Auth + Apiarios + Colmenas)
🗓️ Semana 7-8:   📱 Frontend (Inspecciones + QR + Offline)
🗓️ Semana 9:     🏠 Dashboard + Exportación + Testing
🗓️ Semana 10:    🚀 Correcciones + Despliegue + Entrega
```

---

## 10. 📦 Entregables

> *Al finalizar el desarrollo se entregará:*

| 📦 Entregable | 📝 Descripción |
|:-------------:|----------------|
| 🌐 **Aplicación web** | Accesible desde cualquier navegador |
| 📱 **PWA instalable** | Se puede instalar en móvil como app |
| 🔧 **Panel de administración** | Acceso a Railway para ver logs y métricas |
| 💻 **Código fuente** | Repositorio con todo el código |
| 📚 **Documentación técnica** | Cómo mantener y actualizar la aplicación |
| 📖 **Manual de usuario** | Guía de uso de la aplicación |

---

## 11. 👣 Siguientes Pasos

| # | Paso | Descripción |
|:-:|:----:|-------------|
| 1️⃣ | ✅ **Aprobación** | Confirmar que el alcance es correcto |
| 2️⃣ | 🚀 **Inicio** | Comenzar setup del proyecto |
| 3️⃣ | 📊 **Revisiones semanales** | Demo de avances cada semana |
| 4️⃣ | 🎉 **Entrega** | Aplicación funcionando en producción |

---

## 12. 💰 Presupuesto de Desarrollo

### 12.1 👨‍💻 Tarifa de Desarrollo

| Concepto | Valor |
|:--------:|:-----:|
| 👤 **Perfil** | Desarrollador Full-Stack |
| 💰 **Tarifa hora** | 40€/hora |

### 12.2 📊 Desglose por Área

| Área | Horas | Coste |
|:----:|:-----:|:-----:|
| 📱 Frontend (Aplicación) | 220h | 8.800€ |
| 🖥️ Backend (Servidor) | 120h | 4.800€ |
| 🧪 Testing + Deploy | 52h | 2.080€ |
| **📦 Subtotal** | **392h** | **15.680€** |
| 🔄 Buffer imprevistos (15%) | 58h | 2.320€ |
| **✅ TOTAL** | **450h** | **18.000€** |

### 12.3 📋 Resumen de Inversión MVP

| Concepto | Coste |
|:--------:|:-----:|
| 👨‍💻 **Desarrollo** | 18.000€ |
| 🏗️ **Infraestructura Año 1** | ~72€ |
| 🔗 **Dominio Año 1** | ~12€ |
| **💰 TOTAL INVERSIÓN MVP** | **~18.100€** |

### 12.4 💳 Opciones de Pago

| Opción | Estructura |
|:------:|------------|
| 💵 **Pago único** | 18.000€ al finalizar |
| ✂️ **50/50** | 9.000€ inicio + 9.000€ entrega |
| 📊 **Por hitos** | 6.000€ inicio + 6.000€ mitad + 6.000€ entrega |
| 📅 **Mensual** | ~4.500€/mes durante 4 meses |

### 12.5 📈 Retorno de Inversión (ROI)

> *Suponiendo modelo freemium con plan Pro a 9.90€/mes*

| 👥 Usuarios de pago | 💵 Ingreso mensual | ⏱️ Meses para recuperar inversión |
|:-------------------:|:------------------:|:---------------------------------:|
| 50 | 495€ | 36 meses |
| 100 | 990€ | 18 meses |
| 150 | 1.485€ | 12 meses |
| 200 | 1.980€ | 9 meses |
| 300 | 2.970€ | **6 meses** |

---

## 13. 🏢 Comparativa: Freelance vs Consultoría/Agencia

### 13.1 💰 ¿Cuánto costaría este MVP en una consultoría?

> Las consultorías y agencias aplican tarifas mayores debido a estructura empresarial, equipos, comerciales, oficinas y márgenes de beneficio.

| Tipo de proveedor | 💰 Tarifa/hora | ⏱️ Horas | 💵 Coste total |
|:-----------------:|:--------------:|:--------:|:--------------:|
| 👨‍💻 **Freelance (esta propuesta)** | 40€/h | 450h | **18.000€** |
| 🏢 Agencia pequeña (España) | 60-80€/h | 500h | 30.000€ - 40.000€ |
| 🏢 Agencia mediana (España) | 80-120€/h | 550h | 44.000€ - 66.000€ |
| 🏛️ Consultoría tecnológica | 100-150€/h | 600h | 60.000€ - 90.000€ |
| 🌍 Agencia internacional | 120-200€/h | 600h | 72.000€ - 120.000€ |

> ⚠️ *Las agencias suelen estimar más horas por procesos internos, reuniones y coordinación de equipos.*

### 13.2 📊 Precio Típico de Mercado

| Proveedor | Rango de precio |
|:---------:|:---------------:|
| 🏢 Agencia España (promedio) | **35.000€ - 55.000€** |
| 🏛️ Consultoría tecnológica | **50.000€ - 80.000€** |

### 13.3 💪 Ahorro con esta Propuesta

| Concepto | 🏢 Consultoría | 👨‍💻 Freelance | 💰 Ahorro |
|:--------:|:--------------:|:-------------:|:---------:|
| 💵 Precio MVP | ~45.000€ | 18.000€ | **27.000€ (60%)** |
| 🏗️ Infraestructura | Similar | ~72€/año | - |
| ⏱️ Tiempo entrega | 4-6 meses | 8-10 semanas | Más rápido |
| 💬 Comunicación | Vía gestores | Directa | Más ágil |

### 13.4 🎯 Resumen Final

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   🏢 PRECIO EN CONSULTORÍA:      35.000€ - 55.000€         │
│                                                             │
│   👨‍💻 PRECIO ESTA PROPUESTA:      18.000€                   │
│                                                             │
│   💰 AHORRO:                      17.000€ - 37.000€        │
│                                                             │
│   📈 AHORRO PORCENTUAL:           Hasta 60%                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

<div align="center">

### 🐝 ¿Listo para empezar?

**Documento preparado por**: [Tu nombre]
**Contacto**: [Tu email/teléfono]

---

*"El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora."*

</div>
