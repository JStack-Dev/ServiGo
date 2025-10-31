# ServiGo — Backend (Documentación Técnica Consolidada)
**Fecha:** 2025-10-12

Este documento consolida, en un único archivo, la documentación del backend de ServiGo. Se respetan los puntos indicados por el autor, con redacción técnica, formato corporativo y sin iconografía.

---

## Índice
1. Alcance y documentación inicial
2. Inicialización del proyecto
3. Dependencias de producción
4. Dependencias de desarrollo y testing
5. Estructura de carpetas
6. Scripts de npm
7. Validación del backend (index.js)
8. Conexión a MongoDB Atlas y test de conexión
9. Autenticación (JWT) y registro/login
10. CRUD de Servicios/Incidencias
11. Sistema de estados y asignación de servicios
12. Modo Urgencia y asignación automática
13. Sistema de reseñas y puntuaciones
14. Gamificación (niveles y medallas)
15. Pagos con Stripe
16. Notificaciones y alertas en tiempo real
17. Mapa de disponibilidad en tiempo real
18. Servicios programados y recordatorios
19. Panel de administración
20. Dashboard estadístico del administrador
21. Exportación de reportes (PDF/CSV)
22. Sistema de logs y auditoría
23. Notificaciones y mensajería en tiempo real (Socket.IO avanzado)
23.2 Chat en tiempo real
23.3 Notificaciones inteligentes
24. Testing del sistema real-time (WS + REST)
25. Módulo de IA inteligente (clasificación + pricing) y seguridad del servidor
26. Integración IA: análisis automático de texto y urgencia
27. Logging profesional y monitorización
28. IA predictiva para análisis de logs
28.2 Ruta protegida de análisis predictivo de logs
29. Pruebas automáticas del módulo de IA
30. Observabilidad y métricas internas
30.1 Dashboard de métricas en tiempo real
31. Seguridad avanzada y endurecimiento
32. Seguridad complementaria y defensa activa
33. Sanitización y validación de entrada
34. Middleware antifraude
35. Alertas automáticas de seguridad
36. IA de detección temprana de ataques
37. Escaneo automático y alertas preventivas (cron + IA)
38. Validación final de IA y seguridad
39. Despliegue en Render
Anexos: Variables de entorno y comandos clave

---

## 1. Alcance y documentación inicial
- Se crea la documentación base en `docs/`: historias de usuario, modelo de datos, roadmap y plan de proyecto.

## 2. Inicialización del proyecto
- Inicialización con `npm init` para generar `package.json` y definir scripts, metadatos y dependencias.

## 3. Dependencias de producción
Instalación orientativa:
```bash
npm install express mongoose bcrypt jsonwebtoken cors dotenv morgan
```
- **express**: framework HTTP/REST.
- **mongoose**: ODM para MongoDB.
- **bcrypt**: hashing de contraseñas.
- **jsonwebtoken**: emisión y verificación de JWT.
- **cors**: cabeceras CORS.
- **dotenv**: gestión de variables de entorno.
- **morgan**: logging HTTP en desarrollo.

## 4. Dependencias de desarrollo y testing
```bash
npm install --save-dev nodemon jest supertest
```
- **nodemon**: reinicio automático en desarrollo.
- **jest**: framework de testing.
- **supertest**: testing de APIs REST sin navegador.

## 5. Estructura de carpetas
```
src/
 ├─ models/
 ├─ routes/
 ├─ controllers/
 ├─ middlewares/
 ├─ services/
 ├─ tests/
 ├─ utils/
 └─ index.js
.env
jest.config.js
```
- `.env`: configuración local.
- `jest.config.js`: soporte ESM y configuración de tests.

## 6. Scripts de npm
```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "test": "jest --runInBand"
  }
}
```

## 7. Validación del backend (index.js)
```js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();
const app = express();
```
- Express inicializado, CORS y morgan para desarrollo, carga de `.env`.

