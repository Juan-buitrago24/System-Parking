# Backend - System Parking 🚗

API RESTful para el sistema de gestión de parqueaderos con autenticación completa.

## 🚀 Tecnologías

- **Node.js** + **Express** - Framework del servidor
- **Prisma ORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación con tokens
- **Bcrypt** - Hash de contraseñas
- **Resend** - Envío de emails profesional

## 📋 Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/parking_db"
JWT_SECRET="tu-clave-secreta-super-segura"
RESEND_API_KEY="re_tu_api_key_aqui"
RESEND_FROM_EMAIL="System Parking <onboarding@resend.dev>"
FRONTEND_URL="http://localhost:5173"
PORT=3000
```

**Configuración de Resend:**
1. Ve a [https://resend.com](https://resend.com) y crea una cuenta
2. Obtén tu API Key en [https://resend.com/api-keys](https://resend.com/api-keys)
3. Copia la API Key y pégala en `RESEND_API_KEY`
4. Para pruebas puedes usar `onboarding@resend.dev`
5. Para producción, verifica tu dominio en Resend y usa tu email

### 3. Configurar la base de datos

```bash
# Crear la base de datos y ejecutar migraciones
npx prisma migrate dev --name init

# Generar el cliente de Prisma
npx prisma generate
```

### 4. Ejecutar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará corriendo en `http://localhost:3000`

## 📚 API Endpoints

### Autenticación

#### Registro de usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "3001234567",
  "role": "EMPLOYEE"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

#### Verificar cuenta
```http
GET /api/auth/verify/:token
```

#### Solicitar recuperación de contraseña
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "usuario@example.com"
}
```

#### Restablecer contraseña
```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "nuevaContraseña123",
  "confirmPassword": "nuevaContraseña123"
}
```

### Perfil de Usuario (Rutas protegidas)

**Nota:** Todas estas rutas requieren el header de autorización:
```
Authorization: Bearer {token}
```

#### Obtener perfil
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Actualizar perfil
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "phone": "3009876543"
}
```

#### Cambiar contraseña
```http
PUT /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "contraseñaActual",
  "newPassword": "nuevaContraseña123"
}
```

#### Cerrar sesión
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

## 🗄️ Modelo de Datos

### User

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int | ID único (autoincremental) |
| email | String | Email único del usuario |
| password | String | Contraseña hasheada |
| firstName | String | Nombre del usuario |
| lastName | String | Apellido del usuario |
| phone | String? | Teléfono (opcional) |
| role | Enum | ADMIN o EMPLOYEE |
| isVerified | Boolean | Cuenta verificada |
| verificationToken | String? | Token de verificación |
| verificationExpires | DateTime? | Expiración del token |
| resetPasswordToken | String? | Token de reset |
| resetPasswordExpires | DateTime? | Expiración del reset |
| createdAt | DateTime | Fecha de creación |
| updatedAt | DateTime | Última actualización |
| lastLogin | DateTime? | Último login |

## 🔧 Scripts disponibles

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Migraciones de Prisma
npm run prisma:migrate

# Generar cliente de Prisma
npm run prisma:generate

# Abrir Prisma Studio (GUI de base de datos)
npm run prisma:studio

# Ejecutar seed (si existe)
npm run seed
```

## 📁 Estructura del proyecto

```
backend/
├── src/
│   ├── server.js              # Servidor principal
│   ├── config/
│   │   ├── db.js             # Configuración de base de datos
│   │   └── mailer.js         # Configuración de emails
│   ├── controllers/
│   │   └── authController.js # Lógica de autenticación
│   ├── routes/
│   │   └── authRoutes.js     # Rutas de autenticación
│   ├── middleware/
│   │   ├── authMiddleware.js # Protección de rutas
│   │   └── validationMiddleware.js # Validaciones
│   └── utils/
│       ├── generateToken.js   # Generación de tokens
│       └── emailTemplates.js  # Plantillas de email
├── prisma/
│   └── schema.prisma          # Schema de base de datos
├── .env.example               # Ejemplo de variables
└── package.json
```

## ✅ Features implementadas

- ✅ Registro de usuarios con validación
- ✅ Verificación de cuenta por email
- ✅ Login con JWT
- ✅ Recuperación de contraseña
- ✅ Actualización de perfil
- ✅ Cambio de contraseña
- ✅ Middleware de autenticación
- ✅ Validación de datos
- ✅ Emails HTML responsive
- ✅ Manejo de errores

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- Tokens JWT con expiración de 7 días
- Tokens de verificación con expiración de 24h
- Tokens de reset con expiración de 1h
- Validación de datos en el servidor
- Headers CORS configurados

## 🐛 Troubleshooting

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en el archivo `.env`
- Asegúrate de que la base de datos existe

### Error al enviar emails
- Verifica que `RESEND_API_KEY` esté configurada en `.env`
- Asegúrate de que la API Key sea válida (comienza con `re_`)
- Verifica que `RESEND_FROM_EMAIL` esté configurado correctamente
- Para pruebas usa `onboarding@resend.dev`
- Para producción verifica tu dominio en Resend

### Error "JWT secret not defined"
- Asegúrate de tener `JWT_SECRET` en tu archivo `.env`

## 📝 Notas

- En desarrollo, el servidor corre en `http://localhost:3000`
- Para producción, configura las variables de entorno apropiadas
- Los tokens JWT expiran en 7 días
- Los emails usan plantillas HTML responsive

---

**Desarrollado para System Parking** 🚗
