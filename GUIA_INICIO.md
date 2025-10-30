# 🚀 Guía Rápida de Inicio - System Parking

## ✅ Sprint 1 Completado: Sistema de Autenticación

### 📋 Funcionalidades Implementadas

1. ✅ **Login de usuario** - Autenticación con JWT
2. ✅ **Registro de cuenta** - Con validación de datos
3. ✅ **Verificación de cuenta** - Por correo electrónico
4. ✅ **Recuperación de contraseña** - Sistema de reset por email
5. ✅ **Actualización de datos** - Perfil de usuario completo
6. ✅ **Cambio de contraseña** - Con validación
7. ✅ **Cierre de sesión** - Limpieza de sesión
8. ✅ **Diseño moderno y responsive** - Con Tailwind CSS

---

## 🔧 Configuración del Proyecto

### Paso 1: Backend

```powershell
# 1. Ir a la carpeta backend
cd backend

# 2. Copiar archivo de variables de entorno
Copy-Item .env.example .env

# 3. Editar el archivo .env con tus credenciales
notepad .env

# Configurar:
# - DATABASE_URL: Tu conexión a PostgreSQL
# - JWT_SECRET: Una clave secreta segura
# - RESEND_API_KEY: Tu API Key de Resend (desde https://resend.com/api-keys)
# - RESEND_FROM_EMAIL: Email de envío (usa onboarding@resend.dev para pruebas)
# - FRONTEND_URL: http://localhost:5173

# 4. Instalar dependencias (si no están instaladas)
npm install

# 5. Generar cliente de Prisma
npx prisma generate

# 6. Crear la base de datos y ejecutar migraciones
npx prisma migrate dev --name init

# 7. (Opcional) Abrir Prisma Studio para ver la base de datos
npx prisma studio
```

### Paso 2: Frontend

```powershell
# 1. Abrir NUEVA terminal y ir a la carpeta frontend
cd frontend

# 2. Copiar archivo de variables de entorno
Copy-Item .env.example .env

# Editar .env:
# VITE_API_URL=http://localhost:3000/api

# 3. Instalar dependencias (si no están instaladas)
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

---

## 🚀 Ejecutar el Proyecto

### Terminal 1 - Backend
```powershell
cd backend
npm run dev
```
✅ Backend corriendo en: http://localhost:3000

### Terminal 2 - Frontend
```powershell
cd frontend
npm run dev
```
✅ Frontend corriendo en: http://localhost:5173

---

## 📧 Configuración de Email (Resend)

Para que funcione el envío de correos:

### Paso 1: Crear cuenta en Resend
1. Ve a [https://resend.com](https://resend.com) y crea una cuenta gratuita
2. Confirma tu email

### Paso 2: Obtener API Key
1. Ve a [API Keys](https://resend.com/api-keys)
2. Haz clic en "Create API Key"
3. Dale un nombre (ej: "System Parking Development")
4. Copia la API Key (comienza con `re_`)
5. Pégala en `backend/.env` como `RESEND_API_KEY`

### Paso 3: Configurar email de envío
- **Para pruebas**: Usa `onboarding@resend.dev` (ya incluido en el .env)
- **Para producción**: 
  1. Ve a [Domains](https://resend.com/domains)
  2. Agrega tu dominio
  3. Configura los registros DNS
  4. Usa tu email verificado (ej: `no-reply@tudominio.com`)

**Ventajas de Resend:**
- ✅ Sin necesidad de contraseñas de aplicación
- ✅ Más confiable que Gmail
- ✅ 100 emails gratis al día
- ✅ Mejor deliverability
- ✅ Dashboard con estadísticas

---

## 🗄️ Base de Datos

### Crear la base de datos en PostgreSQL

```sql
CREATE DATABASE parking_db;
```

O si prefieres usar Prisma para crear todo:

```powershell
cd backend
npx prisma migrate dev --name init
```

Esto creará:
- ✅ La base de datos
- ✅ La tabla `users` con todos los campos
- ✅ Los índices y relaciones

---

## 🧪 Probar el Sistema

### 1. Registrar un usuario
- Abre http://localhost:5173/register
- Completa el formulario
- Recibirás un email de verificación

### 2. Verificar cuenta
- Revisa tu email
- Haz clic en el enlace de verificación
- O usa el token en: http://localhost:5173/verify-account/TOKEN

### 3. Iniciar sesión
- Ve a http://localhost:5173/login
- Ingresa email y contraseña
- Serás redirigido al dashboard

### 4. Explorar funcionalidades
- **Dashboard**: Vista general del sistema
- **Perfil**: Actualiza tus datos personales
- **Cambiar contraseña**: Desde el perfil
- **Cerrar sesión**: Desde el navbar

---

## 📁 Estructura del Proyecto

```
System-Parking/
├── backend/                    # API REST con Node.js
│   ├── src/
│   │   ├── server.js          # Servidor principal
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── routes/            # Rutas de la API
│   │   ├── middleware/        # Autenticación y validación
│   │   ├── utils/             # Utilidades y helpers
│   │   └── config/            # Configuración
│   ├── prisma/
│   │   └── schema.prisma      # Modelo de base de datos
│   ├── .env                   # Variables de entorno
│   └── package.json
│
└── frontend/                   # Aplicación React
    ├── src/
    │   ├── App.jsx            # Rutas principales
    │   ├── components/        # Componentes reutilizables
    │   ├── pages/             # Páginas de la aplicación
    │   ├── context/           # Context API
    │   ├── services/          # Servicios de API
    │   └── assets/            # Recursos estáticos
    ├── .env                   # Variables de entorno
    └── package.json
