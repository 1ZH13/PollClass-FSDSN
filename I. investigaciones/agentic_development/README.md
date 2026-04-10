# Investigación sobre Desarrollo Agéntico (Agentic Development)

## 1. ¿Qué es el desarrollo agéntico?

El desarrollo agéntico, en 2026, se refiere al diseño y uso de sistemas de software que funcionan como agentes inteligentes capaces de tomar decisiones, ejecutar tareas y colaborar con humanos de forma semi-autónoma. Estos agentes pueden:
- percibir su entorno,
- planificar acciones,
- seguir reglas y políticas,
- aprender de la interacción,
- invocar habilidades concretas o microservicios.

La aplicación actual del desarrollo agéntico incluye:
- automatización de flujos de trabajo en software de desarrollo,
- asistentes de programación que generan código y lo iteran,
- herramientas de revisión y testing autónomo,
- plataformas de integración continua que configuran pipelines,
- asistentes empresariales que orquestan datos y acciones entre apps.

## 2. Herramientas investigadas

### 2.1 Copilot CLI

Copilot CLI es una interfaz de línea de comandos de GitHub Copilot enfocada en asistencia de desarrollo mediante prompts, scripts y agentes conversacionales.

Cómo se usa actualmente:
- generar o refactorizar código desde la terminal,
- crear PRs, commits y resúmenes de cambios,
- ejecutar comandos de CI/CD y despliegue mediante prompts estructurados.

Ejemplo práctico:
```bash
copilot explain src/app.js
copilot generate "Create a new React hook for form validation"
copilot open --repo .
```

Conceptos:
- agentes: flujos conversacionales preconfigurados que ejecutan tareas sobre el repositorio,
- skills: integraciones con GitHub, terminal y editor que se invocan con prompts,
- rules: directrices integradas que guían la generación y revisiones de código.

### 2.2 Pi

Pi es una plataforma de agentes conversacionales de primera línea que se centra en productividad personal y empresarial.

Cómo se usa actualmente:
- planificar tareas,
- generar ideas,
- acceder a datos de negocio desde un agente conversacional.

Ejemplo práctico:
- crear un agente para resumir reuniones y generar tareas pendientes,
- usar Pi para buscar requisitos del proyecto y generar un guion de desarrollo.

Conceptos:
- agentes: instancias conversacionales con contexto persistente,
- skills: conectores a calendarios, correo y bases de datos,
- rules: políticas de conversación y de seguridad definidas por el usuario o por el servicio.

### 2.3 OpenCode

OpenCode es una suite de herramientas de desarrollo agéntico orientada a integración de IA con IDEs y sistemas de automatización.

Cómo se usa actualmente:
- generar código en editor y revisarlo con agentes,
- orquestar pipelines de CI,
- crear asistentes personalizados para repositorios específicos.

Ejemplo práctico:
- un agente que revisa PRs y sugiere mejoras de seguridad,
- un asistente que crea tests unitarios y los ejecuta.

Conceptos:
- agentes: procesos autónomos que realizan tareas como revisión, pruebas y despliegue,
- skills: módulos de lenguaje, acceso a repositorios y ejecución de comandos,
- rules: scripts de gobernanza y políticas de calidad.

### 2.4 Claude Code

Claude Code es la oferta de agentes y asistentes de Anthropic pensada para desarrollo de software y análisis de grandes cantidades de texto de código.

Cómo se usa actualmente:
- generar documentación técnica,
- analizar arquitectura de código,
- sugerir refactorizaciones y resolver bugs.

Ejemplo práctico:
- pedir a Claude Code que identifique riesgos de seguridad en un módulo,
- usarlo para convertir especificaciones en pruebas automatizadas.

Conceptos:
- agentes: asistentes de programación que pueden seguir instrucciones en varios pasos,
- skills: capacidades de comprensión de código, búsqueda y generación de texto,
- rules: guardrails de seguridad y restricciones de estilo.

## 3. Comparación de herramientas

| Herramienta | Enfoque principal | Fortalezas | Limitaciones |
| --- | --- | --- | --- |
| Copilot CLI | Asistencia de desarrollo en terminal/repos | Integración con GitHub, flujo de desarrollo, comandos de repo | Requiere repo Git y acceso a GitHub Copilot |
| Pi | Agente conversacional personal/profesional | Contexto conversacional extendido, tareas productivas | Menos foco en desarrollo de software puro |
| OpenCode | Suite de desarrollo agéntico | Automatización de pipelines y calidad | Puede requerir configuración empresarial |
| Claude Code | Análisis inteligente de código | Comprensión profunda de texto/código, seguridad | Dependencia de modelo y acceso a Anthropic |

## 4. Agentes, skills, rules según cada herramienta

- Copilot CLI: el agente actúa sobre el repositorio y la terminal; las skills son generación de código y comandos Git; las rules son las políticas de codificación y revisión de GitHub.
- Pi: el agente es la conversación persistente; las skills son conectores de productividad; las rules son las políticas de interacción y los límites de privacidad.
- OpenCode: el agente es la orquestación de tareas de desarrollo; las skills son módulos de análisis de código y despliegue; las rules son las normas de QA y seguridad.
- Claude Code: el agente es el asistente de IA que razona sobre código; las skills son comprensión y generación del lenguaje de programación; las rules son guardrails contextuales y restricciones de uso.

## 5. Capturas de pantalla

> Nota: en este entorno no puedo generar capturas de pantalla reales de las herramientas. A continuación se listan los ejemplos de imágenes que se deberían tomar para completar la entrega:

1. Captura de Copilot CLI ejecutando un comando `copilot generate` o `copilot explain`.
2. Captura de Pi con una conversación sobre planificación de desarrollo.
3. Captura de OpenCode mostrando un agente de revisión o pipeline.
4. Captura de Claude Code analizando un bloque de código.

### Ruta sugerida para agregar capturas
- `I. investigaciones/agentic_development/screenshots/copilot-cli.png`
- `I. investigaciones/agentic_development/screenshots/pi-conversation.png`
- `I. investigaciones/agentic_development/screenshots/opencode-agent.png`
- `I. investigaciones/agentic_development/screenshots/claude-code.png`

## 6. Pasos pendientes para entrega

1. Instalar `gh` en tu sistema Windows o WSL.
2. Crear branch local: `git checkout -b agentic-development-research`
3. Agregar los archivos: `git add "I. investigaciones/agentic_development/README.md"`
4. Hacer commit: `git commit -m "Add research on agentic development and tool comparison"`
5. Crear PR con GitHub CLI: `gh pr create --title "Agentic Development Research" --body "Investigation report and screenshots"`
6. Mergear el PR cuando esté aprobado: `gh pr merge --merge`

## 7. Conclusión

El desarrollo agéntico en 2026 ya está presente en plataformas que combinan IA, automatización y colaboración humano-máquina. Copilot CLI sigue siendo uno de los referentes para desarrollo directo en repositorios, mientras que Pi, OpenCode y Claude Code ofrecen enfoques complementarios en asistencia conversacional, orquestación y análisis de código.
