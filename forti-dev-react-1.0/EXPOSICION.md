# 🔐 FortiDev — Plataforma PTaaS
## Guión Estructurado de Exposición

| | |
|---|---|
| **Proyecto** | FortiDev — Penetration Testing as a Service |
| **Institución** | Tecnológico de Antioquia |
| **Programa** | Tecnología en Análisis y Desarrollo de Software |
| **Fecha** | 12 de mayo de 2026 |

### Integrantes

| Expositor | Sección |
|---|---|
| 🎓 **Santiago Suaza** | Descripción del problema, del negocio y justificación |
| 📊 **Xavier Rua** | Objetivos y alcance |
| 🧑‍💻 **Anderson de Jesús Londoño Avendaño** | Área a intervenir, requisitos y propuesta técnica |

---

---

## 🎓 SANTIAGO SUAZA
### Secciones: Descripción del Problema · Descripción del Negocio · Justificación
**Tiempo estimado: 5–6 minutos**

---

### 1.1 Descripción del Problema

En el ecosistema actual del desarrollo de software, las organizaciones enfrentan una **brecha crítica entre la velocidad de entrega de código y la madurez de sus prácticas de seguridad**. Esta brecha se manifiesta en tres dimensiones principales:

**Causas raíz:**
- Las metodologías ágiles priorizan velocidad sobre seguridad, dejando vulnerabilidades sin detectar hasta fases tardías del ciclo de vida del software.
- Los equipos de desarrollo carecen de herramientas integradas que detecten fallos de seguridad en el código fuente de forma continua y automatizada.
- El análisis de seguridad manual es costoso, lento y difícilmente escalable para organizaciones con múltiples proyectos simultáneos.
- La falta de un sistema centralizado imposibilita el seguimiento y triage de hallazgos de seguridad entre equipos que trabajan en paralelo.

**Efectos observados:**
- Vulnerabilidades del OWASP Top 10 (inyección SQL, XSS, exposición de credenciales, etc.) llegan a entornos de producción sin detección previa.
- Los costos de remediación en producción son entre 6 y 100 veces mayores que si se detectan durante el desarrollo (NIST, 2022).
- Ausencia de trazabilidad: no existe registro histórico de qué código se analizó, cuándo, con qué resultado ni quién gestionó cada hallazgo.
- Los equipos de seguridad y desarrollo operan en silos, sin visibilidad compartida sobre el estado de seguridad del software que construyen.

**Contexto del mercado:**
El mercado de PTaaS (Penetration Testing as a Service) ha crecido de forma acelerada ante la digitalización masiva de procesos empresariales. Sin embargo, las soluciones disponibles suelen ser costosas, complejas de integrar o no contemplan el trabajo colaborativo multi-tenant que requieren las organizaciones modernas con múltiples equipos y proyectos simultáneos.

#### Guión de apoyo — Puntos clave para hablar con fluidez:
- Abrir con la pregunta: *"¿Cuántas líneas de código se despliegan a producción sin un análisis de seguridad previo?"*
- Mencionar el dato del NIST: corregir en producción cuesta hasta 30 veces más que en desarrollo.
- Introducir el concepto "shift-left security": mover la seguridad al inicio del ciclo, no al final.
- Nombrar el OWASP Top 10 como referente de las vulnerabilidades más comunes.
- Conectar con la solución: *"FortiDev nace precisamente para cerrar esa brecha entre velocidad y seguridad."*

---

### 1.2 Descripción del Negocio

**Sector:** Tecnología de la Información — Ciberseguridad aplicada al desarrollo de software (DevSecOps / AppSec).

**Organización objetivo:** FortiDev está dirigido a equipos y organizaciones que desarrollan software de forma activa y necesitan integrar prácticas de seguridad en su ciclo de vida de desarrollo. El sistema contempla cuatro perfiles de usuario del sistema:

| Rol del sistema | Descripción funcional |
|---|---|
| `ADMIN` | Administrador de la plataforma. Gestiona usuarios, accesos y configuración global. |
| `DEVELOPER` | Desarrollador que registra proyectos, inicia escaneos y consulta hallazgos de su código. |
| `ANALYST` | Analista de seguridad que triagea, prioriza y gestiona el ciclo de vida de los hallazgos. |
| `PENTESTER` | Pentester que ejecuta revisiones manuales y carga hallazgos estructurados. |

