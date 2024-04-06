@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" equ "" "!fileMsg!" "[!local!\!arquivo!]\n\nNao usar o BAT/BACKGROUND" & exit

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

"!fileLog!" [SHUTDOWN PC] = [APOS 1 MINUTO]

shutdown.exe /r /t 60
