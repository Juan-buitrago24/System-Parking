# Script de Demostración de Vulnerabilidades - System Parking
# Ejecutar: .\security-demo.ps1

Write-Host "`n🔐 DEMOSTRACIÓN DE VULNERABILIDADES - SYSTEM PARKING" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "`n⚠️  PROPÓSITO EDUCATIVO - NO USAR EN PRODUCCIÓN`n" -ForegroundColor Yellow

# Variables
$baseUrl = "http://localhost:3000"
$testEmail = "admin@parking.com"
$fakeEmail = "noexiste12345@test.com"

function Test-ServerRunning {
    try {
        $response = Invoke-WebRequest -Uri $baseUrl -Method Get -TimeoutSec 2 -ErrorAction Stop
        return $true
    }
    catch {
        Write-Host "❌ El servidor no está corriendo en $baseUrl" -ForegroundColor Red
        Write-Host "   Ejecuta: cd backend; npm run dev" -ForegroundColor Yellow
        return $false
    }
}

function Show-Menu {
    Write-Host "`n📋 MENÚ DE DEMOSTRACIONES:" -ForegroundColor Green
    Write-Host "  1. Brute Force Attack (Sin Rate Limiting)" -ForegroundColor White
    Write-Host "  2. Account Enumeration (Revelar emails)" -ForegroundColor White
    Write-Host "  3. Sin Validación de Input" -ForegroundColor White
    Write-Host "  4. Ver todas las vulnerabilidades" -ForegroundColor White
    Write-Host "  5. Salir" -ForegroundColor Gray
    Write-Host ""
}

