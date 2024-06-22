@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" equ "" !fileMsg! "[!local!\!arquivo!]\n\nNao usar o BAT/BACKGROUND" & exit

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem VARIAVEIS ('restartOnStop' NAO E USADO NO PM2 PORQUE E IMPOSSIVEL SABER QUANDO O SCRIPT PAROU DE RODAR)
set "ret2=ERRO" & set "actionRun=ERRO" & set "winTP=15 65 500 300" & set "action=!arg1!" & set "fileScript=!arg3!" & set "mode=!arg4!" & set "fileScriptProcess=!fileScript:\=\\!"
for /f "tokens=1,2 delims=@" %%a in ("!arg2!") do ( set "project=%%a" & set "outrosAdd=%%b" ) & if not "!mode!"=="!mode:RESTART_STOP=!" ( exit )
if not "!mode!"=="!mode:LEGACY=!" ( set "restartOnStop=RESTART_STOP" ) else ( set "restartOnStop=RESTART" )

rem CHECAR SE O nodeExe EXISTE
set "nodeExe=node!project!_!outrosAdd!"
if not exist "!letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\!nodeExe!.exe" !fileMsg! "[!local!\!arquivo!] Executavel nodeExe nao existe\n!nodeExe!.exe" & exit

rem PATH COMPLETO DO SCRIPT SEM BARRA E DOIS PONTOS
set "replace=-"
set "fileScriptFullWithBars=!fileScript::=%replace%!" && set "fileScriptFullWithBars=!fileScriptFullWithBars:\=%replace%!"
set "fileScriptFullWithBars=!project!_!fileScriptFullWithBars!"

rem CHECAR SE ESTA RODANDO
tasklist /fi "ImageName eq !nodeExe!.exe" /fo csv 2>NUL | find /I "!nodeExe!.exe">NUL
if "%ERRORLEVEL%"=="0"  ( set "ret2=TRUE" ) else ( set "ret2=FALSE" )

rem rem DEFINIR ACAO → RODANDO [NAO] | RODANDO [SIM]
if "!ret2!"=="FALSE" (
	if not "!action!"=="!action:ON=!" ( set "actionRun=ON" )
	if not "!action!"=="!action:TOGGLE=!" ( set "actionRun=ON" ) 
)
if "!ret2!"=="TRUE" (
	if not "!action!"=="!action:OFF=!" ( set "actionRun=OFF" )
	if not "!action!"=="!action:TOGGLE=!" ( set "actionRun=OFF" )
)

rem ACTION → NAO DEFINIDA (ENCERRAR)
if "!actionRun!"=="ERRO" !fileLog! "[NODEJS FILE] = [EXE: EXIT - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!" & exit

rem CHECAR A ULTIMA EXECUCAO (NAO SUBIR O 'findstr'!!!)
!fileLastRun! "!mode!_!action!" "!nodeExe!"
findstr /m "SIM" "!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\logTime_!nodeExe!.txt" >Nul
if not %errorlevel%==0 !fileLog! "[NODEJS FILE] = [EXE: NAO - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!" & exit 

rem ### → ACAO | PARAR
if "!actionRun!"=="OFF" wmic Path win32_process Where "CommandLine Like '%%!fileScriptProcess!%%'" Call Terminate > nul

rem ### → ACAO | INICIAR
if "!actionRun!"=="ON" (
	rem [HIDE]
	if not "!action!"=="!action:HIDE=!" (
		!2_BACKGROUND! title !fileScriptFullWithBars!#1# !letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\!nodeExe!.exe !fileScript! #1# !fileChrome_Extension!\src\scripts\BAT\processCmdKeep.bat !action! !project!@!outrosAdd! !fileScript! !restartOnStop!
	)
	
	rem [VIEW]
	if not "!action!"=="!action:VIEW=!" ( 
		!2_BACKGROUND! start "!fileScriptFullWithBars!" /WAIT !letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\!nodeExe!.exe !fileScript! #1# !2_BACKGROUND! !fileChrome_Extension!\src\scripts\BAT\processCmdKeep.bat !action! !project!@!outrosAdd! !fileScript! !restartOnStop!
		
		rem JANELA DO LOG POSICIONAR
		!2_BACKGROUND! timeout 3 #2# nul #1# !fileNircmdSetSize! !fileScriptFullWithBars! !action!
	)
)

rem LOG E RETORNAR O RESULTADO
!fileLog! "[NODEJS FILE] = [EXE: SIM - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!"
rem BAT2 - DEFINIR O VALOR E RETORNAR (USAR '%' NAS VARIAVEIS!!!)
endlocal & set "ret2=%ret2%" & setlocal enabledelayedexpansion & exit /b























