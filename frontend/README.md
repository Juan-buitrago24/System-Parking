# Frontend - System Parking 🚗# React + Vite



Aplicación web moderna para la gestión de parqueaderos con React + Vite.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🚀 TecnologíasCurrently, two official plugins are available:



- **React 18** - Biblioteca de UI- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

- **Vite** - Build tool y dev server- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **React Router v6** - Enrutamiento

- **Axios** - Cliente HTTP## React Compiler

- **Tailwind CSS** - Framework de estilos

- **Lucide React** - Iconos modernosThe React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- **Context API** - Gestión de estado

## Expanding the ESLint configuration

## 📋 Configuración Inicial

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con la URL de tu API:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Ejecutar la aplicación

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── main.jsx                    # Punto de entrada
│   ├── App.jsx                     # Componente principal con rutas
│   ├── index.css                   # Estilos globales con Tailwind
│   ├── components/
│   │   ├── common/                 # Componentes reutilizables
│   │   │   ├── Button.jsx          # Botón con variantes
│   │   │   ├── Input.jsx           # Input con validación
│   │   │   ├── Alert.jsx           # Alertas con tipos
│   │   │   └── Spinner.jsx         # Loading spinner
│   │   └── layout/
│   │       ├── Navbar.jsx          # Barra de navegación
│   │       └── PrivateRoute.jsx    # Protección de rutas
│   ├── pages/
│   │   ├── Login.jsx               # Página de login
│   │   ├── Register.jsx            # Página de registro
│   │   ├── ForgotPassword.jsx      # Solicitar reset
│   │   ├── ResetPassword.jsx       # Restablecer password
│   │   ├── VerifyAccount.jsx       # Verificar cuenta
│   │   ├── Profile.jsx             # Perfil de usuario
│   │   └── Dashboard.jsx           # Panel principal
│   ├── context/
│   │   └── AuthContext.jsx         # Context de autenticación
│   ├── services/
│   │   └── authService.js          # Servicios de API
│   └── assets/                     # Imágenes y recursos
├── public/                         # Archivos estáticos
├── tailwind.config.js              # Configuración de Tailwind
├── postcss.config.js               # Configuración de PostCSS
├── vite.config.js                  # Configuración de Vite
└── package.json
```

## 🎨 Diseño y Estilos

### Tailwind CSS

El proyecto usa Tailwind CSS con una configuración personalizada:

- **Colores primarios**: Azules (primary-*)
- **Colores secundarios**: Púrpuras (secondary-*)
- **Efectos glassmorphism**: `.glass` y `.glass-dark`
- **Animaciones personalizadas**: `fade-in`, `slide-up`, `slide-down`
- **Gradientes**: `bg-gradient-primary`, `bg-gradient-secondary`

### Componentes Reutilizables

#### Button
```jsx
<Button 
  variant="primary"    // primary, secondary, outline, ghost, danger
  size="lg"            // sm, md, lg
  isLoading={false}
  icon={IconComponent}
>
  Texto del botón
</Button>
```

#### Input
```jsx
<Input
  label="Email"
  type="email"
  icon={Mail}
  error={errors.email}
  required
/>
```

#### Alert
```jsx
<Alert
  type="success"       // success, error, warning, info
  title="Título"
  message="Mensaje o array de mensajes"
  onClose={() => {}}
/>
```

## 🔐 Sistema de Autenticación

### Rutas Públicas

- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/forgot-password` - Recuperar contraseña
- `/reset-password/:token` - Restablecer contraseña
- `/verify-account/:token` - Verificar cuenta

### Rutas Protegidas

- `/dashboard` - Panel principal
- `/profile` - Perfil de usuario

### Context de Autenticación

```jsx
import { useAuth } from './context/AuthContext';

function Component() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Usar el contexto...
}
```

## 📡 Servicios de API

Todos los servicios están en `src/services/authService.js`:

- `register(userData)` - Registrar usuario
- `login(credentials)` - Iniciar sesión
- `verifyAccount(token)` - Verificar cuenta
- `forgotPassword(email)` - Solicitar reset
- `resetPassword(token, passwords)` - Restablecer
- `getProfile()` - Obtener perfil
- `updateProfile(data)` - Actualizar perfil
- `changePassword(passwords)` - Cambiar contraseña
- `logout()` - Cerrar sesión

## 🎯 Features Implementadas

### Sprint 1 - Autenticación ✅

- ✅ Login con validación
- ✅ Registro de usuarios
- ✅ Verificación de cuenta por email
- ✅ Recuperación de contraseña
- ✅ Actualización de perfil
- ✅ Cambio de contraseña
- ✅ Cierre de sesión
- ✅ Protección de rutas privadas
- ✅ Manejo de sesiones con JWT
- ✅ Diseño responsive y moderno
- ✅ Animaciones suaves
- ✅ Validación de formularios
- ✅ Manejo de errores

## 🎨 Características de Diseño

- **Diseño responsive**: Mobile-first approach
- **Glassmorphism**: Efectos de cristal modernos
- **Gradientes**: Colores vibrantes y atractivos
- **Animaciones**: Transiciones suaves y profesionales
- **Iconos**: Lucide React para iconografía moderna
- **Feedback visual**: Alertas, spinners y estados de carga
- **Accesibilidad**: Etiquetas y roles ARIA

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview del build
npm run preview
```

## 📝 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| VITE_API_URL | URL base de la API | http://localhost:3000/api |

---

**Desarrollado con ❤️ para System Parking** 🚗