function Demo-BruteForce {
    Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
    Write-Host "🔨 DEMO 1: BRUTE FORCE ATTACK" -ForegroundColor Red
    Write-Host ("=" * 60) -ForegroundColor Cyan
    
    Write-Host "`n📝 Vulnerabilidad:" -ForegroundColor Yellow
    Write-Host "   - No hay límite de intentos de login"
    Write-Host "   - Un atacante puede probar miles de contraseñas"
    Write-Host ""
    
    Write-Host "🎯 Ejecutando 20 intentos de login con contraseñas diferentes..." -ForegroundColor Magenta
    Write-Host ""
    
    $successCount = 0
    $failedCount = 0
    
    for ($i = 1; $i -le 20; $i++) {
        $body = @{
            email = $testEmail
            password = "password$i"
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
                -Method Post `
                -ContentType "application/json" `
                -Body $body `
                -ErrorAction Stop
            
            $successCount++
            Write-Host "  [$i] ✓ Respuesta recibida (200 OK)" -ForegroundColor Green
        }
        catch {
            $failedCount++
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "  [$i] ✗ Intento fallido - Status: $statusCode" -ForegroundColor DarkGray
        }
        
        Start-Sleep -Milliseconds 100
    }
    
    Write-Host ""
    Write-Host "📊 RESULTADO:" -ForegroundColor Yellow
    Write-Host "   - Total de intentos: 20" -ForegroundColor White
    Write-Host "   - Intentos procesados: $($successCount + $failedCount)" -ForegroundColor White
    Write-Host "   - ❌ NO hubo bloqueo después de X intentos" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔒 SOLUCIÓN:" -ForegroundColor Green
    Write-Host "   - Implementar express-rate-limit" -ForegroundColor White
    Write-Host "   - Máximo 5 intentos cada 15 minutos" -ForegroundColor White
    Write-Host "   - Ver SECURITY.md sección 1" -ForegroundColor Cyan
}

function Demo-AccountEnumeration {
    Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
    Write-Host "🔍 DEMO 2: ACCOUNT ENUMERATION" -ForegroundColor Red
    Write-Host ("=" * 60) -ForegroundColor Cyan
    
    Write-Host "`n📝 Vulnerabilidad:" -ForegroundColor Yellow
    Write-Host "   - El endpoint /register revela si un email existe"
    Write-Host "   - Un atacante puede descubrir usuarios del sistema"
    Write-Host ""
    
    # Test 1: Email que existe
    Write-Host "🧪 TEST 1: Intentando registrar email existente ($testEmail)..." -ForegroundColor Magenta
    
    $body = @{
        email = $testEmail
        password = "Test123!"
        firstName = "Test"
        lastName = "User"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        Write-Host "   Respuesta: $($response.message)" -ForegroundColor White
    }
    catch {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "   ❌ Respuesta: $($errorDetails.message)" -ForegroundColor Red
        Write-Host "   ⚠️  EL SISTEMA REVELÓ QUE EL EMAIL EXISTE!" -ForegroundColor Yellow
    }
    
    Write-Host ""
    
    # Test 2: Email que NO existe
    Write-Host "🧪 TEST 2: Intentando registrar email nuevo ($fakeEmail)..." -ForegroundColor Magenta
    
    $body = @{
        email = $fakeEmail
        password = "Test123!"
        firstName = "Test"
        lastName = "User"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        Write-Host "   ✓ Respuesta: $($response.message)" -ForegroundColor Green
        Write-Host "   ℹ️  Diferencia en respuesta permite enumerar cuentas" -ForegroundColor Cyan
    }
    catch {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "   Respuesta: $($errorDetails.message)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "📊 CONCLUSIÓN:" -ForegroundColor Yellow
    Write-Host "   - Respuestas diferentes revelan si un email existe" -ForegroundColor White
    Write-Host "   - Atacante puede construir lista de usuarios válidos" -ForegroundColor White
    Write-Host ""
    Write-Host "🔒 SOLUCIÓN:" -ForegroundColor Green
    Write-Host "   - Usar mensaje genérico para ambos casos" -ForegroundColor White
    Write-Host "   - Ejemplo: 'Si el email es válido, recibirás un correo'" -ForegroundColor White
    Write-Host "   - Ver SECURITY.md sección 2" -ForegroundColor Cyan
}

function Demo-InputValidation {
    Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
    Write-Host "📝 DEMO 3: SIN VALIDACIÓN DE INPUT" -ForegroundColor Red
    Write-Host ("=" * 60) -ForegroundColor Cyan
    
    Write-Host "`n📝 Vulnerabilidad:" -ForegroundColor Yellow
    Write-Host "   - No valida formato de email"
    Write-Host "   - No valida longitud de contraseña"
    Write-Host ""
    
    # Test 1: Email inválido
    Write-Host "🧪 TEST 1: Login con email inválido..." -ForegroundColor Magenta
    
    $body = @{
        email = "esto-no-es-un-email"
        password = "test"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        Write-Host "   Respuesta: Sistema aceptó el input" -ForegroundColor White
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode - El sistema procesó la petición" -ForegroundColor Yellow
        Write-Host "   ⚠️  Debería rechazar antes de consultar la BD" -ForegroundColor Yellow
    }
    
    Write-Host ""
    
    # Test 2: XSS attempt
    Write-Host "🧪 TEST 2: Intento de XSS en firstName..." -ForegroundColor Magenta
    
    $body = @{
        email = "xsstest@test.com"
        password = "Test123!"
        firstName = "<script>alert('XSS')</script>"
        lastName = "User"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        Write-Host "   ⚠️  Sistema aceptó HTML/JavaScript en input!" -ForegroundColor Yellow
        Write-Host "   Nombre guardado: $($response.data.firstName)" -ForegroundColor White
    }
    catch {
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "🔒 SOLUCIÓN:" -ForegroundColor Green
    Write-Host "   - Implementar express-validator" -ForegroundColor White
    Write-Host "   - Validar formato de email antes de procesar" -ForegroundColor White
    Write-Host "   - Sanitizar inputs con librería XSS" -ForegroundColor White
    Write-Host "   - Ver SECURITY.md sección 5 y 8" -ForegroundColor Cyan
}

function Demo-All {
    Demo-BruteForce
    Read-Host "`nPresiona Enter para continuar..."
    Demo-AccountEnumeration
    Read-Host "`nPresiona Enter para continuar..."
    Demo-InputValidation
}

# Main
if (-not (Test-ServerRunning)) {
    exit 1
}

Write-Host "✓ Servidor detectado en $baseUrl" -ForegroundColor Green

do {
    Show-Menu
    $choice = Read-Host "Selecciona una opción (1-5)"
    
    switch ($choice) {
        "1" { Demo-BruteForce }
        "2" { Demo-AccountEnumeration }
        "3" { Demo-InputValidation }
        "4" { Demo-All }
        "5" { 
            Write-Host "`n👋 Saliendo...`n" -ForegroundColor Green
            exit 0
        }
        default { Write-Host "`n❌ Opción inválida`n" -ForegroundColor Red }
    }
    
    if ($choice -ne "5") {
        Read-Host "`nPresiona Enter para volver al menú"
    }
    
} while ($choice -ne "5")
