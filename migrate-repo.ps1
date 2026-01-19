# Script para migrar el repositorio a un nuevo remoto
# Uso: .\migrate-repo.ps1 -NewRepoUrl "https://github.com/tu-usuario/tu-repo.git"

param(
    [Parameter(Mandatory=$true)]
    [string]$NewRepoUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$NewBranchName = "main",
    
    [Parameter(Mandatory=$false)]
    [switch]$KeepHistory = $true
)

Write-Host "=== Migración de Repositorio ===" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en un repositorio git
if (-not (Test-Path .git)) {
    Write-Host "Error: No se encontró un repositorio git en el directorio actual" -ForegroundColor Red
    exit 1
}

# Mostrar información actual
Write-Host "Estado actual del repositorio:" -ForegroundColor Yellow
git remote -v
Write-Host ""
git branch --show-current | ForEach-Object { Write-Host "Branch actual: $_" -ForegroundColor Yellow }
Write-Host ""

if ($KeepHistory) {
    Write-Host "Opción seleccionada: Mantener historial" -ForegroundColor Green
    Write-Host ""
    
    # Cambiar el remote origin
    Write-Host "Cambiando remote origin..." -ForegroundColor Cyan
    git remote set-url origin $NewRepoUrl
    
    # Verificar el cambio
    Write-Host "Nuevo remote:" -ForegroundColor Green
    git remote -v
    Write-Host ""
    
    # Obtener el nombre del branch actual
    $currentBranch = git branch --show-current
    
    # Renombrar branch si es necesario
    if ($currentBranch -ne $NewBranchName) {
        Write-Host "Renombrando branch de '$currentBranch' a '$NewBranchName'..." -ForegroundColor Cyan
        git branch -M $NewBranchName
        Write-Host "Branch renombrado exitosamente" -ForegroundColor Green
        Write-Host ""
    }
    
    Write-Host "=== Próximos pasos ===" -ForegroundColor Cyan
    Write-Host "1. Asegúrate de que el nuevo repositorio existe en GitHub/GitLab" -ForegroundColor Yellow
    Write-Host "2. Ejecuta el siguiente comando para hacer push:" -ForegroundColor Yellow
    Write-Host "   git push -u origin $NewBranchName" -ForegroundColor White
    Write-Host ""
    Write-Host "Si el repositorio ya existe y tiene contenido, puedes forzar el push con:" -ForegroundColor Yellow
    Write-Host "   git push -u origin $NewBranchName --force" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host "Opción seleccionada: Empezar desde cero (sin historial)" -ForegroundColor Green
    Write-Host ""
    Write-Host "ADVERTENCIA: Esto eliminará todo el historial de git" -ForegroundColor Red
    $confirm = Read-Host "¿Estás seguro? (escribe 'si' para continuar)"
    
    if ($confirm -ne "si") {
        Write-Host "Operación cancelada" -ForegroundColor Yellow
        exit 0
    }
    
    # Eliminar .git
    Write-Host "Eliminando historial de git..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force .git
    
    # Inicializar nuevo repositorio
    Write-Host "Inicializando nuevo repositorio..." -ForegroundColor Cyan
    git init
    
    # Agregar todos los archivos
    Write-Host "Agregando archivos..." -ForegroundColor Cyan
    git add .
    
    # Primer commit
    Write-Host "Creando commit inicial..." -ForegroundColor Cyan
    git commit -m "Initial commit"
    
    # Agregar remote
    Write-Host "Agregando remote..." -ForegroundColor Cyan
    git remote add origin $NewRepoUrl
    
    # Renombrar branch
    git branch -M $NewBranchName
    
    Write-Host "=== Próximos pasos ===" -ForegroundColor Cyan
    Write-Host "Ejecuta el siguiente comando para hacer push:" -ForegroundColor Yellow
    Write-Host "   git push -u origin $NewBranchName" -ForegroundColor White
    Write-Host ""
}

Write-Host "¡Migración completada!" -ForegroundColor Green
