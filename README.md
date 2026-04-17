# PollClass-FSDSN — Sistema de Encuestas en Vivo

## Resumen

PollClass-FSDSN es una aplicación full stack para crear encuestas en tiempo real durante la clase. El profesor crea encuestas, comparte un código con los estudiantes y los resultados se actualizan mediante polling HTTP.

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

Con un solo comando desde la raiz:

```bash
bun run dev
```

Si necesitas correr por separado:

- Backend:
  ```bash
  bun run dev:server
  ```

- Frontend:
  ```bash
  bun run dev:client
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

## Evidencias para entrega

Capturas requeridas:

- Landing: `docs/screenshots/01-landing.png`
- Vista profesor: `docs/screenshots/02-vista-profesor.png`
- Vista estudiante: `docs/screenshots/03-vista-estudiante.png`

Generarlas automaticamente con Playwright:

```bash
bun run evidence:screenshots
```

Captura del historial de Copilot/OpenCode:

- Toma un screenshot de la conversacion/historial y agregalo al repo en `docs/screenshots/04-historial-copilot.png`.

## Despliegue con ngrok (demo en clase)

Requisitos:

- Tener backend corriendo en `3001` (`bun run dev:server` o `bun run dev`).
- Instalar ngrok y autenticarlo:

```bash
ngrok config add-authtoken <TU_TOKEN>
```

### Opcion recomendada (plan free): 1 solo tunel

En plan free, lo mas estable es exponer solo frontend y enrutar API por proxy `/api`.

1. Levantar frontend de demo con API relativa:

```bash
cd client
set VITE_API_BASE=/api
bun run dev -- --port 5174
```

2. Exponer frontend:

```bash
ngrok http 5174
```

3. Compartir la URL HTTPS de ngrok (ejemplo):

```text
https://tu-subdominio.ngrok-free.dev
```

Notas:

- El frontend usa `/api` y Vite lo proxya a `http://localhost:3001`.
- La ruta `https://tu-subdominio.ngrok-free.dev/api/auth/me` debe responder `401` sin token (eso confirma que API publica funciona).

### Verificar tuneles activos

```bash
Invoke-RestMethod -Uri http://127.0.0.1:4040/api/tunnels
```

### Detener demo

- Cerrar terminal de ngrok (`Ctrl + C`).
- Cerrar terminal de Vite demo (`Ctrl + C`).

## Notas

- La validación asegura un solo voto por estudiante (`voterEmail`) por encuesta.
- El login es role-agnóstico; el backend redirige según el rol guardado.
- El registro pide el rol sólo una vez.
- Las rutas de backend usan Bun y MongoDB directamente.

---

Esta implementación está lista y ya se ha empujado al remoto en la rama `main`.