**Modelo multi-tenant:** La plataforma adopta un modelo de **organizaciones** (`organizations`) donde múltiples empresas o equipos operan de forma aislada dentro de la misma instancia. Dentro de cada organización se definen roles específicos con niveles de acceso diferenciados:

| Rol de organización | Nivel de acceso |
|---|---|
| `OWNER` | Control total: gestiona miembros, proyectos y configuración de la organización. |
| `ADMIN` | Gestiona miembros y proyectos dentro de la organización. |
| `MEMBER` | Acceso a proyectos a los que ha sido asignado. |
| `VIEWER` | Acceso de solo lectura a los recursos de la organización. |

**Modelo de entrega:** Aplicación web SaaS multi-tenant desplegable tanto en infraestructura propia (on-premise) como en la nube, con una API RESTful como capa de integración.

**Institución de desarrollo:** Tecnológico de Antioquia — proyecto académico con arquitectura y complejidad de nivel productivo.

#### Guión de apoyo — Puntos clave para hablar con fluidez:
- Aclarar que FortiDev es una **plataforma**, no un servicio de consultoría de seguridad.
- Destacar el modelo multi-tenant: varias organizaciones comparten la misma instancia sin ver los datos de las otras.
- Explicar que hay dos sistemas de roles independientes: el del sistema (4 roles) y el de organización (4 roles).
- Dar un ejemplo concreto: *"Una empresa de desarrollo de software puede tener tres equipos como tres organizaciones distintas, con sus propios proyectos y miembros."*

---

### 1.3 Justificación

**¿Por qué FortiDev es la solución adecuada para este contexto?**

**1. Automatización de análisis SAST con Semgrep:**
El motor de escaneo integra **Semgrep**, herramienta de análisis estático de código (SAST) reconocida por la OWASP y utilizada por empresas como Slack, Dropbox y Trail of Bits. FortiDev lo ejecuta de forma asíncrona mediante un **Worker Thread de Node.js** (`src/modules/scans/semgrep.worker.js`), lo que garantiza que el servidor nunca se bloquea durante un escaneo que puede durar varios minutos.

**2. Trazabilidad completa del hallazgo:**
A diferencia de exportar un PDF de resultados, cada hallazgo en FortiDev tiene un **ciclo de vida completo**:
```
OPEN → IN_PROGRESS → RESOLVED
               ↘ ACCEPTED_RISK
               ↘ FALSE_POSITIVE
```
Los hallazgos pueden asignarse a usuarios específicos y llevan registro de notas y evidencias, habilitando flujos de trabajo colaborativos reales entre desarrolladores y analistas.

**3. Seguridad por diseño en la propia plataforma:**
No tendría sentido que una herramienta de seguridad fuera insegura. FortiDev implementa:
- `helmet()` — headers HTTP de seguridad en todas las respuestas
- `express-rate-limit` — 10 intentos de login por 15 minutos (anti-fuerza bruta)
- Zod — validación de esquemas en todos los endpoints antes del controlador
- JWT de corta duración (15 min) + refresh token rotativo en cookie `httpOnly; SameSite=Strict`

