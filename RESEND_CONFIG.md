# 📧 Configuración de Resend - Guía Rápida

## ¿Qué es Resend?

Resend es un servicio moderno de envío de emails diseñado para desarrolladores. Es mucho más confiable y fácil de usar que Gmail/SMTP tradicional.

## ✨ Ventajas sobre Gmail/Nodemailer

- ✅ **Sin configuración compleja** - Solo necesitas una API Key
- ✅ **Más confiable** - Mejor deliverability (los emails llegan a la bandeja de entrada)
- ✅ **100 emails gratis al día** - Perfecto para desarrollo y pruebas
- ✅ **Dashboard con estadísticas** - Ve todos los emails enviados
- ✅ **No necesita contraseñas de aplicación** - Más seguro
- ✅ **Soporte de React Email** - Plantillas modernas (opcional)
- ✅ **Sin límite de "apps menos seguras"** - Como Gmail

## 🚀 Configuración Paso a Paso

### 1. Crear Cuenta en Resend

1. Ve a [https://resend.com](https://resend.com)
2. Haz clic en "Sign Up" o "Get Started"
3. Regístrate con tu email
4. Confirma tu cuenta desde el email que te llegará

### 2. Obtener tu API Key

1. Una vez dentro, ve a [API Keys](https://resend.com/api-keys)
2. Haz clic en **"Create API Key"**
3. Dale un nombre descriptivo: `System Parking Development`
4. Selecciona los permisos: `Sending access` (ya está seleccionado por defecto)
5. Haz clic en **"Add"**
6. **IMPORTANTE**: Copia la API Key inmediatamente (comienza con `re_`)
   - ⚠️ Solo se muestra una vez, guárdala en un lugar seguro
7. Si la pierdes, puedes generar una nueva

### 3. Configurar en el Proyecto

Abre el archivo `backend/.env` y pega tu API Key:

```env
# Reemplaza esto con tu API Key real
RESEND_API_KEY="re_tu_api_key_que_copiaste"

# Para pruebas, deja este email (ya funciona):
RESEND_FROM_EMAIL="System Parking <onboarding@resend.dev>"
```

### 4. ¡Listo para Enviar Emails!

Ya puedes iniciar el backend y enviar emails:

```powershell
cd backend
npm run dev
```

Ahora prueba registrando un usuario en el frontend.

## 📊 Ver los Emails Enviados

1. Ve a [https://resend.com/emails](https://resend.com/emails)
2. Verás todos los emails enviados desde tu aplicación
3. Puedes ver:
   - ✅ Estado (entregado, rebotado, etc.)
   - 📧 Destinatario
   - 📅 Fecha y hora
   - 👁️ Preview del email
   - 📈 Estadísticas de apertura (en plan pago)

## 🎨 Email de Prueba (onboarding@resend.dev)

- **Propósito**: Email especial de Resend para desarrollo y pruebas
- **Ventaja**: No necesitas verificar ningún dominio
- **Limitación**: Solo para pruebas, no para producción
- **Funciona para**: Enviar emails a cualquier destinatario durante desarrollo

## 🌐 Usar tu Propio Dominio (Producción)

### Para Producción:

1. Ve a [Domains](https://resend.com/domains)
2. Haz clic en **"Add Domain"**
3. Ingresa tu dominio (ej: `tuempresa.com`)
4. Resend te dará registros DNS para configurar:
   - SPF
   - DKIM
   - DMARC
5. Agrega estos registros en tu proveedor de dominio (GoDaddy, Namecheap, etc.)
6. Espera a que se verifique (puede tomar unas horas)
7. Una vez verificado, cambia en `.env`:

```env
RESEND_FROM_EMAIL="System Parking <no-reply@tudominio.com>"
```

## 💡 Emails Recomendados para Usar

- `no-reply@tudominio.com` - Para emails automáticos
- `notificaciones@tudominio.com` - Para notificaciones
- `soporte@tudominio.com` - Si esperas respuestas
- `info@tudominio.com` - Información general

## 📈 Límites del Plan Gratuito

- **100 emails por día** - Más que suficiente para desarrollo
- **Emails ilimitados en los primeros 30 días** - Para empezar sin límites
- **1 dominio verificado** - Puedes agregar tu dominio
- **Soporte por email** - Resend tiene buen soporte

## 🔐 Seguridad

- ✅ **Nunca compartas tu API Key** - Es como una contraseña
- ✅ **Usa variables de entorno** - Nunca en el código
- ✅ **Regenera si se compromete** - Puedes crear nuevas keys
- ✅ **Usa keys diferentes** - Una para desarrollo, otra para producción

## 🧪 Probar el Envío de Emails

### Opción 1: Registrar un usuario en el frontend

```
1. Abre http://localhost:5173/register
2. Completa el formulario con tu email real
3. Revisa tu bandeja de entrada
4. Deberías recibir el email de verificación
```

### Opción 2: Probar desde el código (opcional)

Puedes crear un archivo de prueba:

```javascript
// backend/test-email.js
import { sendMail } from "./src/config/mailer.js";

const testEmail = async () => {
  try {
    await sendMail(
      "tu-email@gmail.com",
      "Test de Resend",
      "<h1>¡Funciona! 🎉</h1><p>Este es un email de prueba desde Resend.</p>"
    );
    console.log("✅ Email enviado exitosamente");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

testEmail();
```

Ejecutar:
```powershell
cd backend
node test-email.js
```

## 🐛 Solución de Problemas

### Error: "API key is invalid"
- ✅ Verifica que copiaste la key completa
- ✅ Debe comenzar con `re_`
- ✅ No debe tener espacios al inicio o final
- ✅ Genera una nueva si es necesario

### Error: "Unable to send email"
- ✅ Verifica tu conexión a internet
- ✅ Revisa el dashboard de Resend para ver logs
- ✅ Asegúrate de que el email destinatario sea válido

### Los emails van a SPAM
- ✅ Usa `onboarding@resend.dev` para desarrollo (no debería ir a spam)
- ✅ Para producción, verifica tu dominio completo
- ✅ Configura SPF, DKIM y DMARC correctamente

### No llega el email
- ✅ Revisa la carpeta de spam
- ✅ Verifica en el dashboard de Resend si se envió
- ✅ Asegúrate de que el email destinatario existe
- ✅ Espera unos minutos (a veces demora)

## 📚 Recursos Útiles

- [Documentación de Resend](https://resend.com/docs)
- [Dashboard de Emails](https://resend.com/emails)
- [API Keys](https://resend.com/api-keys)
- [Dominios](https://resend.com/domains)
- [React Email (plantillas)](https://react.email)

## 💰 Planes y Precios

- **Free**: 100 emails/día - Perfecto para desarrollo
- **Pro**: $20/mes - 50,000 emails/mes
- **Business**: $80/mes - 150,000 emails/mes
- **Enterprise**: Personalizado

Para este proyecto, el plan gratuito es más que suficiente.

## 🎯 Conclusión

Resend es mucho mejor que Gmail para aplicaciones porque:
- Es más confiable
- Más fácil de configurar
- Mejor para desarrollo
- Más profesional
- Dashboard con estadísticas

¡Ya estás listo para enviar emails como un profesional! 🚀

---

**¿Necesitas ayuda?** Revisa el [dashboard de Resend](https://resend.com/emails) para ver todos tus emails enviados y su estado.