```

---

## 🎨 Tecnologías Utilizadas

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT (autenticación)
- Bcrypt (hash de contraseñas)
- Nodemailer (emails)

### Frontend
- React 18
- Vite
- React Router v6
- Axios
- Tailwind CSS
- Lucide React (iconos)
- Context API

---

## 📊 Endpoints de la API

### Autenticación (Públicos)
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify/:token` - Verificar cuenta
- `POST /api/auth/forgot-password` - Solicitar reset
- `POST /api/auth/reset-password/:token` - Restablecer contraseña

### Perfil (Protegidos - Requieren token)
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña
- `POST /api/auth/logout` - Cerrar sesión

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to PostgreSQL"
- Verifica que PostgreSQL esté corriendo
- Revisa el `DATABASE_URL` en `backend/.env`
- Asegúrate de que la base de datos existe

### Error: "Cannot send email"
- Verifica que `RESEND_API_KEY` esté en `.env` y sea válida
- Asegúrate de que la API Key comience con `re_`
- Verifica que `RESEND_FROM_EMAIL` esté configurado
- Para pruebas, usa `onboarding@resend.dev`
- Revisa el dashboard de Resend para ver los logs: https://resend.com/emails

### Error: "Cannot connect to API"
- Verifica que el backend esté corriendo en puerto 3000
- Revisa `VITE_API_URL` en `frontend/.env`
- Verifica CORS en el backend

### Estilos de Tailwind no aparecen
- Ejecuta `npm install` en frontend
- Verifica que `tailwind.config.js` existe
- Reinicia el servidor de desarrollo

---

## 📚 Documentación Adicional

- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`
- **Prisma Docs**: https://www.prisma.io/docs
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 🎯 Próximos Pasos

### Sprint 2: Gestión de Vehículos
- Registro de entrada/salida
- Búsqueda de vehículos
- Historial de vehículos

### Sprint 3: Control de Espacios
- Mapa del parqueadero
- Asignación automática
- Estado en tiempo real

### Sprint 4: Facturación
- Cálculo de tarifas
- Generación de recibos
- Historial de pagos

### Sprint 5: Reportes
- Ingresos diarios/mensuales
- Estadísticas de ocupación
- Exportación de datos

---

## 👥 Roles de Usuario

- **ADMIN**: Acceso completo al sistema
- **EMPLOYEE**: Acceso a operaciones diarias

---

## ✨ Características del Diseño

- 🎨 Diseño moderno con glassmorphism
- 📱 Totalmente responsive
- ⚡ Animaciones suaves
- 🔔 Notificaciones visuales
- 🎯 Validación en tiempo real
- 🔒 Rutas protegidas
- 💫 Transiciones elegantes

---

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa esta documentación
2. Verifica los archivos README en backend y frontend
3. Revisa los logs de la consola
4. Verifica las variables de entorno

---

**¡Sistema de Autenticación Completo y Funcional!** 🎉

Desarrollado para **System Parking** 🚗
