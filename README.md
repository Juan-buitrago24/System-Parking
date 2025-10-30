# System Parking 🚗

Plataforma moderna de administración de parqueaderos con autenticación completa, control de ocupación, facturación y reportes de ingresos. Sistema full-stack desarrollado con Node.js/Express/PostgreSQL en el backend y React/Vite/Tailwind en el frontend.

![Status](https://img.shields.io/badge/Status-Sprint%201%20Completado-success)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)

---

## 🎯 Descripción

Sistema de gestión integral de parqueaderos que permite administrar vehículos, espacios, tarifas y generar reportes. El proyecto sigue una arquitectura moderna con API REST, autenticación JWT, y una interfaz de usuario atractiva y responsive.

---

## ✨ Sprint 1 - Sistema de Autenticación ✅

### Funcionalidades Implementadas

- ✅ **Login de usuario** - Autenticación con JWT y validación
- ✅ **Registro de cuenta** - Con validación de datos en tiempo real
- ✅ **Verificación de cuenta** - Envío de email con token
- ✅ **Recuperación de contraseña** - Sistema completo de reset
- ✅ **Actualización de perfil** - Datos personales y teléfono
- ✅ **Cambio de contraseña** - Con validación de contraseña actual
- ✅ **Cierre de sesión** - Limpieza segura de sesión
- ✅ **Diseño moderno y responsive** - Glassmorphism y animaciones

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL instalado y corriendo
- Cuenta de Gmail (para envío de correos)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Juan-buitrago24/System-Parking.git
cd System-Parking
```

### 2. Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 3. Configurar Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 4. Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Prisma Studio**: `npx prisma studio` (en carpeta backend)

📖 **Ver [GUIA_INICIO.md](GUIA_INICIO.md) para instrucciones detalladas**

---

## 🏗️ Tecnologías

### Backend
- **Node.js** + **Express** - Framework del servidor
- **Prisma ORM** - Gestión de base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **Bcrypt** - Hash seguro de contraseñas
- **Resend** - Envío de emails profesional

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool ultrarrápido
- **React Router v6** - Enrutamiento SPA
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework de estilos utility-first
- **Lucide React** - Iconos modernos
- **Context API** - Gestión de estado global

---

## 📁 Estructura del Proyecto

```
System-Parking/
├── backend/                    # API REST
│   ├── src/
│   │   ├── server.js          # Servidor Express
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── routes/            # Endpoints de la API
│   │   ├── middleware/        # Auth y validación
│   │   ├── utils/             # Utilidades y helpers
│   │   └── config/            # Configuración DB y email
│   ├── prisma/
│   │   └── schema.prisma      # Modelo de datos
│   └── README.md              # Docs del backend
│
├── frontend/                   # Aplicación React
│   ├── src/
│   │   ├── App.jsx            # Router principal
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas de la app
│   │   ├── context/           # State management
│   │   └── services/          # Servicios de API
│   └── README.md              # Docs del frontend
│
├── GUIA_INICIO.md             # Guía de configuración
└── README.md                  # Este archivo
```

---

## 📊 Endpoints de la API

### Autenticación (Públicos)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/verify/:token` | Verificar cuenta |
| POST | `/api/auth/forgot-password` | Solicitar reset |
| POST | `/api/auth/reset-password/:token` | Restablecer contraseña |

### Perfil (Protegidos)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/auth/profile` | Obtener perfil |
| PUT | `/api/auth/profile` | Actualizar perfil |
| PUT | `/api/auth/change-password` | Cambiar contraseña |
| POST | `/api/auth/logout` | Cerrar sesión |

---

## 🎨 Características del Diseño

- 🎨 **Glassmorphism** - Efectos de cristal modernos
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Animaciones Suaves** - Transiciones elegantes
- 🎯 **Validación en Tiempo Real** - Feedback inmediato
- 🔔 **Notificaciones Visuales** - Alertas informativas
- 🌈 **Gradientes Vibrantes** - Diseño atractivo
- 🔒 **Rutas Protegidas** - Seguridad en navegación

---

## 🗺️ Roadmap del Proyecto

### ✅ Sprint 1: Autenticación (Completado)
- Login, Registro, Verificación
- Recuperación de contraseña
- Gestión de perfil

### 🔄 Sprint 2: Gestión de Vehículos (Próximo)
- Registro de entrada/salida
- Búsqueda y filtrado
- Historial de vehículos

### 📅 Sprint 3: Control de Espacios
- Mapa visual del parqueadero
- Asignación automática de espacios
- Estado en tiempo real

### 💰 Sprint 4: Facturación
- Cálculo automático de tarifas
- Generación de recibos
- Historial de pagos

### 📈 Sprint 5: Reportes y Análisis
- Reportes de ingresos diarios/mensuales
- Estadísticas de ocupación
- Exportación de datos (PDF, Excel)

---

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev        # Desarrollo con nodemon
npm start          # Producción
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio
```

### Frontend
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
```

---

## 📝 Variables de Entorno

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/parking_db"
JWT_SECRET="tu-clave-secreta"
RESEND_API_KEY="re_tu_api_key_aqui"
RESEND_FROM_EMAIL="System Parking <onboarding@resend.dev>"
FRONTEND_URL="http://localhost:5173"
PORT=3000
```

**Obtén tu Resend API Key en:** [https://resend.com/api-keys](https://resend.com/api-keys)

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🐛 Solución de Problemas

Ver la [Guía de Inicio](GUIA_INICIO.md) para soluciones a problemas comunes.

---

## 👥 Roles de Usuario

- **ADMIN** - Acceso completo al sistema
- **EMPLOYEE** - Operaciones diarias del parqueadero

---

## 📚 Documentación

- [Guía de Inicio](GUIA_INICIO.md) - Configuración detallada
- [Backend README](backend/README.md) - Documentación de la API
- [Frontend README](frontend/README.md) - Documentación de la UI

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autores

**Juan Buitrago**
- GitHub: [@Juan-buitrago24](https://github.com/Juan-buitrago24)

**Kevin Coy**
- GitHub: [@Kcoy730](https://github.com/Kcoy730)
---

## ⭐ Agradecimientos

- React + Vite por el increíble setup inicial
- Tailwind CSS por el framework de estilos
- Prisma por el excelente ORM
- Lucide por los iconos modernos

---

**¡Sistema de Autenticación Completo!** 🎉

*Desarrollado con ❤️ para la gestión eficiente de parqueaderos*