## 8. Conexión a MongoDB Atlas y test de conexión
- Conexión a MongoDB mediante `mongoose.connect(process.env.MONGO_URI)`.
- Test de conexión ejecutando: `node src/tests/testUser.js`.

## 9. Autenticación (JWT) y registro/login
- **Modelo User**: `name`, `email`, `password` (hash bcrypt), `role`.
- **Controladores**:
  - `registerUser`: alta de usuarios, validación de duplicados, emisión de JWT.
  - `loginUser`: validación de credenciales y JWT de acceso.
- **Rutas**: `auth.routes.js` para registro e inicio de sesión.
- **Middleware**: `verifyToken` para rutas protegidas.
- Resultado: autenticación segura con contraseñas cifradas, validaciones y emisión de tokens.

## 10. CRUD de Servicios/Incidencias
- **Modelo Service**: título, descripción, categoría, precio, estado, urgencia, profesional, cliente, fechas (`timestamps`).
- **Controlador**: `createService`, `getAllServices`, `getServicesByProfessional`, `updateService`, `deleteService`.
- **Rutas**: `service.routes.js` bajo `/api/services` con `verifyToken` y `checkRole`.
- Validado con Postman.

## 11. Sistema de estados y asignación de servicios
- Campos adicionales en `Service`: `assignedTo`, `acceptedAt`.
- `updateServiceStatus`: gestiona estados (`pendiente`, `en_proceso`, `completado`, `cancelado`) y asignación automática al aceptar.
- Ruta: `PATCH /api/services/:id/status` protegida (profesional/admin).

## 12. Modo Urgencia y asignación automática
- **User** incluye `location` [lng, lat], `isAvailable` y **índice 2dsphere**.
- **Controller**: `createUrgentService` asigna profesional cercano y marca ocupado.
- **Ruta**: `POST /api/urgencias` (JWT, rol cliente).

## 13. Sistema de reseñas y puntuaciones
- **Modelo Review**: `service`, `client`, `professional`, `rating`, `comment`.
- **Controlador**: `createReview` (valida participación) y `getProfessionalReviews`.
- **Rutas**: `POST /api/reviews` (cliente autenticado) y `GET /api/reviews/:id` (consulta pública).

## 14. Gamificación (niveles y medallas)
- Ampliación de **User**: `averageRating`, `completedServices`, `level`, `badges`.
- Al completar un servicio, se recalculan métricas y se asignan medallas.
- **Ruta**: `GET /api/users/profile` retorna progreso y recompensas.

## 15. Pagos con Stripe
- Integración de Stripe Checkout.
- Registro de pagos con importe, cliente, profesional y estado.
- Actualiza el estado del servicio tras confirmación.

## 16. Notificaciones y alertas en tiempo real
- Integración de **Socket.IO** para enviar eventos cuando se crean/actualizan/eliminan servicios.
- Eventos de ejemplo: `newService`, `statusUpdated`, `serviceDeleted`.

## 17. Mapa de disponibilidad en tiempo real
- Mapa que muestra profesionales cercanos, con actualización de posición y disponibilidad.
- Cambios reflejados instantáneamente vía Socket.IO.

## 18. Servicios programados y recordatorios
- **node-cron** para revisar servicios próximos y emitir recordatorios automáticos a clientes y profesionales.
- Cobertura para urgencias y servicios planificados.

## 19. Panel de administración
- Gestión de usuarios, servicios y pagos (acceso restringido a **admin**).

## 20. Dashboard estadístico del administrador
- Agregaciones MongoDB (`countDocuments`, `aggregate`, `$group`, `$avg`, `$sum`).
- Endpoints: `/api/dashboard/stats`, `/api/dashboard/recent` (JWT + rol admin).

## 21. Exportación de reportes (PDF/CSV)
- Exportación dinámica con **pdfkit** y **json2csv** (JWT + rol admin).

