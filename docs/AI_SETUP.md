# 🤖 Configuración de Inteligencia Artificial - Reconocimiento de Placas

## 📋 Descripción General

El sistema de parqueadero incluye reconocimiento automático de placas vehiculares mediante IA, que permite:

- **Lectura automática** de placas con 95%+ de precisión
- **Detección de tipo de vehículo** (carro, moto, camión, camioneta)
- **Captura desde cámara** de teléfono o PC (sin hardware especial)
- **Validación automática** de pagos en salida
- **Registro fotográfico** como evidencia
- **Control de acceso inteligente** - impide salidas sin pagar

## 🚀 Opciones de Implementación

### Opción 1: PlateRecognizer API (Recomendado)

**Ventajas:**
- ✅ 95-98% de precisión en placas
- ✅ 2,500 escaneos gratis al mes
- ✅ Detecta tipo de vehículo (carro, moto, camión)
- ✅ Soporte multi-región (Colombia incluido)
- ✅ No requiere procesamiento local

**Limitaciones del plan gratuito:**
- ⚠️ **NO incluye**: Color, Marca, Modelo (requiere plan de pago $60/mes)
- ✅ **SÍ incluye**: Placa, Tipo de vehículo, Región
- 2,500 llamadas/mes
- Sin soporte prioritario

**Plan de pago ($60/mes):**
- ✅ Color, Marca, Modelo automático
- ✅ 5,000 llamadas/mes
- ✅ Soporte prioritario
- ✅ Webhooks y otras características avanzadas

**Configuración:**

1. **Registro en PlateRecognizer**
   - Ve a: https://app.platerecognizer.com/accounts/signup/
   - Completa el formulario con tu email
   - Verifica tu correo electrónico

2. **Obtener API Token**
   - Inicia sesión en: https://app.platerecognizer.com/
   - Ve a la sección "API" en el menú lateral
   - Copia tu **API Token** (comienza con algo como `abc123...`)

3. **Configurar en el Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edita el archivo .env
   ```
   
   Agrega tu token:
   ```env
   PLATE_RECOGNIZER_TOKEN=abc123tu_token_aqui456def
   ```

4. **Reiniciar el servidor**
   ```bash
   npm run dev
   ```

### Opción 2: Tesseract.js (OCR Local)

**Ventajas:**
- ✅ 100% gratuito, sin límites
- ✅ No requiere cuenta externa
- ✅ Funciona offline
- ✅ Privacidad total (datos no salen del servidor)

**Desventajas:**
- ⚠️ 80-85% de precisión
- ⚠️ No detecta tipo de vehículo automáticamente
- ⚠️ Requiere imágenes de alta calidad
- ⚠️ Procesamiento más lento

**Configuración:**

1. **Instalar Tesseract.js**
   ```bash
   cd backend
   npm install tesseract.js
   ```

2. **Dejar token vacío**
   En `.env`:
   ```env
   # PLATE_RECOGNIZER_TOKEN=   # Comentado o vacío
   ```

3. **El sistema automáticamente usa Tesseract** como fallback

## 🎯 Cómo Funciona el Sistema

### 1. Registro de Entrada con IA

**Flujo:**
```
Usuario → Clic en icono cámara → Captura foto del VEHÍCULO COMPLETO
→ IA procesa imagen → Auto-llena TODOS los campos del vehículo
→ Usuario confirma → Vehículo registrado
```

**Proceso técnico:**
1. Frontend abre cámara con `MediaDevices API`
2. Usuario toma foto del **vehículo completo** (frente con placa visible)
3. Imagen se envía al backend via `FormData`
4. Backend llama a PlateRecognizer API con parámetros: `regions=co`, `mmc=true`
5. API retorna: 
   ```javascript
   { 
     plate: "ABC123", 
     type: "Car", 
     color: "black",
     make: "Toyota",
     model: "Corolla",
     confidence: 0.96 
   }
   ```
6. Backend mapea tipo de vehículo: `Car → CARRO`
7. Frontend recibe datos y auto-llena **5 campos**: placa, tipo, color, marca, modelo
8. Foto se guarda en DB como evidencia

**Tiempo de proceso:** ~2-3 segundos

**⚠️ IMPORTANTE - Para detectar Color, Marca y Modelo:**
- 🚗 Captura el **VEHÍCULO COMPLETO** (frente), NO solo la placa
- 📏 Distancia ideal: 2-4 metros
- 🎯 Debe ser visible: placa + logo + color de carrocería
- ❌ **NO funciona** si solo capturas la placa de cerca

**Ejemplo de captura correcta:**
```
        🚗 Vehículo completo
    ┌─────────────────────┐
    │    [Logo Toyota]    │ ← Logo visible
    │   ████████████████  │ ← Color negro visible
    │   ████████████████  │
    │      [ABC123]       │ ← Placa legible
    │   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  │
    └─────────────────────┘
