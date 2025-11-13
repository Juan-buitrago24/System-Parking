# System Parking - Guía de Deployment a Producción

## 📋 Tabla de Contenidos
1. [Base de Datos (Render PostgreSQL)](#base-de-datos)
2. [Backend (Render)](#backend)
3. [Frontend (Vercel)](#frontend)
4. [Configuración Final](#configuración-final)

---

## 🗄️ Base de Datos (Render PostgreSQL)

### Paso 1: Crear Base de Datos en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New +"** → **"PostgreSQL"**
3. Configura:
   - **Name**: `system-parking-db`
   - **Database**: `parking_db`
   - **User**: (auto-generado)
   - **Region**: Ohio (US East)
   - **Plan**: Free
4. Click **"Create Database"**

### Paso 2: Obtener Credenciales

Una vez creada, copia:
- **Internal Database URL**: Para conexiones desde Render
- **External Database URL**: Para conexiones externas (formato: `postgresql://user:pass@host:port/db`)

**Ejemplo:**
```
postgresql://parking_user:abc123xyz@dpg-xyz.oregon-postgres.render.com/parking_db
```

---

## 🔧 Backend (Render Web Service)

### Paso 1: Preparar el Backend

En tu repositorio local, verifica que `backend/package.json` tenga:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "build": "npx prisma generate && npx prisma migrate deploy"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

### Paso 2: Deploy en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `system-parking-api`
   - **Region**: Ohio (US East)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Paso 3: Variables de Entorno

En el apartado **Environment**, agrega:

```env
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=tu_jwt_secret_super_seguro_2024
RESEND_API_KEY=re_tu_api_key_de_resend
RESEND_FROM_EMAIL=System Parking <onboarding@resend.dev>
FRONTEND_URL=https://tu-frontend.vercel.app
PORT=10000
NODE_ENV=production
```

**Importante:**
- `DATABASE_URL`: Usa la **Internal Database URL** de Render
- `JWT_SECRET`: Genera uno nuevo seguro (mínimo 32 caracteres)
- `RESEND_API_KEY`: Tu API key de Resend
- `FRONTEND_URL`: Lo agregarás después del deploy del frontend

### Paso 4: Deploy

1. Click **"Create Web Service"**
2. Espera a que termine el build (5-10 min)
3. Una vez completado, tu API estará en: `https://system-parking-api.onrender.com`

### Paso 5: Ejecutar Migraciones y Seed

1. Ve a tu servicio en Render
2. Click en **"Shell"** (terminal)
3. Ejecuta:
```bash
npx prisma migrate deploy
npx prisma db seed
node scripts/createAdmin.js
```

---

## 🎨 Frontend (Vercel)

### Paso 1: Preparar el Frontend

Crea `frontend/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Paso 2: Deploy en Vercel

1. Ve a [Vercel](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Importa tu repositorio de GitHub
4. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Paso 3: Variables de Entorno

En **Settings** → **Environment Variables**, agrega:

```env
VITE_API_URL=https://system-parking-api.onrender.com/api
```

### Paso 4: Deploy

1. Click **"Deploy"**
2. Espera 2-3 minutos
3. Tu frontend estará en: `https://system-parking-xyz.vercel.app`

### Paso 5: Actualizar FRONTEND_URL en Backend

1. Copia la URL de tu frontend en Vercel
2. Ve a Render → Tu servicio backend → **Environment**
3. Actualiza `FRONTEND_URL` con la URL de Vercel
4. Guarda y espera el redeploy automático

---

## ✅ Configuración Final

### 1. Verificar CORS

En `backend/src/server.js`, verifica:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 2. Probar la Aplicación

1. Ve a tu URL de Vercel
2. Regístrate con un nuevo usuario
3. Verifica el email (revisa spam si no llega)
4. Inicia sesión
5. Prueba cada módulo

### 3. Crear Usuario Admin en Producción

**Opción A: Desde Render Shell**
```bash
node scripts/createAdmin.js
```

**Opción B: Manualmente desde la BD**
```sql
UPDATE "User" 
SET role = 'ADMIN', "isVerified" = true 
WHERE email = 'tu@email.com';
```

---

## 🔒 Seguridad

### Variables de Entorno Críticas

Asegúrate de usar valores diferentes para producción:

```bash
# Genera un JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Resultado ejemplo:
# 7f8d9e2a5b3c4d1e6f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7
```

### Limitar Acceso a Base de Datos

En Render PostgreSQL:
- Solo permite conexiones desde tu servicio de backend
- No expongas la External URL públicamente

---

## 📊 Monitoreo

### Render
- Logs en tiempo real: Dashboard → Tu servicio → **Logs**
- Métricas: **Metrics** tab

### Vercel
- Analytics: Dashboard → Tu proyecto → **Analytics**
- Logs: **Deployments** → Click en un deployment

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verifica la DATABASE_URL
echo $DATABASE_URL

# Prueba la conexión
npx prisma db pull
```

### Error: "CORS policy"
- Verifica que `FRONTEND_URL` en backend coincida con tu URL de Vercel
- Revisa que no tenga `/` al final

### Error: "Module not found"
```bash
# Limpia y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Emails no se envían
- Verifica `RESEND_API_KEY` en variables de entorno
- Revisa los logs en Render para errores de Resend
- Confirma que el dominio de `RESEND_FROM_EMAIL` esté verificado

---

## 🔄 Actualizaciones

Para deployar cambios:

### Backend (Render)
```bash
git add .
git commit -m "Update backend"
git push origin main
# Render hace auto-deploy
```

### Frontend (Vercel)
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel hace auto-deploy
```

---

## 💰 Costos

### Plan Free
- **Render PostgreSQL**: 1GB storage, 97 horas/mes
- **Render Web Service**: 750 horas/mes
- **Vercel**: Banda ancha ilimitada, builds ilimitados
- **Total**: $0/mes

### Limitaciones
- Backend se duerme después de 15 min de inactividad
- Primera petición tarda ~30s en despertar
- 1GB de storage en BD

### Upgrade Recomendado
- **Render PostgreSQL**: $7/mes (10GB, siempre activo)
- **Render Web Service**: $7/mes (siempre activo, 0.5GB RAM)
- **Vercel Pro**: $20/mes (analytics avanzados, más builds)

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render/Vercel
2. Verifica todas las variables de entorno
3. Consulta la documentación oficial:
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [Prisma Docs](https://www.prisma.io/docs)

---

## ✨ URLs Finales

Una vez completado, tendrás:

- **Frontend**: `https://system-parking.vercel.app`
- **Backend API**: `https://system-parking-api.onrender.com`
- **Database**: `dpg-xyz.oregon-postgres.render.com`

**¡Felicidades! Tu aplicación está en producción** 🎉
