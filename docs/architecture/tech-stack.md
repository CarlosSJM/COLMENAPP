# Arquitectura y Stack Tecnologico

## Stack

| Capa | Tecnologia | Version |
|------|------------|---------|
| **Frontend** | React + TypeScript | 18.x |
| **Bundler** | Vite | 5.x |
| **Estilos** | Tailwind CSS | 3.x |
| **Componentes UI** | shadcn/ui | - |
| **Offline Storage** | Dexie.js (IndexedDB) | 4.x |
| **Backend** | NestJS + TypeScript | 10.x |
| **ORM** | Prisma | 5.x |
| **Base de datos** | PostgreSQL | 16 (Alpine) |
| **Autenticacion** | Passport.js + JWT | - |
| **Contenedores** | Docker Compose | - |
| **QR** | html5-qrcode / qrcode.react | - |

## Estructura del Proyecto

```
COLMENAPP/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── prompts.md
├── README.md
│
├── docs/                     Documentacion completa
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma     Schema de base de datos
│   ├── src/
│   │   ├── auth/             Autenticacion JWT
│   │   ├── users/            Gestion de usuarios
│   │   ├── apiaries/         CRUD apiarios
│   │   ├── hives/            CRUD colmenas
│   │   ├── inspections/      CRUD inspecciones
│   │   ├── production/       CRUD produccion
│   │   ├── tasks/            CRUD tareas
│   │   ├── sync/             Sincronizacion offline
│   │   ├── prisma/           Prisma service
│   │   └── main.ts
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/         Login, Register, ForgotPassword
    │   │   ├── ui/           shadcn/ui components
    │   │   ├── Apiaries.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── Hives.tsx
    │   │   ├── Inspections.tsx
    │   │   ├── Layout.tsx
    │   │   ├── Production.tsx
    │   │   ├── QRModal.tsx
    │   │   └── Tasks.tsx
    │   ├── contexts/         AuthContext
    │   ├── data/             Mock data (dev)
    │   ├── db/               Dexie.js config
    │   ├── hooks/
    │   ├── services/         API clients
    │   ├── types/            TypeScript interfaces
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── README.md
```

## Convenciones

### Enums
- **Base de datos**: Siempre en ingles (`active`, `healthy`, `high`)
- **UI**: Traducidos al espanol para mostrar al usuario

### Campos denormalizados
- Campos `_name` (ej: `apiary_name`, `hive_name`) se incluyen en responses de API para evitar joins innecesarios en el frontend
- No se almacenan en BD, se resuelven en el backend al hacer queries con `include`

### Naming
- **Backend**: snake_case para campos de BD y API
- **Frontend**: camelCase para variables JS/TS, snake_case para campos que vienen de API
- **Archivos**: kebab-case para archivos, PascalCase para componentes React

### API REST
- Prefijo: `/api/v1/`
- Autenticacion: Bearer token JWT en header `Authorization`
- Responses: `{ data, meta?, error? }`