```

**Resultado:**
- ✅ Placa: ABC123 (96%)
- ✅ Tipo: CARRO (98%)
- ✅ Color: Negro (89%)
- ✅ Marca: Toyota (85%)
- ✅ Modelo: Corolla (78%)

### 2. Control de Salida Automático

**Flujo:**
```
Guardia → Escanea placa del vehículo saliente
→ Sistema busca en DB → Verifica pago
→ AUTORIZA salida (verde) o REQUIERE PAGO (rojo)
```

**Casos de respuesta:**

#### ✅ Salida Autorizada (Verde)
```javascript
{
  allowExit: true,
  reason: 'VEHICLE_PAID',
  vehicle: { plate: 'ABC123', ... },
  payment: { amount: 5000, method: 'EFECTIVO' }
}
```

#### ❌ Pago Requerido (Rojo)
```javascript
{
  allowExit: false,
  reason: 'PAYMENT_REQUIRED',
  vehicle: { plate: 'ABC123', ... },
  estimatedAmount: 8000,
  duration: '2 horas 15 minutos'
}
```

#### ⚠️ Vehículo No Encontrado (Amarillo)
```javascript
{
  allowExit: false,
  reason: 'VEHICLE_NOT_FOUND',
  recognizedPlate: 'XYZ789',
  confidence: 0.87
}
```

### 3. Casos de Uso

**Escenario 1: Entrada Rápida**
- Tiempo sin IA: ~35 segundos (digitar placa, tipo, color, etc.)
- Tiempo con IA: ~8 segundos (escanear + confirmar)
- **Ahorro: 77% más rápido**

**Escenario 2: Control de Salida**
- Guardia escanea placa al salir
- Sistema automáticamente verifica pago
- Si no ha pagado → pantalla roja + botón "Procesar Pago"
- Si ya pagó → pantalla verde + "Siguiente Vehículo"

**Escenario 3: Evidencia Fotográfica**
- Todas las entradas/salidas tienen foto
- Resuelve disputas: "No entré" → Ver foto con timestamp
- Auditoría completa de operaciones

## 🔧 Arquitectura Técnica

### Backend (Node.js + Express)

**Controlador:** `backend/src/controllers/plateRecognitionController.js`
```javascript
// Reconocer placa
POST /api/plate-recognition/scan
- Recibe: FormData con imagen
- Llama: PlateRecognizer API
- Retorna: { plate, type, confidence, color, make, model }

// Validar salida
POST /api/plate-recognition/validate-exit
- Recibe: FormData con imagen
- Busca: Vehículo activo en DB
- Verifica: Estado de pago
- Retorna: { allowExit, reason, vehicle, payment }
```

**Campos en DB (Prisma):**
```prisma
model Vehicle {
  plate               String
  entryPhoto          String?   // URL foto entrada
  exitPhoto           String?   // URL foto salida
  plateConfidence     Float?    // 0-1 confianza IA
  recognizedBy        String?   // 'AI' o 'MANUAL'
  detectedVehicleType String?   // Tipo detectado por IA
  // ... otros campos
}
```

### Frontend (React)

**Componente Cámara:** `frontend/src/components/common/CameraCapture.jsx`
- MediaDevices API para acceso a cámara
- Overlay guía para enmarcar placa
- Botón cambiar cámara (frontal/trasera)
- Captura a formato JPEG blob

**Servicio API:** `frontend/src/services/plateRecognitionService.js`
```javascript
// Reconocer placa
recognizePlate(imageFile) → Promise<plateData>

