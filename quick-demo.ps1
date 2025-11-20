# Demo Rápido - Brute Force Attack
# Ejecutar: .\quick-demo.ps1

Write-Host "`n🔨 DEMO: ATAQUE DE FUERZA BRUTA`n" -ForegroundColor Red

$baseUrl = "http://localhost:3000/api/auth/login"
$testEmail = "admin@parking.com"

Write-Host "Probando 20 contraseñas diferentes sin límite...`n" -ForegroundColor Yellow

for ($i = 1; $i -le 20; $i++) {
    $body = @{
        email = $testEmail
        password = "password$i"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri $baseUrl -Method Post -ContentType "application/json" -Body $body -ErrorAction Stop | Out-Null
        Write-Host "[$i] ✓ Petición aceptada" -ForegroundColor Green
    }
    catch {
        Write-Host "[$i] ✗ Credenciales incorrectas (pero procesado)" -ForegroundColor DarkGray
    }
}

Write-Host "`n❌ RESULTADO: Todas las peticiones fueron procesadas!" -ForegroundColor Red
Write-Host "⚠️  NO hay límite de intentos - Vulnerable a brute force`n" -ForegroundColor Yellow
Write-Host "🔒 SOLUCIÓN: Implementar rate limiting (ver SECURITY.md)`n" -ForegroundColor Green
