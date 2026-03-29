# COLMENAPP Frontend - Plan

## Stack
- React 18 + TypeScript
- Vite 5 (bundler)
- Tailwind CSS 3 (estilos)
- shadcn/ui (componentes)
- Recharts (graficos)
- Lucide React (iconos)
- Sonner (toasts)
- React Router (navegacion)
- Dexie.js (IndexedDB / offline)
- html5-qrcode (QR scanner)
- qrcode.react (QR generator)

## Architecture

```
frontend/
├── public/
│   └── manifest.json           PWA manifest
├── src/
│   ├── components/
│   │   ├── auth/               Login, Register, ForgotPassword
│   │   ├── ui/                 shadcn/ui components
│   │   ├── Apiaries.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Hives.tsx
│   │   ├── Inspections.tsx
│   │   ├── Layout.tsx
│   │   ├── Production.tsx
│   │   ├── QRModal.tsx
│   │   └── Tasks.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx      Auth + Online/Sync state
│   ├── data/
│   │   └── mockData.ts         Mock data (desarrollo)
│   ├── db/
│   │   └── dexie.ts            IndexedDB config (Dexie.js)
│   ├── hooks/
│   │   └── useOnlineStatus.ts
│   ├── services/
│   │   └── api.ts              API client (fetch/axios)
│   ├── types/
│   │   └── index.ts            TypeScript interfaces
│   ├── utils/
│   │   └── enums.ts            Mapeo enums ingles→espanol
│   ├── App.tsx                 Router setup
│   └── main.tsx                Entry point
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Source: Figma Export
Los componentes base estan exportados y validados en:
`/home/carlossjm/PROYECTOS/apicultura/Colmenapp Bee Hive Manager-nueva/`

Se integraran adaptando:
- Mock data → API calls
- Enums espanol → ingles (con mapeo)
- Tipos Figma → tipos alineados con backend

## Routing

```
/login              → Login
/register           → Register
/forgot-password    → ForgotPassword
/                   → Layout
  /                 → Dashboard
  /apiaries         → Apiaries
  /apiaries/:id/hives → Hives (filtrado)
  /hives            → Hives (todas)
  /inspections      → Inspections
  /production       → Production
  /tasks            → Tasks
```

## Data Flow
1. **Con conexion**: API call → actualizar UI + guardar en IndexedDB
2. **Sin conexion**: Leer de IndexedDB → mostrar UI → encolar cambios
3. **Al reconectar**: Enviar cola de cambios → resolver conflictos si hay

## Paleta
- Primario: amber-600 (#d97706)
- Hover: amber-700 (#b45309)
- Texto: amber-900, amber-700
- Fondos: amber-50, yellow-50
- Bordes: amber-200
