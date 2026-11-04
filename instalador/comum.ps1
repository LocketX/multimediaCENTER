# Funções compartilhadas pelo instalador e pelo desinstalador.
$Script:IdExtensao = 'nolejiicjfkpbomlimkgajgkagobhgck'
$Script:PastaBase  = Join-Path $env:LOCALAPPDATA 'multimediaCENTER'
$Script:PastaApp   = Join-Path $Script:PastaBase 'app'
$Script:PastaPerfil = Join-Path $Script:PastaBase 'perfil'
$Script:NomeAtalho = 'multimediaCENTER.lnk'

function Encontrar-Chrome {
    $candidatos = @(
        (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
        (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
        (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
    )
    foreach ($chave in @('HKLM:', 'HKCU:')) {
        $reg = Get-ItemProperty "$chave\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" -ErrorAction SilentlyContinue
        if ($reg -and $reg.'(default)') { $candidatos += $reg.'(default)' }
    }
    foreach ($c in $candidatos) { if ($c -and (Test-Path $c)) { return $c } }
    return $null
}

function Argumentos-Chrome {
    return "--user-data-dir=`"$Script:PastaPerfil`" --no-first-run --no-default-browser-check --disable-sync --start-fullscreen --app=chrome-extension://$Script:IdExtensao/inicio.html"
}

function Pastas-Atalhos {
    return @{
        AreaDeTrabalho = [Environment]::GetFolderPath('Desktop')
        MenuIniciar    = [Environment]::GetFolderPath('Programs')
        Inicializacao  = [Environment]::GetFolderPath('Startup')
    }
}

function Criar-Atalho($pasta, $chrome) {
    $shell = New-Object -ComObject WScript.Shell
    $atalho = $shell.CreateShortcut((Join-Path $pasta $Script:NomeAtalho))
    $atalho.TargetPath = $chrome
    $atalho.Arguments = Argumentos-Chrome
    $atalho.WorkingDirectory = $Script:PastaApp
    $atalho.IconLocation = (Join-Path $Script:PastaApp 'instalador\multimediacenter.ico') + ',0'
    $atalho.Description = 'Centro multimídia em tela cheia'
    $atalho.Save()
}

function Remover-Atalho($pasta) {
    $caminho = Join-Path $pasta $Script:NomeAtalho
    if (Test-Path $caminho) { Remove-Item $caminho -Force }
}

# A extensão já está carregada neste perfil, a partir da pasta instalada?
function Extensao-Carregada {
    $alvo = (Join-Path $Script:PastaApp 'extensao').TrimEnd('\')
    foreach ($arquivo in @('Secure Preferences', 'Preferences')) {
        $caminho = Join-Path $Script:PastaPerfil "Default\$arquivo"
        if (-not (Test-Path $caminho)) { continue }
        try {
            $json = Get-Content $caminho -Raw -Encoding UTF8 | ConvertFrom-Json
            $config = $json.extensions.settings.$Script:IdExtensao
            if ($config -and $config.path -and ($config.path.TrimEnd('\') -ieq $alvo)) { return $true }
        } catch { }
    }
    return $false
}
