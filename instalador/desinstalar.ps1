# Desinstalador do multimediaCENTER: remove atalhos e arquivos do app.
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'comum.ps1')

Write-Host ''
Write-Host '  Desinstalar o multimediaCENTER' -ForegroundColor Cyan
Write-Host ''
$confirma = Read-Host '  Tem certeza? (S/N)'
if ($confirma -notmatch '^[sSyY]') { Write-Host '  Nada foi removido.'; exit 0 }

$pastas = Pastas-Atalhos
foreach ($p in $pastas.Values) { Remover-Atalho $p }
Write-Host '  Atalhos removidos.'

$apagarPerfil = Read-Host '  Apagar também seus logins e preferências do multimediaCENTER? (S/N)'

# A pasta do app é apagada depois que este script termina, porque ele roda de dentro dela.
$alvos = @("`"$Script:PastaApp`"")
if ($apagarPerfil -match '^[sSyY]') { $alvos += "`"$Script:PastaPerfil`"" }
$comando = "ping -n 4 127.0.0.1 >nul & rmdir /s /q " + ($alvos -join ' & rmdir /s /q ')
Write-Host '  Pronto: o multimediaCENTER foi removido.' -ForegroundColor Green
Read-Host '  Aperte Enter para fechar' | Out-Null
Start-Process -FilePath 'cmd.exe' -ArgumentList "/c $comando" -WindowStyle Hidden -WorkingDirectory $env:TEMP
