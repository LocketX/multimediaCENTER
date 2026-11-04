# Instalador do multimediaCENTER: copia o app para a pasta do usuário,
# cria atalhos e, se você quiser, abre junto com o Windows.
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'comum.ps1')

Write-Host ''
Write-Host '  Instalador do multimediaCENTER' -ForegroundColor Cyan
Write-Host '  ------------------------------'
Write-Host ''

$chrome = Encontrar-Chrome
if (-not $chrome) {
    Write-Host '  O Google Chrome não foi encontrado.' -ForegroundColor Red
    Write-Host '  Instale em https://www.google.com/chrome/ e rode o instalador de novo.'
    exit 1
}
Write-Host "  Chrome encontrado: $chrome"

# 1. Copia os arquivos do app (o perfil, com seus logins, não é tocado).
$origem = Split-Path -Parent $PSScriptRoot
if ((Resolve-Path $origem).Path.TrimEnd('\') -ieq $Script:PastaApp.TrimEnd('\')) {
    Write-Host '  Rodando a partir da pasta já instalada; os arquivos ficam como estão.'
} else {
    New-Item -ItemType Directory -Force -Path $Script:PastaBase | Out-Null
    if (Test-Path $Script:PastaApp) { Remove-Item $Script:PastaApp -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $Script:PastaApp | Out-Null
    foreach ($item in @('extensao', 'instalador', 'docs', 'README.md', 'MultimediaCenter.bat', 'Configurar.bat', 'Desinstalar.bat')) {
        $caminho = Join-Path $origem $item
        if (Test-Path $caminho) { Copy-Item $caminho -Destination $Script:PastaApp -Recurse -Force }
    }
    Write-Host "  Arquivos copiados para $Script:PastaApp"
}

# 2. Atalhos na Área de Trabalho e no Menu Iniciar.
$pastas = Pastas-Atalhos
Criar-Atalho $pastas.AreaDeTrabalho $chrome
Criar-Atalho $pastas.MenuIniciar $chrome
Write-Host '  Atalhos criados na Área de Trabalho e no Menu Iniciar.'

# 3. Abrir junto com o Windows?
$resposta = Read-Host '  Abrir o multimediaCENTER sempre que o Windows iniciar? (S/N)'
if ($resposta -match '^[sSyY]') {
    Criar-Atalho $pastas.Inicializacao $chrome
    Write-Host '  Pronto: ele vai abrir junto com o Windows.'
} else {
    Remover-Atalho $pastas.Inicializacao
    Write-Host '  Ok: ele não vai abrir sozinho. Rode o instalador de novo para mudar.'
}

# 4. Carregar a extensão no perfil, se ainda não estiver carregada.
if (Extensao-Carregada) {
    Write-Host ''
    Write-Host '  A extensão já está carregada. Tudo pronto!' -ForegroundColor Green
    Write-Host '  Abra o multimediaCENTER pelo atalho da Área de Trabalho.'
    exit 0
}

$pastaExtensao = Join-Path $Script:PastaApp 'extensao'
try { Set-Clipboard -Value $pastaExtensao } catch { }
Write-Host ''
Write-Host '  Falta um passo, feito só uma vez:' -ForegroundColor Yellow
Write-Host '  1. Na janela do Chrome que vai abrir, ative o "Modo do desenvolvedor" (canto superior direito).'
Write-Host '     Se a página de extensões não abrir, digite chrome://extensions na barra de endereço.'
Write-Host '  2. Se já houver uma extensão multimediaCENTER antiga na lista, clique em "Remover" nela.'
Write-Host '  3. Clique em "Carregar sem compactação" e escolha esta pasta (o caminho já foi copiado,'
Write-Host '     é só colar com Ctrl+V na barra de endereço da janela):'
Write-Host "        $pastaExtensao" -ForegroundColor Cyan
Write-Host '  4. Feche o Chrome e abra o multimediaCENTER pelo atalho da Área de Trabalho.'
Write-Host ''
Start-Process -FilePath $chrome -ArgumentList "--user-data-dir=`"$Script:PastaPerfil`" --no-first-run --no-default-browser-check chrome://extensions"
