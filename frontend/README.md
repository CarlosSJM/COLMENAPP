# Frontend - COLMENAPP

## Stack
- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui
- Recharts (graficos)
- Dexie.js (IndexedDB / offline)
- Lucide React (iconos)
- Sonner (toasts)
- React Router

## Progreso

| Paso | Estado |
|------|--------|
| Disenos Figma (todos los componentes) | Completado |
| Validacion de disenos vs requisitos | Completado |
| Inicializar React + Vite | Pendiente |
| Speckit | Pendiente |
| Integrar componentes Figma | Pendiente |
| Conectar API backend | Pendiente |
| Configurar Dexie.js | Pendiente |
| PWA (manifest + service worker) | Pendiente |
| QR Scanner (html5-qrcode) | Pendiente |

## Setup

```bash
cd frontend
npm install
npm run dev
```

## Disenos Figma Exportados

Ubicacion: `/Colmenapp Bee Hive Manager-nueva/`

Componentes validados:
- `auth/Login.tsx` - Pantalla de login
- `auth/Register.tsx` - Pantalla de registro
- `auth/ForgotPassword.tsx` - Recuperar contrasena
- `Apiaries.tsx` - Gestion de apiarios
- `Dashboard.tsx` - Dashboard simplificado
- `Hives.tsx` - Gestion de colmenas + QR
- `Inspections.tsx` - Registro de inspecciones
- `Production.tsx` - Registro de produccion
- `Tasks.tsx` - Gestion de tareas
- `QRModal.tsx` - Modal de codigo QR
- `Layout.tsx` - Layout con header (Online/Offline/Sync)

## Estructura Planificada

```
frontend/
├── public/
│   └── manifest.json          PWA manifest
├── src/
│   ├── components/
│   │   ├── auth/              Login, Register, ForgotPassword
│   │   ├── ui/                shadcn/ui components
│   │   ├── Apiaries.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Hives.tsx
│   │   ├── Inspections.tsx
│   │   ├── Layout.tsx
│   │   ├── Production.tsx
│   │   ├── QRModal.tsx
│   │   └── Tasks.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx     Auth + Online/Sync state
│   ├── data/
│   │   └── mockData.ts        Mock data (desarrollo)
│   ├── db/
│   │   └── dexie.ts           IndexedDB config
│   ├── hooks/
│   ├── services/
│   │   └── api.ts             API client
│   ├── types/
│   │   └── index.ts           TypeScript interfaces
│   ├── utils/
│   │   └── enums.ts           Mapeo enums BD -> UI espanol
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## Paleta de Colores

| Uso | Color |
|-----|-------|
| Primario | amber-600 (#d97706) |
| Hover | amber-700 (#b45309) |
| Texto principal | amber-900 |
| Texto secundario | amber-700 |
| Fondos | amber-50, yellow-50 |
| Bordes | amber-200 |

## Documentacion de Features

Ver `docs/features/` para especificaciones detalladas de cada pantalla.