## 22. Sistema de logs y auditoría
- **Modelo Log**: usuario, rol, acción, descripción, IP, timestamps.
- **Controlador**: `getAllLogs`, `clearLogs` (admin).
- **Rutas**: `GET /api/logs`, `DELETE /api/logs` (JWT + admin).
- **Utilidad**: `createLog()` reutilizable desde cualquier controlador.

## 23. Notificaciones y mensajería en tiempo real (Socket.IO avanzado)
- Integración Socket.IO sobre capa HTTP de Express.
- **Rooms**: `room_user_<id>` (individual) y `room_service_<id>` (compartido).
- **Modelo Message**: `serviceId`, `sender`, `receiver`, `content`, `read`.

### 23.2 Chat en tiempo real
- **Controlador**: `sendMessage` (crea, guarda y emite), `getMessagesByService` (historial).
- **Rutas**: `POST /api/messages` y `GET /api/messages/:serviceId` (JWT).
- **Eventos**: `joinRoom`, `sendMessage`, `newMessage`, `updateLocation`.

### 23.3 Notificaciones inteligentes
- **Modelo Notification**: usuario, título, mensaje, tipo, leído.
- **Controlador**: `createNotification`, `getUserNotifications`, `markAsRead`.
- **Rutas**: `GET /api/notifications`, `PATCH /api/notifications/:id/read`.
- Emisión a `room_user_<id>` y lectura en tiempo real.

## 24. Testing del sistema real-time (WS + REST)
- **Stack**: Jest, Supertest, `socket.io-client`.
- `server.listen` solo fuera de `NODE_ENV=test`; export del `server` para Supertest.
- Tests WS: conexión, join, envío/recepción, cierre limpio de sockets/servidor.
- Tests REST: validación de `ObjectId`, rutas de chat y notificaciones.
- Cron en test deshabilitado mediante `NODE_ENV=test` y utilidades `startSchedulers()/stopSchedulers()`.

## 25. Módulo de IA inteligente (clasificación + pricing) y seguridad del servidor
- **IA**: clasificación a partir de texto (oficio + confianza) y estimación de precio (rango en EUR).
- **Arquitectura**: provider pluggable (`src/utils/ai/provider.js`) con OpenAI o local (TensorFlow.js).
- **Controlador IA**:
  - `POST /api/ai/incidents/classify` → `{category, confidence, reasoning}`
  - `POST /api/ai/pricing/estimate` → `{min, max, currency, reasoning}`
- **Seguridad**: JWT, rate limiting por minuto, Helmet global.
- **Fallback** seguro si falta `OPENAI_API_KEY`.

## 26. Integración IA: análisis automático de texto y urgencia
- **Rutas**: `ai.routes.js` con rate limiting (express-rate-limit).
- **Controlador**: `ai.controller.js` valida entrada y delega a `ai.service.js`.
- **Servicios**: análisis de sentimiento, resumen, keywords y clasificación de urgencia.
- **Endpoints**:
  - `POST /api/ai/analyze`
  - `POST /api/ai/urgency`
  - `GET /api/ai/test`

## 27. Logging profesional y monitorización
- **Winston** con transportes a `logs/errors.log` y `logs/combined.log`.
- Reemplazo de `console.log` por `logger.info/error/warn`.
- Middleware de errores centralizado.

## 28. IA predictiva para análisis de logs
- **aiLog.service.js**: lectura de logs recientes, envío a modelo IA (OpenAI/TensorFlow) y diagnóstico con `health`, `mainIssues`, `recommendations`, `confidence`.

## 28.2 Ruta protegida de análisis predictivo de logs
- **Ruta**: `GET /api/ai/logs/analyze` (JWT + rate limiting).
- **Controlador**: `analyzeLogs()` → invoca `analyzeSystemLogs()` y retorna diagnóstico.

## 29. Pruebas automáticas del módulo de IA
- **Archivo**: `src/tests/ai.test.js` con tests para clasificación, pricing y análisis de logs.
- Acceso con token simulado (`TEST_JWT`).

