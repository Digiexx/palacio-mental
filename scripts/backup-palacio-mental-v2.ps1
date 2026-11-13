param(
    [string]$Origem = (Split-Path -Parent $PSScriptRoot),
    [string]$BaseDrive,
    [switch]$VerificarSomente
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $Origem -PathType Container)) { throw "Origem nao encontrada: $Origem" }
if ([string]::IsNullOrWhiteSpace($BaseDrive)) { throw 'Informe -BaseDrive com o caminho da pasta palacio-mental na unidade H.' }
if (-not (Test-Path -LiteralPath $BaseDrive -PathType Container)) { throw "Destino indisponivel: $BaseDrive" }
$git = (Get-Command git -ErrorAction Stop).Source
$commit = (& $git -C $Origem rev-parse --short HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or -not $commit) { throw 'Nao foi possivel identificar o commit.' }
$root = Join-Path $BaseDrive 'Backups do Aplicativo'
$existing = @(Get-ChildItem -LiteralPath $root -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match ('^backup_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_' + [regex]::Escape($commit) + '$') -and (Test-Path -LiteralPath (Join-Path $_.FullName 'manifesto.txt')) -and (Test-Path -LiteralPath (Join-Path $_.FullName 'historico-git.bundle')) })
if ($existing.Count -gt 0) {
    Write-Host "Ja existe backup para o commit $commit : $($existing[0].FullName)"
    return
}
$destino = Join-Path $root ("backup_{0}_{1}" -f (Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'), $commit)
Write-Host "Origem: $Origem"
Write-Host "Destino previsto: $destino"
Write-Host "Commit: $commit"
if ($VerificarSomente) { Write-Host 'Verificacao concluida. Nenhuma copia realizada.'; return }
New-Item -ItemType Directory -Path $destino -Force | Out-Null
$log = Join-Path $destino 'resultado-robocopy.log'
& robocopy $Origem (Join-Path $destino 'projeto') /E /R:2 /W:2 /XJ /XD '.git' 'node_modules' '.next' 'dist' 'build' '.cache' /XF '.env' '.env.*' '*.log' /NFL /NDL /NP "/LOG:$log"
$rc = $LASTEXITCODE
if ($rc -ge 8) { throw "Falha no robocopy: $rc. Log: $log" }
$bundle = Join-Path $destino 'historico-git.bundle'
& $git -C $Origem bundle create $bundle --all
if ($LASTEXITCODE -ne 0) { throw 'Falha ao criar bundle.' }
& $git -C $Origem bundle verify $bundle | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Falha ao verificar bundle.' }
@("Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')", "Origem: $Origem", "Commit: $commit", "Destino: $destino", "Robocopy: $rc", 'Sincronizacao na nuvem: verificar no Google Drive.') | Set-Content -LiteralPath (Join-Path $destino 'manifesto.txt') -Encoding UTF8
Write-Host "Backup criado em H: $destino"
