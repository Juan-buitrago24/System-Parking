# System Parking 🚗

Sistema completo de administración de parqueaderos con autenticación, gestión de vehículos, control de espacios, facturación automática y reportes de ingresos. Plataforma full-stack desarrollada con Node.js/Express/PostgreSQL en el backend y React/Vite/Tailwind en el frontend.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)
![ORM](https://img.shields.io/badge/ORM-Prisma-informational)
![Deploy](https://img.shields.io/badge/Deploy-Render%20%2B%20Vercel-blueviolet)

---

## 🌐 Demo en Vivo

- **Frontend**: [system-parking.vercel.app](https://system-parking.vercel.app)
- **API**: [system-parking-api.onrender.com](https://system-parking-api.onrender.com)

**Credenciales de prueba:**
- Admin: `admin@parking.com` / `Admin123!`

---

## 🎯 Descripción

Sistema de gestión integral de parqueaderos que permite:
- 🔐 Autenticación completa de usuarios
- 🚘 Registro de entrada/salida de vehículos
- 🅿️ Control visual de espacios de parqueo
- 💰 Facturación automática con múltiples tarifas
- 📊 Reportes detallados de ingresos y operaciones
- 📤 Exportación de datos a CSV

---

## ✨ Funcionalidades por Sprint

### Sprint 1 - Sistema de Autenticación ✅
- ✅ Login con JWT y roles (ADMIN/EMPLOYEE)
- ✅ Registro con validación en tiempo real
- ✅ Verificación de cuenta por email
- ✅ Recuperación y reset de contraseña
- ✅ Gestión de perfil y cambio de contraseña
- ✅ Protección de rutas con middleware

### Sprint 2 - Gestión de Vehículos ✅
- ✅ Registro de entrada con datos del propietario
- ✅ Registro de salida con cálculo de duración
- ✅ Lista de vehículos activos en tiempo real
- ✅ Búsqueda de vehículos por placa
- ✅ Historial completo de entradas/salidas
- ✅ Dashboard con estadísticas

### Sprint 3 - Control de Espacios ✅
- ✅ Gestión visual de espacios (grid interactivo)
- ✅ Tipos de espacio (COMPACT, LARGE, HANDICAPPED)
- ✅ Estados (DISPONIBLE, OCUPADO, MANTENIMIENTO)
- ✅ Asignación automática de espacios
- ✅ Asignación manual con validaciones
- ✅ Liberación de espacios

### Sprint 4 - Sistema de Facturación ✅
- ✅ Múltiples tipos de tarifa (POR_HORA, POR_DIA, FRACCION, MENSUAL)
- ✅ Cálculo automático según duración
- ✅ Selección inteligente de mejor tarifa
- ✅ Descuentos (porcentaje o monto fijo)
- ✅ Métodos de pago (EFECTIVO, TARJETA, TRANSFERENCIA)
- ✅ Generación automática de recibos
- ✅ Gestión de tarifas (solo admin)
- ✅ Procesamiento de reembolsos

### Sprint 5 - Reportes y Analytics ✅
- ✅ Resumen general (ingresos, ticket promedio)
- ✅ Ingresos diarios con filtros de fecha
- ✅ Análisis por tipo de vehículo
- ✅ Análisis por método de pago
- ✅ Top 10 vehículos más frecuentes
- ✅ Exportación de reportes a CSV
- ✅ Filtros personalizables

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
# Editar .env con tus credenciales de PostgreSQL y Gmail
npx prisma generate
npx prisma migrate dev
npx prisma db seed  # Crea espacios y tarifas iniciales
node scripts/createAdmin.js  # Crea usuario administrador
npm run dev
```

**Credenciales por defecto:**
```
Email:    admin@parking.com
Password: Admin123!
Rol:      ADMIN
```
⚠️ **Cambia la contraseña después del primer login**

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

### Autenticación

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Registrar nuevo usuario | Público |
| POST | `/api/auth/login` | Iniciar sesión | Público |
| GET | `/api/auth/verify/:token` | Verificar cuenta | Público |
| POST | `/api/auth/forgot-password` | Solicitar reset | Público |
| POST | `/api/auth/reset-password/:token` | Restablecer contraseña | Público |
| GET | `/api/auth/profile` | Obtener perfil | Privado |
| PUT | `/api/auth/profile` | Actualizar perfil | Privado |
| PUT | `/api/auth/change-password` | Cambiar contraseña | Privado |
| POST | `/api/auth/logout` | Cerrar sesión | Privado |

### Vehículos

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/api/vehicles/entry` | Registrar entrada | Privado |
| POST | `/api/vehicles/exit` | Registrar salida | Privado |
| GET | `/api/vehicles/active` | Listar vehículos activos | Privado |
| GET | `/api/vehicles/search/:plate` | Buscar por placa | Privado |
| GET | `/api/vehicles/history` | Historial completo | Privado |
| GET | `/api/vehicles/stats` | Estadísticas | Privado |

### Espacios de Parqueo

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/parking-spaces` | Listar todos los espacios | Privado |
| GET | `/api/parking-spaces/:id` | Obtener espacio por ID | Privado |
| POST | `/api/parking-spaces` | Crear espacio | Privado |
| PUT | `/api/parking-spaces/:id` | Actualizar espacio | Privado |
| DELETE | `/api/parking-spaces/:id` | Eliminar espacio | Privado |
| POST | `/api/parking-spaces/auto-assign` | Asignar automáticamente | Privado |
| POST | `/api/parking-spaces/assign` | Asignar manualmente | Privado |
| POST | `/api/parking-spaces/release/:id` | Liberar espacio | Privado |

### Tarifas

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/rates` | Listar todas las tarifas | Privado |
| GET | `/api/rates/:id` | Obtener tarifa por ID | Privado |
| GET | `/api/rates/active/:vehicleType` | Tarifas activas por tipo | Privado |
| POST | `/api/rates` | Crear tarifa | Admin |
| PUT | `/api/rates/:id` | Actualizar tarifa | Admin |
| DELETE | `/api/rates/:id` | Desactivar tarifa | Admin |

### Pagos

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/api/payments/calculate` | Calcular monto | Privado |
| POST | `/api/payments` | Registrar pago y salida | Privado |
| GET | `/api/payments` | Listar pagos | Privado |
| GET | `/api/payments/:id` | Obtener pago por ID | Privado |
| POST | `/api/payments/:id/refund` | Procesar reembolso | Admin |
| GET | `/api/payments/stats/summary` | Estadísticas de pagos | Privado |

### Reportes

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/reports/daily-income` | Ingresos diarios | Privado |
| GET | `/api/reports/by-vehicle-type` | Por tipo de vehículo | Privado |
| GET | `/api/reports/by-payment-method` | Por método de pago | Privado |
| GET | `/api/reports/summary` | Resumen general | Privado |
| GET | `/api/reports/payments-list` | Lista para exportar | Privado |
| GET | `/api/reports/top-vehicles` | Top 10 frecuentes | Privado |

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
- ✅ Login, Registro, Verificación por email
- ✅ Recuperación de contraseña con tokens
- ✅ Gestión de perfil y cambio de contraseña
- ✅ Roles de usuario (ADMIN, EMPLOYEE)

### ✅ Sprint 2: Gestión de Vehículos (Completado)
- ✅ Registro de entrada con placa y tipo
- ✅ Registro de salida con cálculo automático
- ✅ Búsqueda y filtrado de vehículos
- ✅ Historial completo con estadísticas
- ✅ Validación de placas duplicadas

### ✅ Sprint 3: Control de Espacios (Completado)
- ✅ CRUD completo de espacios de parqueo
- ✅ Asignación automática por tipo de vehículo
- ✅ Estado en tiempo real (DISPONIBLE, OCUPADO, MANTENIMIENTO)
- ✅ Gestión de capacidad y disponibilidad
- ✅ Dashboard con métricas de ocupación

### ✅ Sprint 4: Facturación (Completado)
- ✅ Sistema de tarifas por tipo de vehículo
- ✅ Tarifas por hora, día, mes
- ✅ Cálculo automático con descuentos
- ✅ Generación de recibos únicos
- ✅ Registro de pagos (EFECTIVO, TARJETA, QR)
- ✅ Sistema de reembolsos (solo ADMIN)
- ✅ Historial completo de transacciones

### ✅ Sprint 5: Reportes y Análisis (Completado)
- ✅ Reporte de ingresos diarios con gráficos
- ✅ Análisis por tipo de vehículo
- ✅ Análisis por método de pago
- ✅ Dashboard de métricas generales
- ✅ Top 10 vehículos más frecuentes
- ✅ Exportación de datos a CSV
- ✅ Filtros por rango de fechas

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

### Error de Conexión a Base de Datos
**Problema:** `Error: Can't reach database server`
```bash
# Solución: Verificar que PostgreSQL esté corriendo
# Windows: Servicios > PostgreSQL
# Verificar DATABASE_URL en .env
```

### Error: "No rates found for vehicle type"
**Problema:** No hay tarifas configuradas
```bash
# Solución: Ejecutar el seed de tarifas
cd backend
npm run seed
```

### Puerto en Uso
**Problema:** `Error: listen EADDRINUSE: address already in use :::3000`
```bash
# Solución: Cambiar el puerto en .env o matar el proceso
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Error en Migraciones de Prisma
**Problema:** Cambios en el schema no se reflejan
```bash
# Solución: Resetear y migrar de nuevo
cd backend
npx prisma migrate reset
npx prisma migrate dev --name init
npm run seed
```

### Emails No Se Envían
**Problema:** Verificación por email no llega
```bash
# Solución:
# 1. Verificar RESEND_API_KEY en .env
# 2. Verificar dominio del from_email
# 3. Revisar logs del servidor para errores de Resend
```

### Frontend No Conecta con Backend
**Problema:** Error de CORS o conexión rechazada
```bash
# Solución:
# 1. Verificar que el backend esté corriendo en puerto 3000
# 2. Verificar VITE_API_URL en frontend/.env
# 3. Verificar cors configurado en backend/src/server.js
```

---

## 👥 Roles de Usuario

- **ADMIN** - Acceso completo al sistema
- **EMPLOYEE** - Operaciones diarias del parqueadero

---

## 🚀 Deployment a Producción

### Opción 1: Despliegue Rápido

**Backend en Render + Frontend en Vercel + BD PostgreSQL**

Ver guía completa: [DEPLOYMENT.md](DEPLOYMENT.md)

**Resumen rápido:**
1. **Base de Datos**: Crear PostgreSQL en Render (Free)
2. **Backend**: Deploy en Render con auto-build
3. **Frontend**: Deploy en Vercel con un click
4. **Total**: $0/mes (plan free)

### Opción 2: Un Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

---

## 📚 Documentación

- [**Guía de Deployment**](DEPLOYMENT.md) - Paso a paso para producción ⭐
- [Guía de Inicio](GUIA_INICIO.md) - Configuración detallada local
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