## 30. Observabilidad y métricas internas
- Middleware global: latencia, código de estado, volumen de tráfico.
- Contadores: totales, 4xx, 5xx, tiempo medio de respuesta, usuarios conectados (Socket.IO).
- **Ruta**: `GET /api/metrics` (JWT).

### 30.1 Dashboard de métricas en tiempo real
- **system**: CPU, RAM, uptime, plataforma (módulo `os`).
- **app**: peticiones, errores 4xx/5xx, tiempo medio, sockets activos.

## 31. Seguridad avanzada y endurecimiento
- **Helmet** (CSP, frameguard, referrerPolicy, crossOriginResourcePolicy).
- **CORS** con lista blanca (producción) y abierto en desarrollo.
- Ocultación de trazas en errores de producción.

## 32. Seguridad complementaria y defensa activa
- **Rate limiting + slow down**.
- **Sanitización y validación** con `mongo-sanitize`, `xss-clean`, `validator`.
- **HTTPS/HSTS** en producción.
- **Antifraude**: análisis de frecuencia y bloqueo temporal; registro en `logs`.
- **Alertas automáticas** a admin (Socket.IO); integración futura con n8n/Discord.
- **IA de detección de ataques** en `aiLog.service.js` para patrones de IP/errores.

## 33. Sanitización y validación de entrada
- Instalación: `npm install mongo-sanitize xss-clean validator`.
- Middleware global `sanitize.middleware.js` (compatible con Express 5 sin mutar `req.query`).

## 34. Middleware antifraude
- Historial en memoria de intentos fallidos por IP; bloqueo 10 minutos tras 5 intentos.
- Limpieza de contador al login correcto.
- Registro mediante `createLog`.

## 35. Alertas automáticas de seguridad
- **alertManager.js** emite `securityAlert` con título, descripción y `timestamp` a administradores conectados.
- Integración con `antifraud.middleware.js` al bloquear IPs.

## 36. IA de detección temprana de ataques
- **aiSecurity.service.js** analiza `logs/combined.log`, genera diagnóstico y registra en `logs` con rol `system`.
- **Ruta**: `GET /api/ai/security/analyze` (JWT + `checkRole(['admin'])`).

## 37. Escaneo automático y alertas preventivas (cron + IA)
- **scheduler.js**: cron cada hora ejecuta `analyzeSecurityPatterns()` y, si el estado no es estable, envía alerta `securityAlert`.
- Integración en `index.js`: `startSchedulers()` si `NODE_ENV !== 'test'`.

## 38. Validación final de IA y seguridad
- Mejora de `logger.js` con `createLog`/`createSystemLog`, inclusión de IP y User-Agent.
- Modelo `Log` con rol `system`, timestamps e índice temporal.
- `scheduler.js` con bandera `schedulersStarted` para evitar duplicaciones.
- Verificaciones: registros en MongoDB, no duplicación de cron, simulaciones IA correctas y sin errores.

## 39. Despliegue en Render
- Repositorio GitHub con carpeta `/backend` y `.gitignore` adecuado.
- Render configurado con:
  - **Root**: `backend`
  - **Build**: `npm install`
  - **Start**: `npm start`
- Variables de entorno: `PORT`, `MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `AI_PROVIDER`, `OPENAI_API_KEY`, `OPENAI_MODEL`.
- Compatibilidad Express 5: sustitución de `express-mongo-sanitize` por `mongo-sanitize`; no mutar `req.query` en middlewares.
- Ruta raíz `/` añadida para evitar 404 iniciales.
- Servicio activo en URL pública (según instancia desplegada).

---

## Anexos

### A. Variables de entorno (ejemplo)
```env
PORT=8080
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=change_this_secret
STRIPE_SECRET_KEY=sk_test_xxx
AI_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### B. Comandos clave
```bash
# Instalación
npm install

# Desarrollo
npm run dev

# Producción
npm start

# Testing
npm test
```

---

© ServiGo. Uso interno. Este documento consolida los puntos entregados y los presenta en formato corporativo.
