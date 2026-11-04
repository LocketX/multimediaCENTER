@echo off
rem Configuracao de primeira vez: carrega a extensao no perfil do multimediaCENTER.
setlocal
set "CHROME="
for %%P in ("%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%LocalAppData%\Google\Chrome\Application\chrome.exe") do (
  if not defined CHROME if exist %%P set "CHROME=%%~P"
)
if not defined CHROME (
  echo Google Chrome nao encontrado. Instale em https://www.google.com/chrome/
  pause
  exit /b 1
)
set "PERFIL=%LocalAppData%\multimediaCENTER\perfil"
echo.
echo  Configuracao do multimediaCENTER (so precisa fazer uma vez)
echo  ------------------------------------------------------------
echo  1. Na janela do Chrome que vai abrir, ative o "Modo do desenvolvedor"
echo     (canto superior direito). Se a pagina de extensoes nao abrir,
echo     digite chrome://extensions na barra de endereco.
echo  2. Clique em "Carregar sem compactacao" e escolha esta pasta:
echo        %~dp0extensao
echo  3. Feche o Chrome e abra o MultimediaCenter.bat
echo.
start "" "%CHROME%" --user-data-dir="%PERFIL%" --no-first-run --no-default-browser-check chrome://extensions
pause
