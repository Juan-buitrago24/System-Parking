# Script de ayuda para iniciar System Parking

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   System Parking - Inicio" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js no encontrado. Por favor instala Node.js desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar si PostgreSQL está corriendo
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
$postgresRunning = Get-Process -Name postgres -ErrorAction SilentlyContinue
if ($postgresRunning) {
    Write-Host "✓ PostgreSQL está corriendo" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL no detectado. Asegúrate de que esté instalado y corriendo" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   Opciones Disponibles" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Iniciar Backend" -ForegroundColor White
Write-Host "2. Iniciar Frontend" -ForegroundColor White
Write-Host "3. Iniciar Backend y Frontend" -ForegroundColor White
Write-Host "4. Configurar Backend (primera vez)" -ForegroundColor White
Write-Host "5. Configurar Frontend (primera vez)" -ForegroundColor White
Write-Host "6. Abrir Prisma Studio" -ForegroundColor White
Write-Host "7. Ver Guía de Inicio" -ForegroundColor White
Write-Host "8. Salir" -ForegroundColor White
Write-Host ""

$opcion = Read-Host "Selecciona una opción (1-8)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "Iniciando Backend..." -ForegroundColor Green
        Set-Location backend
        npm run dev
    }
    "2" {
        Write-Host ""
        Write-Host "Iniciando Frontend..." -ForegroundColor Green
        Set-Location frontend
        npm run dev
    }
    "3" {
        Write-Host ""
        Write-Host "Iniciando Backend y Frontend..." -ForegroundColor Green
        Write-Host "⚠ Se abrirán dos ventanas de terminal" -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
        Start-Sleep -Seconds 2
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
        Write-Host "✓ Backend y Frontend iniciados en ventanas separadas" -ForegroundColor Green
    }
    "4" {
        Write-Host ""
        Write-Host "Configurando Backend..." -ForegroundColor Green
        Set-Location backend
        
        Write-Host "Instalando dependencias..." -ForegroundColor Yellow
        npm install
        
        if (!(Test-Path .env)) {
            Write-Host "Creando archivo .env..." -ForegroundColor Yellow
            Copy-Item .env.example .env
            Write-Host "⚠ Por favor edita el archivo backend/.env con tus credenciales" -ForegroundColor Yellow
            Read-Host "Presiona Enter cuando hayas configurado el archivo .env"
        }
        
        Write-Host "Generando cliente de Prisma..." -ForegroundColor Yellow
        npx prisma generate
        
        Write-Host "Ejecutando migraciones..." -ForegroundColor Yellow
        npx prisma migrate dev --name init
        
        Write-Host "✓ Backend configurado correctamente" -ForegroundColor Green
    }
    "5" {
        Write-Host ""
        Write-Host "Configurando Frontend..." -ForegroundColor Green
        Set-Location frontend
        
        Write-Host "Instalando dependencias..." -ForegroundColor Yellow
        npm install
        
        if (!(Test-Path .env)) {
            Write-Host "Creando archivo .env..." -ForegroundColor Yellow
            Copy-Item .env.example .env
        }
        
        Write-Host "✓ Frontend configurado correctamente" -ForegroundColor Green
    }
    "6" {
        Write-Host ""
        Write-Host "Abriendo Prisma Studio..." -ForegroundColor Green
        Set-Location backend
        npx prisma studio
    }
    "7" {
        Write-Host ""
        Write-Host "Abriendo Guía de Inicio..." -ForegroundColor Green
        notepad GUIA_INICIO.md
    }
    "8" {
        Write-Host ""
        Write-Host "¡Hasta luego!" -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host ""
        Write-Host "✗ Opción no válida" -ForegroundColor Red
    }
}
