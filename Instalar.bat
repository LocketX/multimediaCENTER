@echo off
rem Instala o multimediaCENTER: copia para a pasta do usuario e cria atalhos.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0instalador\instalar.ps1"
pause
