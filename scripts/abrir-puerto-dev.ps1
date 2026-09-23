# Ejecutar como administrador: clic derecho > Ejecutar con PowerShell
# Abre el puerto 3001 para ver ObraTech desde celular/tablet en la misma Wi-Fi.

$ErrorActionPreference = "Stop"

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: Abre PowerShell como administrador y vuelve a ejecutar este script." -ForegroundColor Red
    exit 1
}

$port = 3001
$ruleName = "ObraTech Dev $port"

netsh advfirewall firewall delete rule name="$ruleName" 2>$null | Out-Null
netsh advfirewall firewall add rule name="$ruleName" dir=in action=allow protocol=TCP localport=$port profile=any

Write-Host ""
Write-Host "Puerto $port abierto en el firewall." -ForegroundColor Green
Write-Host ""
Write-Host "En el celular (misma Wi-Fi), abre:" -ForegroundColor Yellow

$ip = (
    Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.InterfaceAlias -match 'Wi-Fi|WLAN|inal' -and $_.IPAddress -notlike '169.254*' } |
    Select-Object -First 1 -ExpandProperty IPAddress
)

if (-not $ip) {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254*' -and $_.IPAddress -notlike '192.168.56.*' } | Select-Object -First 1 -ExpandProperty IPAddress)
}

if ($ip) {
    Write-Host "  http://${ip}:${port}" -ForegroundColor Cyan
    Write-Host "  http://${ip}:${port}/admin" -ForegroundColor Cyan
} else {
    Write-Host "  http://TU_IP:${port}  (mira ipconfig, seccion Wi-Fi)" -ForegroundColor Cyan
}

Write-Host ""
