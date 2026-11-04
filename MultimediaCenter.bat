@echo off
rem Abre o multimediaCENTER no Google Chrome, em tela cheia, num perfil so dele.
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
start "" "%CHROME%" --user-data-dir="%PERFIL%" --no-first-run --no-default-browser-check --disable-sync --start-fullscreen --app=chrome-extension://nolejiicjfkpbomlimkgajgkagobhgck/inicio.html
