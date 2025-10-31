# ServiGo — Full Stack (Backend + Frontend)

Plataforma inteligente de servicios para el hogar (“el Uber de las urgencias domésticas”): asignación en tiempo real de profesionales cercanos, estimación de precio previa, sistema de confianza con reseñas y gamificación, pagos con Stripe, chat y notificaciones en tiempo real, y módulos de IA para clasificación de incidencias y análisis predictivo de logs/seguridad.

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

## Arquitectura

### Backend
Backend: Node.js + Express 5  
BD: MongoDB Atlas (Mongoose)  
Auth: JWT con control de roles (cliente, profesional, admin)  
Tiempo real: Socket.IO (notificaciones, chat, presencia/disponibilidad)  
Pagos: Stripe Checkout  
IA: Proveedor enchufable (OpenAI / Local). Clasificación de incidencias, estimación de precios y análisis predictivo de logs/seguridad  
Jobs: node-cron (recordatorios, escáner de seguridad)  
Logs: Winston + colección logs en MongoDB  

### Frontend
Frontend: React 18 + Vite 5 + TypeScript + Tailwind CSS v4  
Estado global: React Context (AuthContext, ThemeContext, NotificationContext)  
Estilos: Tailwind con tema claro/oscuro y diseño responsive  
Comunicación: Axios + Interceptores JWT + Socket.IO Client  
UI: Framer Motion, react-hot-toast, dashboards dinámicos y alertas en tiempo real  
Despliegue: Vercel (frontend) + Render (backend) + MongoDB Atlas  

## Características
Modo urgencia en tiempo real (el primero en aceptar, se lo queda)  
Estimación de precio previa al confirmar  
Sistema de reseñas + score de confianza + gamificación  
Mapa vivo de disponibilidad (vía frontend)  
Servicios programados y recordatorios automáticos  
IA ligera (clasificación/pricing) y seguridad predictiva (análisis de logs)  
Auditoría y trazabilidad completas (Winston + colección logs)  
Interfaz moderna y responsiva (React + Tailwind v4)  
Tema oscuro/claro persistente  
Chat y notificaciones en tiempo real  
Panel de métricas y dashboards personalizados por rol  

## Requisitos
Node.js ≥ 20  
NPM  
Cuenta de MongoDB Atlas  
Clave de Stripe (modo test)  
(Opcional) Clave de proveedor IA (OpenAI)  

## Instalación y puesta en marcha

### Backend
```bash
# 1) Instalar dependencias
npm install

# 2) Copiar variables de entorno
cp .env.example .env

# 3) Desarrollo
npm run dev

# 4) Producción
npm start

# 5) Pruebas
npm test
```

### Frontend
```bash
# 1) Instalar dependencias
npm install

# 2) Variables de entorno
cp .env.example .env
VITE_API_URL=https://servigo-backend.onrender.com

# 3) Desarrollo
npm run dev

# 4) Build de producción
npm run build

# 5) Vista previa local
npm run preview
```

## Variables de entorno

### Backend
```env
PORT=8080
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=change_this_secret
STRIPE_SECRET_KEY=sk_test_xxx

# IA
AI_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### Frontend
```env
VITE_API_URL=https://servigo-backend.onrender.com
VITE_MODE=production
```

## Estructura del proyecto

### Backend
```
backend/
 ├─ src/
 │   ├─ controllers/
 │   ├─ routes/
 │   ├─ models/
 │   ├─ middlewares/
 │   ├─ services/
 │   ├─ utils/
 │   ├─ tests/
 │   └─ index.js
 ├─ .env
 ├─ .env.example
 ├─ package.json
 ├─ jest.config.js
 └─ README.md
```

### Frontend
```
frontend/
 ├─ src/
 │   ├─ components/
 │   │   ├─ layout/
 │   │   └─ ui/
 │   ├─ context/
 │   ├─ hooks/
 │   ├─ layouts/
 │   ├─ pages/
 │   ├─ router/
 │   ├─ styles/
 │   ├─ services/
 │   └─ types/
 ├─ index.html
 ├─ vite.config.ts
 ├─ tsconfig.json
 └─ package.json
```

## API (resumen de endpoints)
(Sin cambios respecto al backend original, aplicable al frontend vía Axios.)

## Seguridad
HTTP Hardening: Helmet (CSP, frameguard, referrerPolicy, crossOriginResourcePolicy)  
CORS: lista blanca en producción; abierto solo en desarrollo  
TLS/HSTS: forzado en producción  
Rate limiting + slow down: mitigación de fuerza bruta/DDoS  
Sanitización/validación: mongo-sanitize, xss-clean, validator  
Antifraude: bloqueo temporal de IP tras múltiples intentos fallidos  
Alertas: canal securityAlert vía Socket.IO para panel admin  
Auditoría: Winston + colección logs; funciones createLog/createSystemLog  
OWASP: mensajes de error genéricos, mínimo de datos, principio de menor privilegio  

## Observabilidad y métricas
Logging: logs/errors.log y logs/combined.log + colección logs en MongoDB  
Métricas internas: latencia, volumen, 2xx/4xx/5xx, usuarios conectados a Socket.IO  
Endpoint: GET /api/metrics (JWT)  
Frontend: panel de métricas y dashboard en tiempo real (Recharts + Tailwind)  

## Testing
Backend: Jest + Supertest + socket.io-client  
Frontend: React Testing Library (planificado)  

Cobertura clave:  
- WS: conexión, join a rooms, envío/recepción (socket.test.js)  
- REST: validaciones (ObjectId), rutas de chat/notificaciones  
- IA: clasificación/pricing/logs/security con token simulado  

## Despliegue
* Backend desplegado en Render (`servigo-backend.onrender.com`)  
* Frontend desplegado en Vercel (`servigo.vercel.app`)  

Render conectado a GitHub (root: /backend)  
Build: npm install — Start: npm start  
Node: 22.x; Express: 5.x  

Vercel conectado a GitHub (root: /frontend)  
Build: npm run build — Output Directory: dist  

**Arquitectura de despliegue:**  
```
Frontend (Vercel)
↓ HTTPS / API
Backend (Render)
↓
MongoDB Atlas
```

**CORS configurado:**  
```js
const corsOptions = {
  origin: ["https://servigo.vercel.app"],
  credentials: true,
};
app.use(cors(corsOptions));
```

## Roadmap
Historias de usuario + modelos BD  
Auth + endpoints base (Nest/Express)  
Frontend React (login, mapa, perfiles)  
Urgencias en tiempo real (WebSockets)  
IA (clasificación + pricing)  
Testing (Jest/Cypress)  
Automatización con n8n + notificaciones  
Seguridad avanzada + despliegue (Vercel + Render)  

## Contribución
Estilo de código: ESLint/Prettier (recomendado)  
Convenciones de commits (Conventional Commits)  
PRs con descripción técnica, checklist de pruebas y captura de logs en caso de errores  

## Licencia
Proyecto publicado bajo la licencia MIT.  

**Autor:** Jorge Juan Moscoso Chacón (JStack-dev)  
**Fecha:** Octubre 2025  
**Versión:** 1.0  
