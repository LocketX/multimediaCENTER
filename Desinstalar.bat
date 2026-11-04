@echo off
rem Remove o multimediaCENTER (atalhos, arquivos e, se quiser, os logins).
cd /d "%TEMP%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0instalador\desinstalar.ps1"
