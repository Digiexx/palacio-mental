
$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent $PSScriptRoot
$log = Join-Path $PSScriptRoot 'backup-execucao.log'

# Caminho padrao do Google Drive
$drivePadrao = 'H:\Meu Drive\1  NATAN\PROGRAMAÇÃO\1 MEUS APPS\palacio-mental'

# Usa a variavel de ambiente quando disponivel;
# caso contrario, utiliza o caminho fixo.
$baseDrive = $env:PALACIO_DRIVE

if ([string]::IsNullOrWhiteSpace($baseDrive)) {
    $baseDrive = $drivePadrao
}

$mutex = New-Object System.Threading.Mutex(
    $false,
    'Local\PalacioMentalBackup'
)

$adquiriu = $false

try {
    $adquiriu = $mutex.WaitOne(0)

    if (-not $adquiriu) {
        "IGNORADO $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'): Backup ja em andamento." |
            Add-Content -LiteralPath $log
        return
    }

    "INICIO $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" |
        Add-Content -LiteralPath $log

    if (-not (Test-Path -LiteralPath $baseDrive -PathType Container)) {
        throw "Google Drive indisponivel: $baseDrive"
    }

    & (Join-Path $PSScriptRoot 'backup-palacio-mental-v2.ps1') `
        -Origem $repo `
        -BaseDrive $baseDrive *>> $log

    if ($LASTEXITCODE -ge 8) {
        throw "Falha no processo de backup."
    }

    "FIM $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" |
        Add-Content -LiteralPath $log
}
catch {
    "ERRO $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'): $_" |
        Add-Content -LiteralPath $log
}
finally {
    if ($adquiriu) {
        $mutex.ReleaseMutex()
    }

    $mutex.Dispose()
}
