@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" equ "" !fileMsg! "[!local!\!arquivo!]\n\nNao usar o BAT/BACKGROUND" & exit

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
rem set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem →→→ COMO USAR:
rem [GENTILMENTE] PROCESSO PAI E FILHOS → executavel:                    "!letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\scripts\BAT\processKill.bat" GRACEFULLY "nodeWebScraper_serverJucesp_New2.exe"
rem [FORCADO] PROCESSO PAI E FILHOS     → executavel:                    "!letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\scripts\BAT\processKill.bat" FORCE "nodeWebScraper_serverJucesp_New2.exe"
rem [FORCADO] PROCESSOS ENCONTRADOS     → comando de linha:              "!letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\scripts\BAT\processKill.bat" COMMAND_LINE "serverJucesp_New2.js"
rem [FORCADO] PROCESSOS ENCONTRADOS     → comando de linha + executavel: "!letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\scripts\BAT\processKill.bat" COMMAND_LINE "chrome.exe" "serverJucesp_New2.js"

rem ([GENTILMENTE] PROCESSO PAI E FILHOS → executavel)
if not "!arg1!"=="!arg1:GRACEFULLY=!" (
	!letra!:\ARQUIVOS\WINDOWS\BAT\processKillGracefully.exe "!arg2!"
)

rem ([FORCADO] PROCESSO PAI E FILHOS → executavel)
if not "!arg1!"=="!arg1:FORCE=!" (
	taskkill /F /T /IM "!arg2!"
)

rem ([FORCADO] PROCESSOS ENCONTRADOS/PAI E FILHOS → comando de linha/executavel)
if not "!arg1!"=="!arg1:COMMAND_LINE=!" (
	if "!arg3!"=="" (
		rem PELO COMANDO DE LINHA [PROCESSOS ENCONTRADOS]
		wmic Path win32_process Where "CommandLine Like '%%!arg2!%%'" Call Terminate > nul
	) else (
		rem PELO EXECUTAVEL + COMANDO DE LINHA [PAI E FILHOS]
		for /f "usebackq tokens=*" %%i in (`powershell -Command "Get-WmiObject Win32_Process -Filter 'name = ''!arg2!''' | Where-Object { $_.CommandLine -like '*!arg3!*' } | ForEach-Object { $_.ProcessId }"`) do (
			taskkill /F /T /PID %%i
			goto :LOOP_EXIT
		)
	)
)
:LOOP_EXIT


