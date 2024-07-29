@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4" & set "arg5=%~5" & set "arg6=%~6"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" equ "" !fileMsg! "[!local!\!arquivo!]\n\nNao usar o BAT/BACKGROUND" & exit /b

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem VARIAVEIS
set "ret2=ERRO" & set "actionRun=ERRO" & set "winTP=15 65 500 300" & set "action=!arg1!" & set "fileScript=!arg3!" & set "mode=!arg4!" & set "programExe=ERRO" & set "programExePath=ERRO" 
for /f "tokens=1,2 delims=@" %%a in ("!arg2!") do ( set "project=%%a" & set "outrosAdd=%%b" ) & if not "!mode!"=="!mode:RESTART_STOP=!" ( exit /b )
if not "!mode!"=="!mode:LEGACY=!" ( set "restartOnStop=RESTART_STOP" ) else ( set "restartOnStop=RESTART" )

rem DEFINIR programExe E programExePath
if "!arg5!"=="node" ( set "fileScript=!fileScript!.js" & set "programExePath=!letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS" )
if "!arg5!"=="python" ( set "fileScript=!fileScript!.py" & set "programExePath=!letra!:\ARQUIVOS\WINDOWS\PORTABLE_Python" )
if "!programExePath!"=="ERRO" ( !fileMsg! "[!local!\!arquivo!]\n\nprogramExe deve ser'node' ou 'python'" & exit /b )
set "programExe=!arg5!!project!_!outrosAdd!"

rem CHECAR SE O programExe EXISTE
if not exist "!programExePath!\!programExe!.exe" !fileMsg! "[!local!\!arquivo!]\n\nprogramExe nao existe\n\n!programExe!.exe" & exit /b

rem PATH COMPLETO DO SCRIPT SEM BARRA E DOIS PONTOS
set "replace=-"
set "fileScriptFullWithBars=!fileScript::=%replace%!" & set "fileScriptFullWithBars=!fileScriptFullWithBars:\=%replace%!"
set "fileScriptFullWithBars=!project!_!fileScriptFullWithBars!"

rem NAO CHECAR NOVAMENTE SE ESTA RODANDO (PORQUE O '2_SCRIPT' JA PASSOU O RETORNO)
if "!arg6!"=="FALSE" ( set "ret2=FALSE" & goto :IGNORE_IS_RUNNING ) else ( if "!arg6!"=="TRUE" ( set "ret2=TRUE" & goto :IGNORE_IS_RUNNING ) )

rem CHECAR SE ESTA RODANDO
tasklist /fi "ImageName eq !programExe!.exe" /fo csv 2>NUL | find /I "!programExe!.exe">NUL
if "%ERRORLEVEL%"=="0"  ( set "ret2=TRUE" ) else ( set "ret2=FALSE" )
:IGNORE_IS_RUNNING

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
if "!actionRun!"=="ERRO" ( !fileLog! "[!arg5!] = [EXE: EXIT - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!" & exit /b )

rem CHECAR A ULTIMA EXECUCAO (NAO SUBIR O 'findstr'!!!)
!fileLastRun! "!mode!_!action!" "!programExe!"
findstr /m "SIM" "!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\logTime_!programExe!.txt" >Nul
if not %errorlevel%==0 !fileLog! "[!arg5!] = [EXE: NAO - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!" & exit /b 

rem ### → ACAO | PARAR [FORCADO] PILHA DE PROCESSOS
if "!actionRun!"=="OFF" ( 
	powershell.exe -Command "$a = @(); function getId { Param([int]$f); $global:a += $f; Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $f } | ForEach-Object { getId $_.ProcessId } }; $s = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'cmd.exe' -and $_.CommandLine -like '*!programExe!.exe*' } | Select-Object -ExpandProperty ProcessId; foreach ($i in $s) { getId $i }; foreach ($i in $a) { Stop-Process -Id $i }"
)
:LOOP_EXIT

rem ### → ACAO | INICIAR
if "!actionRun!"=="ON" (
	rem [HIDE]
	if not "!action!"=="!action:HIDE=!" (
		!2_BACKGROUND! "title !fileScriptFullWithBars!& !programExePath!\!programExe!.exe !fileScript! & ping 127.0.0.1 -n 2 > nul & !fileChrome_Extension!\src\scripts\BAT\processCmdKeep.bat !arg1! !arg2! !arg3! !restartOnStop! !arg5! !arg6!"
	)
	
	rem [VIEW]
	if not "!action!"=="!action:VIEW=!" (
		!2_BACKGROUND! "start #1#!fileScriptFullWithBars!#1# /WAIT !programExePath!\!programExe!.exe !fileScript! & !2_BACKGROUND! #1#ping 127.0.0.1 -n 2 > nul & !fileChrome_Extension!\src\scripts\BAT\processCmdKeep.bat !arg1! !arg2! !arg3! !restartOnStop! !arg5! !arg6!#1#"
		
		rem JANELA DO LOG POSICIONAR
		!2_BACKGROUND! "timeout 3 > nul & !fileNircmdSetSize! !fileScriptFullWithBars! !action!"
	)
)

rem LOG E RETORNAR O RESULTADO
!fileLog! "[!arg5!] = [EXE: SIM - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!"
rem BAT2 - DEFINIR O VALOR E RETORNAR (USAR '%' NAS VARIAVEIS!!!)

endlocal & set "ret2=%ret2%" & setlocal enabledelayedexpansion & exit /b























