# PollClass-FSDSN

Sistema de encuestas en vivo para aula, desarrollado como aplicación full stack con React + Bun + MongoDB.

## Demo en vivo (ngrok)

Acceso público para evaluación funcional del sistema.

- URL pública actual: **https://buckshot-tadpole-gecko.ngrok-free.dev**
- Frontend: https://buckshot-tadpole-gecko.ngrok-free.dev
- API health simple: https://buckshot-tadpole-gecko.ngrok-free.dev/api/auth/me (debe responder 401 sin token)

> Nota: este dominio es reservado y depende de una sesión activa de ngrok. Si no hay endpoint activo, la URL no responderá.

## Resumen ejecutivo

PollClass-FSDSN es una plataforma de encuestas en vivo orientada a dinámicas de clase. Permite crear votaciones, compartir código de acceso a estudiantes y visualizar resultados en tiempo real mediante polling HTTP.

Perfiles soportados:

- Profesor: crea, monitorea, cierra y elimina encuestas.
- Estudiante: ingresa por código, vota y consulta resultados.

## Descripción del proyecto

PollClass-FSDSN permite que un profesor cree encuestas durante clase y que estudiantes voten con un código de acceso. Los resultados se actualizan en tiempo real mediante polling HTTP (sin WebSockets).

## Objetivos de diseño

- Flujo simple de uso en aula para profesor y estudiante.
- Integridad de datos con validación de voto único por estudiante y encuesta.
- Arquitectura ligera y mantenible sobre Bun + MongoDB.
- Compatibilidad responsive para votación desde dispositivos móviles.

## Stack tecnológico

- Frontend: React + Vite
- Backend: Bun nativo (Bun.serve)
- Base de datos: MongoDB (driver oficial)
- UI: Tailwind CSS
- Gráficos: Recharts
- Testing E2E/API/UI: Playwright

## Arquitectura

1. Cliente React consume API REST del backend.
2. Backend Bun enruta peticiones y aplica reglas de negocio por rol.
3. MongoDB persiste usuarios, encuestas y votos.
4. Profesor y estudiante refrescan resultados con `setInterval`.

## Estructura del repositorio

```text
PollClass-FSDSN/
├── client/                  # Aplicación React (Vite + Tailwind)
│   └── src/
│       ├── components/      # Formularios y tarjetas de encuesta
│       ├── context/         # AuthContext
│       ├── pages/           # Landing, Auth, Professor, ProfessorPoll, Student
│       └── services/        # Cliente API y servicios de auth
├── server/                  # API Bun + MongoDB
│   ├── config/              # Conexión e índices Mongo
│   ├── middleware/          # Auth por Bearer token
│   ├── routes/              # Auth, Polls, Votes
│   └── index.ts             # Entrada principal Bun.serve
├── tests/                   # Pruebas Playwright API y UI
├── docs/screenshots/        # Evidencias de funcionamiento
├── playwright.config.ts
└── README.md
```

## Módulos funcionales

### Profesor

- Crear encuestas con título y opciones.
- Visualizar listado de encuestas activas/cerradas.
- Acceder a resultados en tiempo real con gráfico de barras.
- Cerrar o eliminar encuestas.

### Estudiante

- Unirse por código alfanumérico de 6 caracteres.
- Emitir voto en encuesta activa.
- Visualizar resultados actualizados y tabla de votos.

### Reglas de negocio

- Una encuesta activa genera código único.
- Voto único por estudiante por encuesta.
- Encuestas cerradas no aceptan votos.
- Control de acceso por rol (professor/student).

## API principal

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Polls

- `POST /api/polls`
- `GET /api/polls`
- `GET /api/polls/:id`
- `GET /api/polls/code/:code`
- `PATCH /api/polls/:id/close`
- `DELETE /api/polls/:id`

### Votes

- `POST /api/polls/:id/vote`
- `GET /api/polls/:id/results`

## Configuración local

### Requisitos

- Bun instalado y accesible en PATH.
- MongoDB local o remoto.

### Variables de entorno

Crear archivo `.env` en raíz desde `.env.example`.

```bash
copy .env.example .env
```

Valores esperados (ejemplo):

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=pollclass
PORT=3001
```

### Instalación

```bash
bun run install-all
```

### Ejecución en desarrollo

```bash
bun run dev
```

Servicios locales:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001/api

## Publicación rápida con ngrok

Se recomienda exponer solo el frontend y usar proxy `/api` hacia backend local.

1. Ejecutar backend.

```bash
bun run dev:server
```

2. Levantar frontend en modo demo con API relativa.

```bash
cd client
set VITE_API_BASE=/api
bun run dev -- --port 5174
```

3. Exponer frontend con ngrok.

```bash
ngrok http --domain=buckshot-tadpole-gecko.ngrok-free.dev 5174
```

4. Verificar que el endpoint quede activo en el panel de ngrok y confirmar acceso externo.

Consulta de túneles activos:

```bash
Invoke-RestMethod -Uri http://127.0.0.1:4040/api/tunnels
```

## Calidad y pruebas

Ejecutar suite E2E/API/UI:

```bash
bun run test:e2e
```

Generar capturas de evidencia:

```bash
bun run evidence:screenshots
```

## Evidencias incluidas

- Landing: `docs/screenshots/01-landing.png`
- Vista profesor: `docs/screenshots/02-vista-profesor.png`
- Vista estudiante: `docs/screenshots/03-vista-estudiante.png`
- Historial OpenCode/Copilot: `docs/screenshots/04-historial-copilot.png`

## Estado del proyecto

Implementación completa de laboratorio práctico full stack con ejecución local, pruebas automatizadas y preparación para demostración pública mediante ngrok.
