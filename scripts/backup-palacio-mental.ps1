param(
    [string]$Origem = 'C:\projetos-natan-programação\palacio-mental',
    [string]$BaseDrive = 'H:\Meu Drive\1  NATAN\PROGRAMAÇÃO\1 MEUS APPS\palacio-mental',
    [switch]$VerificarSomente
)
$ErrorActionPreference = 'Stop'
$backupRoot = Join-Path $BaseDrive 'Backups do Aplicativo'
if (-not (Test-Path -LiteralPath $Origem -PathType Container)) { throw "Origem não encontrada: $Origem" }
if (-not (Test-Path -LiteralPath $BaseDrive -PathType Container)) { throw "Google Drive indisponível: $BaseDrive" }
$git = Get-Command git -ErrorAction Stop
$commit = (& $git.Source -C $Origem rev-parse --short HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or -not $commit) { throw 'Não foi possível identificar o commit.' }
$stamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$nome = "backup_${stamp}_${commit}"
$destino = Join-Path $backupRoot $nome
if ($VerificarSomente) {
    Write-Host "Origem: $Origem"
    Write-Host "Destino previsto: $destino"
    Write-Host "Commit: $commit"
    Write-Host 'Verificação concluída. Nenhuma cópia realizada.'
    return
}
New-Item -ItemType Directory -Path $destino -Force | Out-Null
$log = Join-Path $destino 'resultado-robocopy.log'
# /E inclui subpastas; não usamos /MIR nem /PURGE para nunca apagar backups.
# .git e caches não são copiados; o histórico completo vai no arquivo .bundle.
& robocopy $Origem (Join-Path $destino 'projeto') /E /R:2 /W:2 /XJ /XD '.git' 'node_modules' '.next' 'dist' 'build' '.cache' /XF '.env' '.env.*' '*.log' /NFL /NDL /NP /LOG:$log
$robocopyCode = $LASTEXITCODE
if ($robocopyCode -ge 8) { throw "Falha na cópia (robocopy: $robocopyCode). Consulte $log" }
$bundle = Join-Path $destino 'historico-git.bundle'
& $git.Source -C $Origem bundle create $bundle --all
if ($LASTEXITCODE -ne 0) { throw 'Falha ao gerar o histórico Git.' }
& $git.Source -C $Origem bundle verify $bundle | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Falha ao verificar o histórico Git.' }
$manifesto = @(
    "Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    "Origem: $Origem",
    "Commit: $commit",
    "Destino: $destino",
    "Robocopy: $robocopyCode",
    'Historico Git: historico-git.bundle',
    'Sincronização com a nuvem: confirmar no aplicativo Google Drive.'
)
$manifesto | Set-Content -LiteralPath (Join-Path $destino 'manifesto.txt') -Encoding UTF8
Write-Host "Backup local criado no Drive: $destino"
Write-Host 'Aguarde e confirme a sincronização do Google Drive antes de considerar o backup na nuvem concluído.'
