@chcp 65001 && @echo off && setlocal enabledelayedexpansion
set "letra=%~d0" && set "letra=%letra:~0,1%" && set "local=%~dp0"
set "local=%local:~0,-1%" && set "arquivo=%~nx0"
set "usuario=%USERNAME%" && set "argTUDO=%~1 %~2 %~3 %~4 %~5" && set "arg1=%~1" && set "arg2=%~2" && set "arg3=%~3" && set "arg4=%~4" && set "arg5=%~5"

rem set "start=SIM"
rem set "adm=#" && NET SESSION >nul 2>&1
rem if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js && for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" && set "dia=!DATE:~0,2!" && set "mes=!DATE:~3,2!" && set "fileAll=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\z_MES_!mes!_DIA_!dia!.txt"

echo !TIME! - [SHUTDOWN PC] = [APÓS 1 MINUTO]>>"!fileAll!"

shutdown.exe /r /t 60

exit
exit