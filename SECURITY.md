# 🔐 Análisis de Seguridad - System Parking

## 📋 Resumen Ejecutivo

Este documento analiza las vulnerabilidades actuales del sistema de autenticación y proporciona soluciones prácticas para fortalecer la seguridad.

**Estado Actual**: ⚠️ Funcional pero vulnerable a varios ataques comunes  
**Recomendación**: Implementar las mejoras de seguridad antes de producción

---

## ⚠️ Vulnerabilidades Identificadas

### 1. **Falta de Rate Limiting (Crítico)**

**Vulnerabilidad:**
```javascript
// authController.js - login
export const login = async (req, res) => {
  // NO HAY LÍMITE DE INTENTOS
  const { email, password } = req.body;
  // ...
}
```

**Ataque Posible:**
- **Brute Force**: Un atacante puede intentar miles de contraseñas
- **Credential Stuffing**: Probar credenciales filtradas masivamente
- **DDoS**: Saturar el servidor con peticiones

**Demostración de Ataque:**
```bash
# Script para brute force (ejemplo educativo)
for i in {1..10000}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@parking.com","password":"password'$i'"}'
done
```

**Solución:**
```javascript
// Instalar: npm install express-rate-limit
import rateLimit from 'express-rate-limit';

// Crear limitador para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: {
    success: false,
    message: 'Demasiados intentos de login. Intenta en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Usar IP + email para limitar
  keyGenerator: (req) => {
    return `${req.ip}-${req.body.email || 'unknown'}`;
  }
});

// Aplicar en la ruta
app.post('/api/auth/login', loginLimiter, login);
```

---

### 2. **Sin Protección contra Account Enumeration (Alto)**

**Vulnerabilidad:**
```javascript
// login devuelve mensajes diferentes
if (!user) {
  return res.status(401).json({
    message: "Credenciales inválidas." // ✅ Genérico
  });
}

// register devuelve mensaje específico
if (existingUser) {
  return res.status(400).json({
    message: "Ya existe un usuario con este email." // ❌ Revela si existe
  });
}
```

**Ataque Posible:**
Un atacante puede descubrir qué emails están registrados:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@parking.com","password":"test123"}'

# Respuesta: "Ya existe un usuario con este email"
# ¡El atacante sabe que admin@parking.com existe!
```

**Solución:**
```javascript
// register - Mensaje genérico
if (existingUser) {
  // No revelar que el email ya existe
  return res.status(200).json({
    success: true,
    message: "Si el email es válido, recibirás un enlace de verificación."
  });
}

// Opcional: Enviar email diciendo que la cuenta ya existe
await sendMail(
  email,
  "Intento de registro",
  "Tu cuenta ya existe. Si olvidaste tu contraseña, usa recuperación."
);
```

---

### 3. **JWT Secret Débil y Hardcodeado (Crítico)**

**Vulnerabilidad:**
```javascript
// generateToken.js
const secret = process.env.JWT_SECRET || "your-secret-key-change-in-production";
// ❌ Si no hay .env, usa un secret predecible
```

**Ataque Posible:**
- Si el secret es conocido, se pueden forjar tokens JWT
- Atacante puede crear tokens de admin sin credenciales

**Demostración:**
```javascript
// Atacante puede crear tokens falsos
const jwt = require('jsonwebtoken');
const fakeToken = jwt.sign(
  { id: 1, email: 'admin@parking.com', role: 'ADMIN' },
  'your-secret-key-change-in-production', // Secret por defecto
  { expiresIn: '7d' }
);
// ¡Token válido sin necesidad de login!
```

**Solución:**
```javascript
// generateToken.js - Forzar JWT_SECRET
export const generateJWT = (userId, email, role) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
  
  return jwt.sign(
    { id: userId, email, role },
    secret,
    { 
      expiresIn: '7d',
      issuer: 'system-parking',
      audience: 'system-parking-users'
    }
  );
};

// Validar en startup
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET no configurado o muy corto');
  process.exit(1);
}
```

**Generar Secret Seguro:**
```bash
# En terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### 4. **Sin Protección CSRF (Medio)**

**Vulnerabilidad:**
```javascript
// server.js
app.use(cors()); // ❌ Acepta peticiones de cualquier origen
```

**Ataque Posible:**
Un sitio malicioso puede hacer peticiones en nombre del usuario:
```html
<!-- Sitio malicioso: evil.com -->
<script>
  // Si el usuario tiene sesión activa, esto funciona
  fetch('http://localhost:3000/api/vehicles/entry', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + stolenToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      plate: 'ABC123',
      vehicleType: 'CARRO'
    })
  });
</script>
```

**Solución:**
```javascript
// server.js - CORS restringido
import cors from 'cors';

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Tokens CSRF (opcional pero recomendado)
import csrf from 'csurf';
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
```

---

### 5. **Sin Validación de Input Robusta (Alto)**

**Vulnerabilidad:**
```javascript
// login - No valida formato de email
const { email, password } = req.body;
// ❌ Acepta cualquier string
```

**Ataque Posible:**
- **SQL Injection** (mitigado por Prisma ORM)
- **NoSQL Injection**
- **XSS si se refleja input**

**Solución:**
```javascript
// Instalar: npm install express-validator
import { body, validationResult } from 'express-validator';

// Validadores
export const loginValidation = [
  body('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail()
    .isLength({ max: 255 })
    .trim(),
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Contraseña debe tener 6-100 caracteres')
];

// Middleware para verificar
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Usar en ruta
router.post('/login', loginValidation, validate, login);
```

