# SERVIGO – Documentación Técnica del Backend

**Autor:** Jorge Juan Moscoso Chacón (JStack-dev)  
**Fecha:** Octubre 2025  
**Versión:** 1.0  

# ServiGo — Backend (Node.js + Express 5 + MongoDB)

Plataforma inteligente de servicios para el hogar (“el Uber de las urgencias domésticas”): asignación en tiempo real de profesionales cercanos, estimación de precio previa, sistema de confianza con reseñas y gamificación, pagos con Stripe, chat y notificaciones en tiempo real, y módulos de IA para clasificación de incidencias y análisis predictivo de logs/seguridad.

---

## Índice
- [Arquitectura](#arquitectura)
- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [API (resumen de endpoints)](#api-resumen-de-endpoints)
- [Seguridad](#seguridad)
- [Observabilidad y métricas](#observabilidad-y-métricas)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Roadmap](#roadmap)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Arquitectura
- **Backend:** Node.js + **Express 5**
- **BD:** MongoDB Atlas (Mongoose)
- **Auth:** JWT con control de **roles** (cliente, profesional, admin)
- **Tiempo real:** Socket.IO (notificaciones, chat, presencia/disponibilidad)
- **Pagos:** Stripe Checkout
- **IA:** Proveedor enchufable (OpenAI / Local). Clasificación de incidencias, estimación de precios y análisis predictivo de logs/seguridad
- **Jobs:** node-cron (recordatorios, escáner de seguridad)
- **Logs:** Winston + colección `logs` en MongoDB

Flujos principales:
- **Urgencias:** geolocalización (índice 2dsphere) y asignación automática del profesional cercano y disponible
- **Servicios/Incidencias:** CRUD + estados (pendiente, en_proceso, completado, cancelado)
- **Chat/Notificaciones:** rooms privadas por usuario/servicio; persistencia de mensajes
- **Gamificación:** estadísticas por profesional (rating medio, niveles, badges)
- **Admin/Dashboard:** métricas, actividad reciente, exportación PDF/CSV

---

## Características
- Modo urgencia en tiempo real (el primero en aceptar, se lo queda)
- Estimación de precio previa al confirmar
- Sistema de reseñas + score de confianza + gamificación
- Mapa vivo de disponibilidad (vía frontend)
- Servicios programados y recordatorios automáticos
- IA ligera (clasificación/pricing) y seguridad predictiva (análisis de logs)
- Auditoría y trazabilidad completas (Winston + colección `logs`)

---

## Requisitos
- Node.js ≥ 20
- NPM
- Cuenta de MongoDB Atlas
- Clave de Stripe (modo test)
- (Opcional) Clave de proveedor IA (OpenAI)

---

## Instalación y puesta en marcha
```bash
# 1) Instalar dependencias
npm install

# 2) Copiar variables de entorno
cp .env.example .env
# Rellenar valores en .env

# 3) Desarrollo
npm run dev

# 4) Producción
npm start

# 5) Pruebas
npm test
```

Scripts de `package.json` esperados:
```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "test": "cross-env NODE_ENV=test jest --runInBand --detectOpenHandles --forceExit"
  }
}
```

---

## Variables de entorno
```env
PORT=8080
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=change_this_secret
STRIPE_SECRET_KEY=sk_test_xxx

# IA
AI_PROVIDER=openai   # o "local"
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

---

## Estructura del proyecto
```
backend/
 ├─ src/
 │   ├─ controllers/        # lógica de orquestación por recurso
 │   ├─ routes/             # definición de endpoints + protección por rol
 │   ├─ models/             # esquemas Mongoose (User, Service, Review, Message, Notification, Payment, Log)
 │   ├─ middlewares/        # auth (verifyToken, checkRole), sanitize, antifraud, rate-limit, error handler
 │   ├─ services/           # dominio y terceros (Stripe, IA, métricas, etc.)
 │   ├─ utils/              # logger (Winston), alertManager, scheduler, ai provider
 │   ├─ tests/              # Jest, Supertest y socket.io-client
 │   └─ index.js            # punto de entrada (Express, HTTP, Socket.IO)
 ├─ .env                    # no versionar
 ├─ .env.example
 ├─ package.json
 ├─ jest.config.js
 └─ README.md
```

---

## API (resumen de endpoints)

**Auth**
- `POST /api/auth/register` — alta de usuario y JWT
- `POST /api/auth/login` — login y JWT

**Roles / Pruebas**
- `GET /api/test/perfil` — autenticado
- `GET /api/test/profesional` — profesional/admin
- `GET /api/test/admin` — admin

**Servicios / Incidencias**
- `POST /api/services` — crear (profesional/admin)
- `GET /api/services` — listar (cliente/admin)
- `GET /api/services/mine` — del profesional autenticado
- `PATCH /api/services/:id` — actualizar datos del servicio
- `DELETE /api/services/:id` — eliminar
- `PATCH /api/services/:id/status` — cambiar estado (profesional/admin)

**Urgencias**
- `POST /api/urgencias` — crea servicio urgente (cliente), asignación automática por proximidad

**Reseñas**
- `POST /api/reviews` — crear (cliente autenticado)
- `GET /api/reviews/:professionalId` — listar reseñas de un profesional

**Mensajería**
- `POST /api/messages` — enviar mensaje (JWT)
- `GET /api/messages/:serviceId` — historial del servicio

**Notificaciones**
- `GET /api/notifications` — mis notificaciones
- `PATCH /api/notifications/:id/read` — marcar como leída

**Pagos (Stripe)**
- `POST /api/payments/checkout` — crear sesión de pago
- `POST /api/payments/webhook` — confirmación
- `GET /api/payments/:serviceId` — estado

**Admin / Dashboard**
- `GET /api/dashboard/stats` — métricas agregadas
- `GET /api/dashboard/recent` — actividad reciente
- `GET /api/users/profile` — perfil + gamificación
- `GET /api/logs` — lectura de logs (admin)
- `DELETE /api/logs` — limpieza de logs (admin)
- `GET /api/metrics` — métricas internas (JWT)

**Exportaciones**
- `GET /api/export/pdf` — PDF (admin)
- `GET /api/export/csv` — CSV (admin)

**IA**
- `POST /api/ai/incidents/classify`
- `POST /api/ai/pricing/estimate`
- `POST /api/ai/analyze`
- `POST /api/ai/urgency`
- `GET  /api/ai/test`
- `GET  /api/ai/logs/analyze`
- `GET  /api/ai/security/analyze` (admin)

> Todas las rutas sensibles están protegidas con JWT + control de roles. Los endpoints IA incluyen rate limiting y fallback seguro si no hay proveedor externo.

---

## Seguridad
- **HTTP Hardening:** Helmet (CSP, frameguard, referrerPolicy, crossOriginResourcePolicy)
- **CORS:** lista blanca en producción; abierto sólo en desarrollo
- **TLS/HSTS:** forzado en producción
- **Rate limiting + slow down:** mitigación de fuerza bruta/DDoS
- **Sanitización/validación:** `mongo-sanitize` (compatible Express 5), `xss-clean`, `validator`
- **Antifraude:** bloqueo temporal de IP tras múltiples intentos fallidos; trazabilidad en logs
- **Alertas:** canal `securityAlert` vía Socket.IO para el panel admin
- **Auditoría:** Winston + colección `logs`; funciones `createLog`/`createSystemLog`
- **OWASP:** mensajes de error genéricos, mínimo de datos, rotación de secretos, principio de menor privilegio

---

## Observabilidad y métricas
- **Logging:** `logs/errors.log` y `logs/combined.log` + colección `logs` en MongoDB
- **Métricas internas:** latencia, volumen, 2xx/4xx/5xx, usuarios conectados a Socket.IO
- **Endpoint:** `GET /api/metrics` (JWT)
- **IA de seguridad:** análisis predictivo de logs (salud, issues, recomendaciones)

---

## Testing
- **Stack:** Jest + Supertest + socket.io-client
- **Prácticas:** `server.listen` solo fuera de `NODE_ENV=test`, export del `server` para Supertest, cierre limpio de sockets/servidor
- **Cobertura clave:**
  - WS: conexión, join a rooms, envío/recepción (`socket.test.js`)
  - REST: validaciones (ObjectId), rutas de chat/notificaciones
  - IA: clasificación/pricing/logs/security con token simulado
```bash
npm test
```

---

## Despliegue
- **Render** conectado a GitHub (root: `/backend`)
- **Build:** `npm install`
- **Start:** `npm start`
- **Node:** 22.x; **Express:** 5.x
- **Compatibilidad Express 5:** sustituir `express-mongo-sanitize` por `mongo-sanitize`; evitar mutar `req.query`
- **Ruta raíz `/`** para evitar 404 inicial
- **Variables de entorno**: JWT, Mongo, Stripe, IA

---

## Roadmap
1. Historias de usuario + modelos BD  
2. Auth + endpoints base (Nest/Express)  
3. Frontend React (login, mapa, perfiles)  
4. Urgencias en tiempo real (WebSockets)  
5. IA (clasificación + pricing)  
6. Testing (Jest/Cypress)  
7. Automatización con n8n + notificaciones  
8. Seguridad avanzada + despliegue (Vercel + Railway/Render)

---

## Contribución
- Estilo de código: ESLint/Prettier (recomendado)
- Convenciones de commits (Conventional Commits)
- PRs con descripción técnica, checklist de pruebas y captura de logs en caso de errores

---

## Licencia
Este proyecto se publica bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.
