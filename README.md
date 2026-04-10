# PollClass — Sistema de Encuestas en Vivo

## Resumen

PollClass es una aplicación full stack para crear encuestas en tiempo real durante la clase. El profesor crea encuestas, comparte un código con los estudiantes y los resultados se actualizan mediante polling HTTP.

Esta versión usa Bun puro en el backend y MongoDB con el driver oficial, sin Hono ni Mongoose.

## Stack

- Frontend: React + Vite
- Backend: Bun nativo
- Base de datos: MongoDB (driver oficial)
- Estilos: Tailwind CSS
- Gráficos: Recharts

## Estructura del proyecto

- `client/` — aplicación React
- `server/` — API Bun con rutas nativas y acceso directo a MongoDB
- `.env.example` — ejemplo de configuración de entorno
- `.gitignore` — archivos y carpetas ignoradas

## Requisitos previos

- Bun instalado y disponible en el PATH
- MongoDB accesible (local o Atlas)
- Git instalado

## Configuración

1. Crear el archivo de entorno:

```bash
copy .env.example .env
```

2. Ajustar `MONGODB_URI` si usas otro host.

3. Instalar dependencias:

```bash
bun install
cd server && bun install
cd ../client && bun install
```

## Ejecutar el proyecto

Abrir dos terminales:

- Terminal 1 (backend):
  ```bash
  bun run dev
  ```

- Terminal 2 (frontend):
  ```bash
  bun run dev
  ```

Luego abrir:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001/api`

## Endpoints principales

- `POST /api/auth/register` — registrar usuario
- `POST /api/auth/login` — iniciar sesión
- `GET /api/auth/me` — obtener usuario autenticado
- `POST /api/polls` — crear encuesta
- `GET /api/polls` — listar encuestas
- `GET /api/polls/:id` — obtener encuesta por ID
- `GET /api/polls/code/:code` — buscar encuesta por código
- `PATCH /api/polls/:id/close` — cerrar encuesta
- `DELETE /api/polls/:id` — eliminar encuesta
- `POST /api/polls/:id/vote` — registrar un voto
- `GET /api/polls/:id/results` — obtener resultados actuales

## Notas

- La validación asegura un solo voto por estudiante (`voterEmail`) por encuesta.
- El login es role-agnóstico; el backend redirige según el rol guardado.
- El registro pide el rol sólo una vez.
- Las rutas de backend usan Bun y MongoDB directamente.

---

Esta implementación está lista y ya se ha empujado al remoto en la rama `main`.
