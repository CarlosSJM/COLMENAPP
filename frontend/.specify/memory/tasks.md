# COLMENAPP Frontend - Tasks

## Phase 0: Inicializacion
- [ ] Crear proyecto con `npm create vite@latest . -- --template react-ts`
- [ ] Instalar Tailwind CSS + configurar
- [ ] Instalar shadcn/ui + configurar
- [ ] Instalar dependencias: react-router, recharts, lucide-react, sonner, dexie
- [ ] Configurar estructura de carpetas (components, contexts, services, types, utils, hooks, db)
- [ ] Copiar componentes ui/ de Figma export

## Phase 1: Tipos y Utilidades
- [ ] Crear `types/index.ts` con interfaces alineadas al backend
- [ ] Crear `utils/enums.ts` con mapeo ingles→espanol
- [ ] Crear `services/api.ts` con API client base (auth headers, base URL)

## Phase 2: Auth y Routing
- [ ] Crear AuthContext (login, register, logout, user, isOnline, pendingSync)
- [ ] Integrar componentes auth de Figma (Login, Register, ForgotPassword)
- [ ] Configurar React Router con rutas protegidas
- [ ] Crear Layout con header (Online/Offline badges) + tab navigation

## Phase 3: Integrar Componentes Figma
- [ ] Adaptar Dashboard.tsx (de mock a API)
- [ ] Adaptar Apiaries.tsx (de mock a API)
- [ ] Adaptar Hives.tsx (de mock a API + enums ingles)
- [ ] Adaptar Inspections.tsx (de mock a API + enums ingles)
- [ ] Adaptar Production.tsx (de mock a API)
- [ ] Adaptar Tasks.tsx (de mock a API)
- [ ] Integrar QRModal.tsx (de URL externa a qrcode.react)

## Phase 4: Conectar API Backend
- [ ] Servicio auth (register, login, me)
- [ ] Servicio apiaries (CRUD)
- [ ] Servicio hives (CRUD + buscar por code)
- [ ] Servicio inspections (CRUD)
- [ ] Servicio production (CRUD + stats)
- [ ] Servicio tasks (CRUD + toggle)
- [ ] Servicio dashboard (stats)

## Phase 5: PWA (COMPLETADO)
- [x] Service Worker (cache-first assets, network-first API)
- [x] Web App Manifest (manifest.json, standalone, iconos, tema)
- [x] Meta tags PWA (theme-color, apple-mobile-web-app)
- [x] Hook useOnlineStatus (integrado en AuthContext)
- [x] Indicadores Online/Offline en header
- [ ] Configurar Dexie.js con schemas para cada entidad (POSPUESTO)
- [ ] Implementar sync queue (operaciones pendientes) (POSPUESTO)

## Phase 6: QR Scanner (COMPLETADO)
- [x] Instalar html5-qrcode + qrcode.react
- [x] Crear componente QRScanner (abre camara trasera)
- [x] Integrar en FAB de pantalla Colmenas
- [x] Parsear formato `colmenapp://hive/{code}` y navegar
- [x] Reemplazar QR externo (qrserver.com) por QRCodeSVG local

## Phase 7: Testing
- [ ] Tests componentes criticos (Dashboard, Hives, Inspections)
- [ ] Tests de servicios API
- [ ] Test de flujo auth completo
