# 🔐 Cómo Ejecutar las Demos de Seguridad

## 📋 Requisitos Previos

1. **Backend corriendo:**
```powershell
cd backend
npm run dev
```

2. **Usuario admin creado:**
```powershell
cd backend
node scripts/createAdmin.js
```

---

## 🎯 Opción 1: Script PowerShell Interactivo (Recomendado)

### Ejecutar:
```powershell
cd C:\Users\jsbui\System-Parking
.\security-demo.ps1
```

### Menú disponible:
1. **Brute Force Attack** - Intentar 20 contraseñas sin bloqueo
2. **Account Enumeration** - Descubrir si un email existe
3. **Sin Validación Input** - Enviar datos inválidos
4. **Ver todas** - Ejecutar todas las demos

### Capturas esperadas:
- ✅ Todas las peticiones procesadas (sin rate limit)
- ❌ Mensajes diferentes revelan si email existe
- ⚠️ Inputs inválidos aceptados

---

## ⚡ Opción 2: Demo Rápida (30 segundos)

```powershell
.\quick-demo.ps1
```

Muestra solo el ataque de fuerza bruta con 20 intentos.

---

## 🌐 Opción 3: Thunder Client (VS Code)

1. **Instalar extensión:**
   - Buscar "Thunder Client" en VS Code
   - Instalar

2. **Importar colección:**
   - Abrir Thunder Client
   - Click en menú (⋯) → Import
   - Seleccionar: `thunder-collection-security-demo.json`

3. **Ejecutar requests:**
   - Demo 1: Click derecho → "Repeat Request" 20 veces
   - Demo 2: Comparar respuestas entre emails existentes y nuevos
   - Demo 3: Ver que acepta emails inválidos

---

## 🧪 Opción 4: Postman

1. **Importar colección:**
   - File → Import → `thunder-collection-security-demo.json`

2. **Usar Collection Runner:**
   - Collections → Security Demo
   - Click "Run"
   - Iterations: 20
   - Delay: 100ms

---

## 📝 Opción 5: cURL Manual

### Demo 1: Brute Force
```powershell
# Ejecutar varias veces manualmente
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@parking.com","password":"test1"}'

curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@parking.com","password":"test2"}'

# ... (repetir 20 veces)
```

### Demo 2: Account Enumeration
```powershell
# Email que EXISTE
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@parking.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# Respuesta: "Ya existe un usuario con este email" ❌

# Email que NO EXISTE  
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"noexiste@test.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# Respuesta diferente ✓ - Permite enumerar cuentas
```

### Demo 3: Sin Validación
```powershell
# Email inválido (debería rechazar)
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"esto-no-es-email","password":"test"}'

# XSS attempt
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"xss@test.com","password":"Test123!","firstName":"<script>alert(1)</script>","lastName":"User"}'
```

---

## 📊 Qué Observar

### ✅ Vulnerabilidades Confirmadas:
- [ ] **Brute Force**: Todas las peticiones procesadas sin límite
- [ ] **Account Enum**: Mensajes diferentes para emails existentes vs nuevos
- [ ] **Sin Validación**: Acepta emails inválidos y HTML/JS en inputs

### 🔒 Después de Implementar Soluciones:
- [ ] Rate Limiting: Bloqueo después de 5 intentos
- [ ] Mensajes genéricos: Misma respuesta siempre
- [ ] Validación: Rechaza inputs inválidos antes de procesarlos

---

## 🎥 Para Presentación

### Orden Recomendado:

1. **Introducción (2 min)**
   - Mostrar el sistema funcionando normalmente
   - Login exitoso con credenciales correctas

2. **Demo 1: Brute Force (3 min)**
   - Ejecutar `quick-demo.ps1`
   - Explicar: "Sin rate limiting, atacante puede probar miles de contraseñas"
   - Mostrar logs del servidor (todas procesadas)

3. **Demo 2: Account Enumeration (2 min)**
   - Thunder Client o Postman
   - Mostrar respuestas diferentes
   - Explicar: "Atacante puede construir lista de usuarios válidos"

4. **Demo 3: Sin Validación (2 min)**
   - Enviar email inválido
   - Enviar XSS payload
   - Explicar: "Inputs maliciosos aceptados sin validación"

5. **Soluciones (3 min)**
   - Abrir `SECURITY.md`
   - Mostrar código de soluciones
   - Explicar implementación de rate limiting y validación

**Total: ~12 minutos**

---

## 🛠️ Troubleshooting

### Error: "No se puede conectar"
```powershell
# Verificar que el backend esté corriendo
curl http://localhost:3000

# Si no funciona:
cd backend
npm run dev
```

### Error: "Execution Policy"
```powershell
# Permitir ejecución de scripts (una vez)
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force

# Luego ejecutar de nuevo
.\security-demo.ps1
```

### Ver logs del servidor
```powershell
# En otra terminal
cd backend
npm run dev

# Verás todas las peticiones entrantes
```

---

## 📚 Documentación Completa

Ver: **[SECURITY.md](./SECURITY.md)** para:
- Explicación detallada de cada vulnerabilidad
- Código completo de soluciones
- Paquetes npm necesarios
- Plan de implementación

---

## ⚠️ Advertencia

**Estos scripts son SOLO para uso educativo en tu propio sistema.**

❌ NO ejecutar en sistemas de producción  
❌ NO usar contra sistemas que no te pertenezcan  
✅ Solo para demostración y aprendizaje

Realizar estos ataques contra sistemas ajenos es **ILEGAL**.
