ServiGo — “el Uber de las urgencias del hogar” ya tiene backend real, seguro y listo para producción

Tras varias semanas de trabajo he cerrado la primera versión funcional y documentada del backend de ServiGo, una plataforma inteligente que conecta a clientes con electricistas, fontaneros, cerrajeros y carpinteros disponibles en su zona, priorizando rapidez, transparencia y confianza.

Qué lo hace diferente

Modo Urgencia en tiempo real: asignación automática del profesional disponible más cercano; el primero en aceptar, se lo queda.

Asistente inteligente: a partir de texto o imagen, la IA clasifica la incidencia y sugiere el oficio adecuado.

Estimación de precio previa: rango orientativo antes de confirmar (p. ej., “Cambiar enchufe: 40–55 €”).

Sistema de confianza: reseñas + puntualidad + cancelaciones; gamificación con niveles y medallas.

Mapa vivo: profesionales online y libres, con vista rápida de quién puede llegar antes.

Servicios recurrentes: además de urgencias, mantenimientos programados.

Arquitectura y stack

Backend: Node.js + Express 5, MongoDB Atlas (Mongoose), JWT (roles: cliente/profesional/admin), Socket.IO (notificaciones, chat, disponibilidad), Stripe (pagos), node-cron (recordatorios/escáneres), Winston (logs).

Módulos clave:

Autenticación y control de roles (rutas protegidas).

Servicios/Incidencias (CRUD + estados + urgencias con geolocalización 2dsphere).

Chat y notificaciones en tiempo real (rooms privados room_user_* y room_service_*).

Reseñas y puntuaciones con cálculo de score medio.

Dashboard admin: métricas, actividad reciente y exportación PDF/CSV.

IA integrada:

Clasificación de incidencias y estimación de precios.

Análisis predictivo de logs y seguridad (salud del sistema, issues y recomendaciones).

Endpoints dedicados con rate limiting y fallback seguro si no hay clave externa.

Seguridad (Security by Design & by Default)

Helmet, CORS con lista blanca, HSTS en producción.

Rate limiting + slow down, sanitización anti-XSS y anti-inyección Mongo.

Middleware antifraude (bloqueo temporal por IP si hay intentos repetidos de login).

Alertas de seguridad en tiempo real al panel admin vía Socket.IO.

Auditoría completa: logs centralizados (Winston + colección logs) y rutas de lectura/limpieza (admin).

Observabilidad y calidad

Métricas internas (latencia, 2xx/4xx/5xx, usuarios conectados) en /api/metrics.

Testing: Jest + Supertest + socket.io-client; cierres limpios, validación de ObjectId, tests de IA y real-time.

Documentación corporativa en docs/:

Arquitectura, Seguridad, API, IA, Observabilidad, Testing, Deploy y Changelog, con .env.example.

Despliegue

Render conectado a GitHub (carpeta /backend), Node 22, Express 5 y variables de entorno (JWT, Mongo, Stripe, IA). Compatibilidad ajustada (sanitize para Express 5, sin mutar req.query).

Por qué aporta valor al portfolio

No es un CRUD: es un marketplace con tiempo real, geolocalización, pagos y gamificación.

Incluye IA ligera y observabilidad.

Arquitectura y seguridad alineadas con OWASP.

Se siente producto, no ejercicio académico.

Roadmap (resumen)

Historias de usuario + modelos BD

Auth + endpoints base (Nest/Express)

Frontend React (login, mapa, perfiles)

Urgencias WebSocket

IA (clasificación + pricing)

Testing (Jest/Cypress)

Automatización con n8n

Seguridad + despliegue (Vercel + Railway/Render)