---

### 6. **Tokens de Verificación Predecibles (Medio)**

**Vulnerabilidad:**
```javascript
// generateToken.js
export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
// ✅ Esto está bien, pero sin expiración de segundos
```

**Ataque Posible:**
- Tokens de verificación válidos por 24 horas
- Si se filtra un token, hay mucho tiempo para usarlo

**Solución:**
```javascript
// Reducir tiempo de validez
const verificationExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora

// Agregar límite de usos
await prisma.user.create({
  data: {
    // ...
    verificationToken,
    verificationExpires,
    verificationAttempts: 0 // Nuevo campo
  }
});

// En verifyAccount
if (user.verificationAttempts >= 3) {
  return res.status(400).json({
    message: 'Token inválido. Solicita uno nuevo.'
  });
}
```

---

### 7. **Sin Logging de Seguridad (Medio)**

**Vulnerabilidad:**
```javascript
// No hay registro de intentos fallidos
if (!isPasswordValid) {
  return res.status(401).json({ message: "Credenciales inválidas." });
  // ❌ No se registra quién intentó acceder
}
```

**Ataque Posible:**
- No se detectan ataques en curso
- No hay auditoría de seguridad

**Solución:**
```javascript
// Instalar: npm install winston
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' })
  ]
});

// En login fallido
if (!isPasswordValid) {
  logger.warn('Login fallido', {
    email: email,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date()
  });
  
  return res.status(401).json({ message: "Credenciales inválidas." });
}
```

---

### 8. **Sin Protección contra XSS (Medio)**

**Vulnerabilidad:**
```javascript
// Si se guarda input sin sanitizar
firstName: firstName.trim(), // ❌ Solo trim, no sanitiza
```

**Ataque Posible:**
```javascript
// Registro con payload XSS
{
  "firstName": "<script>alert('XSS')</script>",
  "email": "test@test.com"
}
```

**Solución:**
```javascript
// Instalar: npm install xss helmet
import helmet from 'helmet';
import xss from 'xss';

// Helmet para headers de seguridad
app.use(helmet());

// Sanitizar inputs
import { sanitizeInput } from '../utils/sanitize.js';

// utils/sanitize.js
export const sanitizeInput = (input) => {
  return xss(input.trim(), {
    whiteList: {}, // No permitir HTML
    stripIgnoreTag: true
  });
};

// En controller
firstName: sanitizeInput(firstName),
```

---

## ✅ Plan de Implementación

### Prioridad 1 (Crítico - Implementar YA)
1. ✅ Rate limiting en login/register
2. ✅ Validar JWT_SECRET en startup
3. ✅ CORS restrictivo
4. ✅ Validación de inputs con express-validator

### Prioridad 2 (Alto - Antes de producción)
5. ✅ Helmet para headers de seguridad
6. ✅ Logging de eventos de seguridad
7. ✅ Account enumeration protection
8. ✅ Sanitización XSS

### Prioridad 3 (Medio - Mejoras futuras)
9. ✅ Tokens con menor tiempo de vida
10. ✅ 2FA (autenticación de dos factores)
11. ✅ Captcha en login después de X intentos
12. ✅ Session management mejorado

---

## 📦 Paquetes de Seguridad Recomendados

```json
{
  "dependencies": {
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "xss": "^1.0.14",
    "winston": "^3.11.0",
    "bcrypt": "^5.1.1"
  }
}
```

---

## 🔨 Código de Ejemplo Completo

### security.js (Nuevo archivo)
```javascript
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body } from 'express-validator';

// Rate limiters
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Muchos intentos. Espera 15 min.' },
  standardHeaders: true,
  legacyHeaders: false
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 registros por hora por IP
  message: { success: false, message: 'Límite de registros alcanzado.' }
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 peticiones cada 15 min
  message: { success: false, message: 'Demasiadas peticiones.' }
});

// Helmet config
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Validaciones
export const loginValidation = [
  body('email').isEmail().normalizeEmail().trim(),
  body('password').isLength({ min: 6, max: 100 })
];

export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Contraseña debe tener mayúsculas, minúsculas y números'),
  body('firstName').trim().isLength({ min: 2, max: 50 }),
  body('lastName').trim().isLength({ min: 2, max: 50 })
];
```

### server.js (Actualizado)
```javascript
import { helmetConfig, apiLimiter } from './middleware/security.js';

// Seguridad
app.use(helmetConfig);
app.use('/api/', apiLimiter);

// CORS restringido
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### authRoutes.js (Actualizado)
```javascript
import { loginLimiter, registerLimiter, loginValidation } from '../middleware/security.js';

router.post('/login', loginLimiter, loginValidation, validate, login);
router.post('/register', registerLimiter, registerValidation, validate, register);
```

---

## 🧪 Testing de Seguridad

### Test con herramientas
```bash
# Rate limiting
npm install -g autocannon
autocannon -c 10 -d 10 http://localhost:3000/api/auth/login

# OWASP ZAP (escáner de vulnerabilidades)
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000

# Nikto (escáner web)
nikto -h http://localhost:3000
```

---

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

---

## ⚠️ Disclaimer

Este documento es con fines educativos. **NO intentes estos ataques en sistemas de producción que no te pertenezcan.** Hacerlo es ilegal.

---

**Estado Final Esperado**: 🔒 Sistema fortificado y listo para producción
