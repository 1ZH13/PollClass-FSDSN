# Bitacora Agentica - Laboratorio 5 (Playwright)

## Contexto

Esta bitacora documenta el proceso de automatizacion de validaciones end-to-end para el laboratorio 5, tomando como base la aplicacion PollClass-FSDSN desarrollada previamente.

## Que se le pidio al agente

1. Instalar y configurar Playwright para pruebas API y UI.
2. Definir estructura de pruebas reutilizable por modulos y helpers.
3. Implementar pruebas de flujos criticos de punta a punta.
4. Ampliar cobertura con mas escenarios negativos (validaciones, accesos no permitidos y errores de negocio).
5. Incrementar cantidad de pruebas para reducir regresiones en UI y API.
6. Configurar GitHub Actions para ejecutar la suite automaticamente en push y pull request.
7. Ejecutar la suite completa y estabilizar casos bloqueantes.
8. Dejar documentacion de ejecucion y evidencias.

## Que se acepto del agente

1. Configuracion de Playwright con webServer para backend y frontend.
2. Scripts de ejecucion estandarizados en la raiz del proyecto.
3. Separacion de pruebas en carpetas api y ui.
4. Helpers reutilizables para autenticacion y datos dinamicos.
5. Casos E2E del flujo completo profesor-estudiante y validaciones API.
6. Pipeline de GitHub Actions para correr Playwright en CI con servicio MongoDB.
7. Publicacion de artifacts de reporte y resultados de prueba en CI.

## Que se corrigio manualmente

1. Ajustes de contenido y presentacion del README para entrega.
2. Revision del enlace de demo ngrok y su validez operativa.
3. Verificacion final del alcance de cobertura frente a la rubrica.
4. Ajustes de redaccion de la bitacora para reflejar solicitudes adicionales (CI/CD y expansion de escenarios de error).

## Integracion continua (GitHub Actions)

Archivo de workflow:

- `.github/workflows/playwright-e2e.yml`

Alcance del pipeline:

1. Ejecuta en `push` a `main/master` y en `pull_request`.
2. Levanta MongoDB como servicio en el job.
3. Configura Bun e instala dependencias del monorepo.
4. Instala navegador Chromium para Playwright.
5. Ejecuta `bun run test:e2e`.
6. Publica artifacts con reporte y resultados (`tests/artifacts/*`).

## Flujos criticos identificados (punta a punta)

1. Autenticacion y registro por rol (professor/student), login/logout y redireccion al panel correcto.
2. Flujo de encuesta completo: profesor crea encuesta, estudiante se une por codigo, vota, profesor visualiza resultados, cierra y elimina encuesta.
3. Control de acceso y autorizacion: usuario sin sesion, rol incorrecto y endpoints protegidos.
4. Integridad de voto: voto unico por estudiante por encuesta, opcion invalida y encuesta cerrada.

## Casos negativos incluidos

1. Login con credenciales invalidas.
2. Registro duplicado de email.
3. Campos vacios en formulario de login.
4. Voto duplicado (409).
5. Voto con optionIndex invalido (400).
6. Intento de voto en encuesta cerrada (400).
7. Acceso sin token o con token invalido a /auth/me (401).
8. Acceso de rol incorrecto a vistas protegidas (guardas de profesor/estudiante).
9. Intento de estudiante de crear/cerrar/eliminar encuesta (no autorizado).

## Validacion ejecutada

Comandos usados:

```bash
bun run test:e2e
```

Resultado de validacion final:

- Total tests: 13
- Passed: 13
- Failed: 0

## Estructura de pruebas utilizada

- tests/api/auth.api.spec.ts
- tests/api/polls.api.spec.ts
- tests/api/votes.api.spec.ts
- tests/ui/auth-ui.spec.ts
- tests/ui/access-ui.spec.ts
- tests/ui/poll-flow-ui.spec.ts
- tests/helpers/auth.ts
- tests/helpers/data.ts

## Conclusion

Se establecio una base de testing automatizado reutilizable para detectar regresiones en flujos criticos del laboratorio 5, con cobertura funcional API y UI, casos positivos y negativos, y ejecucion estable de la suite completa.
