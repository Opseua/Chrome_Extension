@chcp 65001 && @echo off && setlocal enabledelayedexpansion
set "letra=%~d0" && set "letra=%letra:~0,1%" && set "local=%~dp0"
set "local=%local:~0,-1%" && set "arquivo=%~nx0"
set "usuario=%USERNAME%" && set "argTUDO=%~1 %~2 %~3 %~4 %~5" && set "arg1=%~1" && set "arg2=%~2" && set "arg3=%~3" && set "arg4=%~4" && set "arg5=%~5"

set "start=SIM"
set "adm=#" && NET SESSION >nul 2>&1
if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js && for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" && set "dia=!DATE:~0,2!" && set "mes=!DATE:~3,2!" && set "fileAll=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\z_MES_!mes!_DIA_!dia!.txt"

echo !TIME! - [TASKMANAGER] [ADM-!adm!] # INICIOU #>>"!fileAll!"

set "search=ARQUIVOS\WINDOWS\BAT\RECORRENTES\SCRIPTS_EDITAR_AQUI\2_SCRIPT.bat"
set "outputFile=!TEMP!\logTaskManager.txt"
wmic process get Name,ProcessId,CommandLine /format:table>"!outputFile!"
>nul find "!search!" "!outputFile!" && (
	rem ENCONTROU [SIM]
	echo !TIME! - [TASKMANAGER] ENCONTROU [SIM]>>"!fileAll!"
	echo !TIME! - [TASKMANAGER] = [5 - WebSocket e Roteador]>>"!fileAll!"
	echo !timeNow!>"!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\logTime5.txt"
	) || (
	rem ENCONTROU [NAO]
	echo !TIME! - [TASKMANAGER] ENCONTROU [NAO]>>"!fileAll!"
	echo 123>"!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\logTime5.txt"
	
	start /B "" "C:\Program Files (x86)\full phat\Snarl\tools\heysnarl.exe" "notify?app-sig=app/a-sec-2&title=RECORRENTE&text=5 - WebSocket&icon=!letra!:\ARQUIVOS\WINDOWS\BAT\z_ICONES\notification_2.ico"

	rem INICIAR SCRIPTS
	"!letra!:\ARQUIVOS\PROJETOS\WebSocket\src\z_OutrosWebSocket\z_RestartAll.lnk"
	
	rem INICIAR LOOP DE SCRIPTS BAT
	"!letra!:\ARQUIVOS\WINDOWS\BAT\RECORRENTES\SCRIPTS_EDITAR_AQUI\1_BACKGROUND.exe"
	
	rem ESPERAR E INICIAR O CHROME EM BACKGROUND
	timeout 15 > nul
	echo | runas /noprofile /user:NOTEBOOK-Acer\Orlando "!letra!:\ARQUIVOS\WINDOWS\PORTABLE_Chrome\GoogleChromePortable.exe --no-startup-window"
	)
)

echo !TIME! - [TASKMANAGER] # FIM #>>"!fileAll!"


exit
exit