**4. Clasificación con estándares de la industria:**
Los hallazgos se categorizan por severidad (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`), se mapean a identificadores **CWE** (Common Weakness Enumeration) y a la clasificación **OWASP**, permitiendo comunicación directa con los estándares internacionales de seguridad.

#### Guión de apoyo — Puntos clave para hablar con fluidez:
- Mencionar Semgrep como herramienta de clase mundial: *"La misma que usan Slack y Dropbox."*
- Hablar del ciclo de vida del hallazgo como diferenciador clave vs. simplemente exportar resultados.
- Resaltar la ironía: *"Una plataforma de seguridad que no es segura no tiene credibilidad."*
- Mencionar el CWE y OWASP: los auditores y clientes hablan ese idioma.
- Pasar la palabra a Xavier: *"Estas razones se traducen en objetivos técnicos concretos..."*

---

---

## 📊 XAVIER RUA
### Secciones: Objetivos · Alcance
**Tiempo estimado: 3–4 minutos**

---

### 1.5 Objetivos

**Objetivo General:**
Desarrollar una plataforma web PTaaS (Penetration Testing as a Service) que permita a organizaciones de desarrollo de software detectar, gestionar y remediar vulnerabilidades de seguridad de forma automatizada y colaborativa durante el ciclo de vida del software.

**Objetivos Específicos:**

**OE-1 — Automatizar el análisis SAST:**
Integrar Semgrep como motor de escaneo capaz de analizar repositorios de código y clasificar hallazgos por severidad (CRITICAL, HIGH, MEDIUM, LOW, INFO) con mapeo a identificadores CWE y categorías OWASP.
*Evidencia en código:* `src/modules/scans/semgrep.worker.js` — funciones `mapSeverity()`, `extractCwe()`, `formatRuleName()`

**OE-2 — Implementar gestión multi-tenant:**
Desarrollar el módulo de organizaciones que permita a múltiples equipos o empresas operar de forma aislada con roles diferenciados (OWNER, ADMIN, MEMBER, VIEWER) dentro de la misma instancia de la plataforma.
*Evidencia en código:* `src/modules/organizations/` — cuatro archivos: queries, service, controller, routes

**OE-3 — Proveer triage y seguimiento de hallazgos:**
Implementar un flujo de gestión de hallazgos con ciclo de vida completo, asignación a usuarios y registro de notas y evidencias.
*Evidencia en código:* `src/modules/findings/findings.service.js` — funciones `updateStatus()`, `assignFinding()`

**OE-4 — Garantizar la seguridad de la plataforma:**
Implementar autenticación JWT con tokens de acceso de corta duración (15 min) y refresh tokens rotativos (7 días), control de acceso por roles, validación de esquemas con Zod y cabeceras de seguridad HTTP con Helmet.
*Evidencia en código:* `src/middleware/auth.js`, `src/middleware/validate.js`, `src/config/database.js`

**OE-5 — Facilitar revisiones manuales de seguridad:**
Implementar el tipo de escaneo `MANUAL_REVIEW` que permita a pentesters cargar hallazgos estructurados con cálculo automático de resumen de severidades.
*Evidencia en código:* `src/modules/scans/scans.service.js` — función `createManualReview()`

#### Guión de apoyo — Puntos clave para hablar con fluidez:
- Leer el objetivo general en voz alta, luego parafrasearlo brevemente.
- Para cada OE, mencionar el módulo o archivo que lo implementa (están en las notas anteriores).
- Destacar que los OE no son intenciones: tienen evidencia directa en el código del proyecto.
- Pasar la palabra a Anderson: *"Estos objetivos se convierten en funcionalidades concretas dentro del siguiente alcance..."*

---

### 1.6 Alcance

**El sistema INCLUYE ✅**

| # | Funcionalidad incluida |
|---|---|
| 1 | Autenticación con JWT (15 min) + refresh token rotativo (7 días, cookie `httpOnly`) |
| 2 | Registro con asignación automática de rol `ADMIN` al primer usuario |
| 3 | Gestión de usuarios (CRUD) con control de acceso por rol del sistema |
| 4 | CRUD completo de organizaciones con modelo multi-tenant y 4 roles |
| 5 | CRUD completo de proyectos con integración a metadatos de GitHub (owner, repo, lenguaje) |
| 6 | Escaneo SAST automático con Semgrep ejecutado en Worker Thread |
| 7 | Escaneo manual (`MANUAL_REVIEW`) con carga estructurada de hallazgos por pentesters |
| 8 | Listado y filtrado de hallazgos con snippets de código, CWE y OWASP |
| 9 | Gestión del ciclo de vida de hallazgos (cambio de estado, asignación a usuario) |
| 10 | Dashboard con resumen de actividad del usuario autenticado |
| 11 | API RESTful sobre Express con validación Zod, rate limiting y logging estructurado |

**El sistema NO INCLUYE ❌**

| # | Exclusión y motivo |
|---|---|
| 1 | Escaneo DAST (análisis dinámico en ejecución) — requiere infraestructura adicional |
| 2 | Integración con pipelines CI/CD (GitHub Actions, GitLab CI, Jenkins) |
| 3 | Reportes exportables en PDF, CVSS o formato SARIF |
| 4 | Integración con Burp Suite, Nessus u OWASP ZAP |
| 5 | Notificaciones por email, Slack o Teams |
| 6 | Módulo de facturación o suscripciones (modelo SaaS comercial) |
| 7 | Aplicación móvil o cliente de escritorio |
| 8 | Soporte para análisis de contenedores (Docker, Kubernetes) |

#### Guión de apoyo — Puntos clave para hablar con fluidez:
- Presentar los incluidos como *"lo que entregamos hoy, funcionando."*
- Presentar los excluidos como *"el roadmap natural de las siguientes versiones del proyecto."*
- Aclarar que el alcance está delimitado para el sprint académico, no por limitación técnica.
- Pasar la palabra a Anderson: *"Para hacer posible todo esto, se diseñó una arquitectura específica..."*

---

---

## 🧑‍💻 ANDERSON DE JESÚS LONDOÑO AVENDAÑO
### Secciones: Área a Intervenir · Requisitos · Propuesta de Solución
**Tiempo estimado: 7–8 minutos**

---

### 1.4 Descripción del Área a Intervenir

**Área intervenida:** Ciclo de Vida de Desarrollo de Software Seguro (Secure SDLC) — fase de análisis estático, detección y gestión de vulnerabilidades en código fuente.

**Proceso intervenido:** Desde que un desarrollador registra un proyecto hasta que un analista cierra un hallazgo como resuelto o aceptado.

#### Diagrama de Proceso — Flujo de Escaneo SAST

```
┌──────────────────────────────────────────────────────────────────────┐
│               PROCESO: ESCANEO Y GESTIÓN DE HALLAZGOS                │
│                       FortiDev PTaaS                                 │
└──────────────────────────────────────────────────────────────────────┘

 ENTRADA: URL de repositorio GitHub + credenciales de usuario
 ─────────────────────────────────────────────────────────────────────
  [Developer]               [Sistema / API]            [PostgreSQL]
      │                           │                         │
      ▼                           │                         │
  Crear Proyecto ─── POST /api/projects ──────────────► INSERT projects
      │                           │                    INSERT project_members
      │                           │                         │
      ▼                           │                         │
  Iniciar Escaneo ── POST /api/projects/:id/scans ─────► INSERT scans
      │                           │                    status = PENDING
      │                    ┌──────▼──────┐                  │
      │                    │   Worker    │                   │
      │                    │   Thread    │                   │
      │                    │             │                   │
      │               git clone repo     │                   │
      │               semgrep --json     │                   │
      │               sobre el código    │                   │
      │                    │             │                   │
      │               mapSeverity()      │                   │
      │               extractCwe()       │                   │
      │               formatRuleName()   │                   │
      │                    └──────┬──────┘                   │
      │                           │                          │
      │                    UPDATE scans ──────────────► status = COMPLETED
      │                    INSERT findings ──────────► N hallazgos
      │                           │                          │
      ▼                           ▼                          │
  Ver Hallazgos ── GET /api/scans/:id/findings ◄─────── SELECT findings
      │
 ─────────────────────────────────────────────────────────────────────
  [Analyst]                  [Sistema / API]            [PostgreSQL]
      │                           │                         │
      ▼                           │                         │
  Revisar hallazgo               │                         │
      │                           │                         │
      ▼                           │                         │
  Cambiar estado ─── PATCH /api/findings/:id/status ──► UPDATE findings
      │                           │                    status: IN_PROGRESS
      │                           │                        → RESOLVED
      │                           │                        → ACCEPTED_RISK
      │                           │                        → FALSE_POSITIVE
      │
      ▼
  Asignar a dev ─── PATCH /api/findings/:id/assign ───► UPDATE findings
                                                         assigned_to = userId

 SALIDA: Hallazgos clasificados con severidad, CWE, OWASP, archivo,
         línea, snippet de código y estado de remediación
```

**Responsables del proceso:**

| Actor | Rol en FortiDev | Acción principal |
|---|---|---|
| Desarrollador | `DEVELOPER` | Registra proyectos, inicia escaneos, consulta hallazgos |
| Analista de seguridad | `ANALYST` | Triagea hallazgos, cambia estados, asigna responsables |
| Pentester | `PENTESTER` | Carga revisiones manuales con hallazgos estructurados |
| Administrador | `ADMIN` | Gestiona usuarios, organizaciones y configuración global |

#### Guión de apoyo — Puntos clave para hablar con fluidez:
- Seguir el diagrama de arriba hacia abajo, explicando cada flecha.
- Destacar el Worker Thread: *"El escaneo puede durar segundos o minutos; el servidor debe seguir respondiendo."*
- Hablar de las tres funciones clave del worker: `mapSeverity()` (ERROR→CRITICAL), `extractCwe()` (del metadata de Semgrep), `formatRuleName()` (convierte `java.lang.security.sqli` → `"Jdbc Sqli"`).
- Mencionar que la tabla `findings` del schema guarda: `file_path`, `line_start`, `line_end`, `code_snippet`, `cwe`, `owasp`, `rule`, `severity`, `status`, `assigned_to`.

---

### 1.7 Requisitos Funcionales y No Funcionales

#### Requisitos Funcionales

| ID | Módulo | Descripción |
|---|---|---|
| RF-01 | Auth | Registro de usuarios con nombre, email, contraseña y rol. El primer usuario registrado recibe automáticamente el rol `ADMIN`. |
| RF-02 | Auth | Autenticación con email y contraseña. Emite JWT de acceso (15 min) y refresh token (7 días) en cookie `httpOnly`. |
| RF-03 | Auth | Renovación del token de acceso vía `POST /api/auth/refresh` validando el refresh token de la cookie. |
| RF-04 | Users | El administrador puede listar, crear, editar y desactivar usuarios del sistema (`GET/POST/PUT /api/users`). |
| RF-05 | Organizations | Creación de organizaciones con slug único auto-generado, invitación de miembros por email y asignación de roles de organización. |
| RF-06 | Projects | Creación de proyectos vinculados a repositorios GitHub; el sistema obtiene automáticamente metadatos (owner, repo name, lenguaje) via GitHub API. |
| RF-07 | Projects | Los proyectos pueden asociarse a una organización o existir de forma independiente. |
| RF-08 | Scans | Ejecución de escaneos SAST automáticos con Semgrep en Worker Thread, clonando el repositorio y analizando el código fuente. |
| RF-09 | Scans | Los hallazgos se clasifican por severidad, se mapean a CWE y OWASP, e incluyen snippet de código (archivo, línea inicio/fin). |
| RF-10 | Scans | Los pentesters pueden crear revisiones manuales (`MANUAL_REVIEW`) con cálculo automático de resumen de severidades. |
| RF-11 | Findings | Cambio de estado del hallazgo: `OPEN → IN_PROGRESS → RESOLVED / ACCEPTED_RISK / FALSE_POSITIVE`. |
| RF-12 | Findings | Asignación de hallazgos a usuarios activos de la plataforma. |
| RF-13 | Findings | Filtrado de hallazgos por severidad, estado, proyecto y tipo de escaneo. |

#### Requisitos No Funcionales

| ID | Categoría | Descripción | Implementación real |
|---|---|---|---|
| RNF-01 | Seguridad | Contraseñas almacenadas con hash bcrypt (12 rounds) | `bcryptjs` — `auth.service.js:SALT_ROUNDS=12` |
| RNF-02 | Seguridad | Headers HTTP de seguridad en todas las respuestas | `helmet()` — `app.js` |
| RNF-03 | Seguridad | Rate limiting: 100 req/15min general; 10 req/15min en auth | `express-rate-limit` — `rateLimiter.js` |
| RNF-04 | Seguridad | Validación estricta de esquemas antes de cada controlador | `zod` + `validate.js` middleware |
| RNF-05 | Seguridad | Refresh token en cookie `httpOnly; SameSite=Strict; Secure` | `auth.controller.js` |
| RNF-06 | Rendimiento | Escaneos en Worker Thread sin bloquear el event loop | `worker_threads` — `semgrep.worker.js` |
| RNF-07 | Disponibilidad | Graceful shutdown: cierra DB antes de terminar el proceso | `SIGTERM/SIGINT` handlers — `app.js` |
| RNF-08 | Escalabilidad | Pool de conexiones PostgreSQL (máx. 20 conexiones) | `pg.Pool({ max: 20 })` — `database.js` |
| RNF-09 | Observabilidad | Logging estructurado JSON con Pino; pretty-print en dev | `pino` + `pino-pretty` — `logger.js` |
| RNF-10 | Mantenibilidad | Arquitectura modular: queries / service / controller / routes por dominio | `src/modules/<módulo>/` |

#### Guión de apoyo — Puntos clave para hablar con fluidez:
- Para los RF: agrupar por módulo, no leer todos uno a uno. Destacar RF-01 (primer usuario = ADMIN) y RF-08 (Worker Thread) como decisiones de diseño clave.
- Para los RNF: son implementaciones reales, no intenciones. Citar bcrypt rounds=12, rate limiter 10/15min en auth, pool máx. 20 conexiones.
- Mencionar que Zod valida el body **antes** de llegar al controlador: *"el sistema rechaza con 400 cualquier request malformado antes de tocar la lógica."*

---

### 1.8 Propuesta de Solución

#### Arquitectura del Sistema — Tres Capas

```
┌──────────────────────────────────────────────────────────────┐
│                  CAPA DE PRESENTACIÓN                        │
│         React 19 + React Router v7 + Vite 8                 │
│                                                              │
│  src/api/axiosInstance.js  →  Interceptores JWT + refresh   │
│  src/pages/*.jsx           →  10 vistas funcionales          │
│  src/context/AuthContext   →  Estado de sesión en React     │
│  src/api/{módulo}.js       →  Clientes HTTP por dominio     │
└────────────────────────┬─────────────────────────────────────┘
                         │  REST + JSON
                         │  Authorization: Bearer <token>
                         │  Cookie: refreshToken (httpOnly)
┌────────────────────────▼─────────────────────────────────────┐
│                  CAPA DE APLICACIÓN                          │
│          Node.js 24 + Express 4 (ESM modules)               │
│                                                              │
│  Middlewares (app.js):                                       │
│  helmet → cors → cookieParser → json → sanitize             │
│  → requestLogger → rateLimiter → [rutas]                    │
│                                                              │
│  Módulos (src/modules/):                                     │
│  auth │ users │ projects │ scans │ findings │ organizations  │
│                                                              │
│  Cada módulo: *.queries.js → *.service.js → *.controller.js │
│               → *.routes.js                                  │
│                                                              │
│  Worker Thread: semgrep.worker.js (pool pg independiente)   │
└────────────────────────┬─────────────────────────────────────┘
                         │  SQL parametrizado ($1, $2, ...)
                         │  pg.Pool (max: 20)
┌────────────────────────▼─────────────────────────────────────┐
│                    CAPA DE DATOS                             │
│                 PostgreSQL — puerto 5432                     │
│                                                              │
│  users │ refresh_tokens │ organizations │ organization_members│
│  projects │ project_members │ scans │ findings              │
│                                                              │
│  Enums: Role │ OrgRole │ ScanType │ ScanStatus │ Severity   │
│         FindingStatus │ ProjectStatus                        │
└──────────────────────────────────────────────────────────────┘
```

#### Stack Tecnológico Completo

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| Frontend | React | 19.2 | UI reactiva con hooks |
| Frontend | React Router | v7 | SPA routing + rutas protegidas (`AdminRoute`) |
| Frontend | Vite | 8.0 | Build tool + Hot Module Replacement |
| Frontend | Axios | 1.15 | Cliente HTTP con interceptores de refresh automático |
| Backend | Node.js | 24 | Runtime JavaScript en servidor |
| Backend | Express | 4.21 | Framework HTTP REST |
| Backend | pg (node-postgres) | 8.20 | Driver PostgreSQL con queries SQL puras |
| Backend | jsonwebtoken | 9.0 | Firma y verificación de JWT |
| Backend | bcryptjs | 2.4 | Hash de contraseñas (12 rounds) |
| Backend | Zod | 3.24 | Validación y tipado de esquemas |
| Backend | Helmet | 8.0 | Headers de seguridad HTTP |
| Backend | express-rate-limit | 7.5 | Rate limiting por IP |
| Backend | Pino | 9.6 | Logging estructurado JSON |
| Backend | simple-git | 3.27 | Clonar repositorios Git desde Node.js |
| Backend | uuid | 11.0 | Generación de IDs únicos universales |
| Análisis | Semgrep | — | Motor SAST externo — análisis estático de código |
| Base de datos | PostgreSQL | — | Base de datos relacional principal |

#### Decisiones Técnicas Clave

**1. Módulo por feature (Feature-Sliced Architecture):**
Cada dominio del negocio tiene su propio directorio con exactamente cuatro archivos:
```
src/modules/scans/
├── scans.queries.js      ← SQL puro parametrizado
├── scans.service.js      ← Lógica de negocio
├── scans.controller.js   ← Manejo HTTP (req/res)
└── scans.routes.js       ← Definición de rutas + validación Zod
```

**2. Raw SQL sobre ORM (migración de Prisma a `pg`):**
El proyecto migró de Prisma ORM a `pg` con SQL parametrizado (`$1`, `$2`...). Esta decisión elimina la abstracción del ORM, otorga control total sobre las queries, elimina el overhead del cliente Prisma y resuelve problemas de DLL lock en Windows durante el desarrollo con nodemon.

**3. Worker Thread para escaneos:**
`semgrep.worker.js` corre en un hilo independiente. Crea su propio `pg.Pool` a partir de `workerData.DATABASE_URL`, evitando compartir estado con el hilo principal. El servidor responde inmediatamente y el escaneo avanza en background, actualizando el estado directamente en la BD.

**4. JWT dual-token con rotación:**
- **Access token:** 15 min, viaja en header `Authorization: Bearer <token>`
- **Refresh token:** 7 días, almacenado en cookie `httpOnly; SameSite=Strict; Secure` (producción)
- **Rotación:** cada refresh genera un nuevo par y revoca el anterior en la base de datos

**5. Validación fail-fast con Zod:**
Todos los endpoints con body tienen un esquema Zod definido en `*.routes.js`. El middleware `validate.js` rechaza con `HTTP 400` cualquier request que no cumpla el esquema **antes** de llegar al controlador, evitando que datos inválidos contaminen la lógica de negocio.

#### Guión de apoyo — Puntos clave para hablar con fluidez:
- Mostrar el diagrama de tres capas y explicar el flujo de datos de arriba hacia abajo.
- Destacar la migración Prisma → pg: *"Nos dio más control, menos dependencias y resolvió problemas reales de entorno Windows."*
- Hablar del Worker Thread: *"El escaneo puede durar desde segundos hasta varios minutos. Con un Worker Thread, el servidor no se bloquea y puede seguir atendiendo otras peticiones."*
- Explicar el JWT dual-token: *"Si el access token es robado, expira en 15 minutos. El refresh token nunca viaja en localStorage, vive en una cookie que JavaScript no puede leer."*
- Cerrar con visión de futuro: *"Esta arquitectura modular permite agregar DAST, integración CI/CD o exportación de reportes sin tocar los módulos existentes."*

---

---

## CIERRE — TODOS LOS INTEGRANTES

### Conclusiones

1. **FortiDev resuelve un problema real y creciente:** La integración de seguridad en el ciclo de desarrollo (DevSecOps) es una necesidad urgente para equipos ágiles que no pueden permitirse vulnerabilidades en producción.

2. **Arquitectura sólida y escalable:** La separación por módulos, el uso de SQL parametrizado, el Worker Thread para escaneos y la validación con Zod forman una base técnica robusta lista para crecer.

3. **Seguridad de la plataforma misma:** FortiDev aplica las mismas buenas prácticas que promueve — Helmet, bcrypt factor 12, JWT de corta duración, rate limiting y validación estricta de esquemas.

4. **Próximos pasos naturales del proyecto:**
   - Integración con pipelines CI/CD (GitHub Actions, GitLab CI)
   - Exportación de reportes en PDF y formato SARIF
   - Soporte DAST con OWASP ZAP
   - Notificaciones en tiempo real mediante WebSockets
   - Contenedorización con Docker Compose para despliegue simplificado

---

*© 2026 FortiDev · Tecnológico de Antioquia*