// Validar salida
validateExit(imageFile) → Promise<exitValidation>
```

**Páginas:**
- `VehicleEntry.jsx` - Botón cámara + auto-llenado
- `ExitControl.jsx` - Página completa de control de salida

## 📊 Métricas y Monitoreo

### Campos de Confianza

Cada escaneo registra:
- `plateConfidence`: 0.0 - 1.0 (0% - 100%)
- `recognizedBy`: 'AI' o 'MANUAL'
- `detectedVehicleType`: Lo que IA detectó

### Recomendaciones

**Alta confianza (>90%):** Auto-completar todo
**Media confianza (70-90%):** Auto-completar pero resaltar para revisión
**Baja confianza (<70%):** Sugerir entrada manual

### Casos de Error

**Error 1: Placa no detectada**
```javascript
// API retorna vacío o confidence muy baja
if (!plateData || plateData.confidence < 0.5) {
  alert('No se pudo leer la placa. Intenta con mejor iluminación.');
}
```

**Error 2: Token inválido**
```javascript
// HTTP 403 Forbidden
alert('Token de API inválido. Verifica configuración .env');
```

**Error 3: Límite alcanzado**
```javascript
// HTTP 429 Too Many Requests
alert('Límite mensual alcanzado. Considera actualizar plan o usar Tesseract.js');
```

## 🎨 Mejores Prácticas

### Para Usuarios

1. **Iluminación:** Tomar fotos con buena luz (evitar sombras)
2. **Distancia:** 1-2 metros de la placa
3. **Ángulo:** Frontal a la placa (evitar ángulos laterales)
4. **Limpieza:** Placas sin lodo o suciedad
5. **Enfoque:** Esperar que cámara enfoque antes de capturar

### Para Desarrolladores

1. **Validación:** Siempre verificar `confidence` antes de auto-completar
2. **Fallback:** Permitir edición manual si IA falla
3. **Caché:** Guardar fotos localmente antes de subir
4. **Timeout:** 10 segundos máximo para respuesta de API
5. **Retry:** Reintentar 1 vez si falla la primera llamada

## 🛠️ Troubleshooting

### Problema: "Cannot access camera"

**Causas:**
- Navegador no tiene permisos de cámara
- HTTPS no habilitado (cámara requiere SSL)
- Cámara usada por otra app

**Soluciones:**
```javascript
// En navegador: Settings → Privacy → Camera → Permitir
// En desarrollo: Usar localhost (permitido sin HTTPS)
// En producción: Configurar HTTPS obligatoriamente
```

### Problema: "API rate limit exceeded"

**Causa:** Excediste 2,500 llamadas/mes del plan gratuito

**Soluciones:**
1. Esperar hasta próximo mes
2. Actualizar a plan pago ($39/mes = 5,000 llamadas)
3. Cambiar a Tesseract.js (gratis, ilimitado)

### Problema: "Low confidence readings"

**Causas:**
- Placa sucia o dañada
- Mala iluminación
- Ángulo incorrecto
- Placa no estándar

**Soluciones:**
- Mejorar condiciones de captura
- Usar flash en ambientes oscuros
- Tomar múltiples fotos y elegir mejor resultado
- Entrada manual como fallback

## 📚 Recursos Adicionales

- **PlateRecognizer Docs:** https://docs.platerecognizer.com/
- **Tesseract.js GitHub:** https://github.com/naptha/tesseract.js
- **MediaDevices API:** https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
- **Ejemplo API Request:**
  ```bash
  curl -X POST \
    https://api.platerecognizer.com/v1/plate-reader/ \
    -H 'Authorization: Token YOUR_TOKEN' \
    -F 'upload=@/path/to/image.jpg' \
    -F 'regions=co'
  ```

## 🔐 Seguridad y Privacidad

### Datos Sensibles

- **Fotos:** Almacenadas en servidor, acceso restringido
- **Token API:** Guardado en `.env`, nunca expuesto al cliente
- **Placas:** Consideradas datos personales, proteger según GDPR

### Recomendaciones

1. **Encriptación:** HTTPS obligatorio en producción
2. **Retención:** Definir política de eliminación de fotos antiguas
3. **Acceso:** Solo usuarios autenticados pueden escanear
4. **Logs:** No registrar tokens en logs
5. **Backup:** Respaldar fotos regularmente

## 🚀 Roadmap Futuro

### Mejoras Potenciales

- [ ] Cache de resultados para placas frecuentes
- [ ] Reconocimiento de rostros (opcional, privacidad)
- [ ] Detección de daños en vehículos
- [ ] Integración con cámaras de seguridad fijas
- [ ] Machine Learning local para mejorar precisión
- [ ] Notificaciones push al detectar placa específica
- [ ] Dashboard de métricas de IA (precisión por hora/día)

---

**Última actualización:** Diciembre 2024  
**Versión del sistema:** 1.0.0  
**Soporte:** [GitHub Issues](https://github.com/tu-repo/issues)
