@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4" & set "arg5=%~5" & set "arg6=%~6"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!"=="" ( !fileMsg! "[!local!\!arquivo!]\\n\\nNao usar o BAT/BACKGROUND" & exit /b )

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION > nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
rem set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem ********************************************************************************************************************************************************

rem VARIAVEIS
set "ret2=ERRO" & set "actionRun=ERRO" & set "winTP=15 65 500 300" & set "action=!arg1!" & set "fileScript=!arg3!" & set "mode=!arg4!" & set "programExe=ERRO" & set "programExePath=ERRO" 
for /f "tokens=1,2 delims=@" %%a in ("!arg2!") do ( set "project=%%a" & set "outrosAdd=%%b" ) & if not "!mode!"=="!mode:RESTART_STOP=!" ( !fileProjetos!\!project!\src\z_Outros_!outrosAdd!\OFF.vbs & exit )
	
if not "!mode!"=="!mode:LEGACY=!" ( set "restartOnStop=RESTART_STOP" ) else ( set "restartOnStop=RESTART" )

rem DEFINIR programExe E programExePath | MUDAR LOCAL DO TERMINAL
if "!arg5!"=="node" ( set "fileScript=!fileScript!.js" & set "programExePath=!fileWindows!\PORTABLE_NodeJS" )
if "!arg5!"=="python" ( set "fileScript=!fileScript!.py" & set "programExePath=!fileWindows!\PORTABLE_Python" )
if "!programExePath!"=="ERRO" ( !fileMsg! "[!local!\!arquivo!]\\n\\nprogramExe deve ser'node' ou 'python'" & exit /b)
set "programExe=!arg5!!project!_!outrosAdd!" & cd /d !fileProjetos!\!project!

rem CHECAR SE O programExe EXISTE
if not exist "!programExePath!\!programExe!.exe" ( !fileMsg! "[!local!\!arquivo!]\\n\\nprogramExe nao existe\n\n!programExe!.exe" & exit /b )

rem PATH COMPLETO DO SCRIPT SEM BARRA E DOIS PONTOS
set "replace=-"
set "fileScriptFullWithBars=!fileScript::=%replace%!" & set "fileScriptFullWithBars=!fileScriptFullWithBars:\=%replace%!"
set "fileScriptFullWithBars=!project!_!fileScriptFullWithBars!"

rem NAO CHECAR NOVAMENTE SE ESTA RODANDO (PORQUE O '2_SCRIPT' JA PASSOU O RETORNO)
if not "!arg6!"=="!arg6:E=!" ( set "ret2=!arg6!" & goto IGNORE_IS_RUNNING )

rem CHECAR SE ESTA RODANDO
tasklist /fi "ImageName eq !programExe!.exe" /fo csv 2> nul | find /I "!programExe!.exe" > nul
if "%ERRORLEVEL%"=="0" ( set "ret2=TRUE" ) else ( set "ret2=FALSE" )
:IGNORE_IS_RUNNING

rem rem DEFINIR ACAO → RODANDO [NAO] | RODANDO [SIM]
if "!ret2!"=="FALSE" ( if not "!action!"=="!action:TOGGLE=!" ( set "actionRun=ON" ) else ( if not "!action!"=="!action:ON=!" ( set "actionRun=ON" ) & goto IGNORE_IF ) )
if "!ret2!"=="TRUE" ( if not "!action!"=="!action:TOGGLE=!" ( set "actionRun=OFF" ) else ( if not "!action!"=="!action:OFF=!" ( set "actionRun=OFF" ) & goto IGNORE_IF ) )
:IGNORE_IF

rem ACTION → NAO DEFINIDA (ENCERRAR)
if "!actionRun!"=="ERRO" ( !fileLog! "[!arg5!] = [EXE: EXIT - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!" & exit /b )

rem CHECAR A ULTIMA EXECUCAO (NAO SUBIR O 'findstr'!!!)
!fileLastRun! "!mode!_!action!" "!programExe!"
findstr /m "SIM" "!fileWindows!\BAT\z_log\logTime_!programExe!.txt" > nul
if not %errorlevel%==0 ( !fileLog! "[!arg5!] = [EXE: NAO - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!" & exit /b )

rem ### → ACAO | PARAR [FORCADO] PILHA DE PROCESSOS
if "!actionRun!"=="OFF" ( 
	rem powershell.exe -Command "$a = @(); function getId { Param([int]$f); $global:a += $f; Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $f } | ForEach-Object { getId $_.ProcessId } }; $s = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'cmd.exe' -and $_.CommandLine -like '*!programExe!.exe*' } | Select-Object -ExpandProperty ProcessId; foreach ($i in $s) { getId $i }; foreach ($i in $a) { Stop-Process -Id $i }"
	if "!usuario!"=="Orlando" ( taskkill /F /FI "WINDOWTITLE eq Administrador:  CMD_!fileScriptFullWithBars!" /T ) else (  taskkill /F /FI "WINDOWTITLE eq Administrator:  CMD_!fileScriptFullWithBars!" /T )
)

rem ### → ACAO | INICIAR
if "!actionRun!"=="ON" (
	if not "!action!"=="!action:HIDE=!" (
		rem [HIDE]
		rem !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !programExePath!\!programExe!.exe !fileScript! & ping -n 2 -w 1000 127.0.0.1 > nul & call !fileChrome_Extension!\src\scripts\BAT\processCmdKeep.bat !arg1! !arg2! !arg3! !restartOnStop! !arg5! !arg6!"
		rem OBRIGATORIO O '/RUNAS'!!!
		!3_BACKGROUND! /NOCONSOLE /RUNAS "cmd.exe /c title CMD_!fileScriptFullWithBars!& !programExePath!\!programExe!.exe !fileScript! & ping -n 2 -w 1000 127.0.0.1 > nul & call !fileChrome_Extension!\src\scripts\BAT\processCmdKeep.bat !arg1! !arg2! !arg3! !restartOnStop! !arg5! !arg6!"
	) else (
		rem [VIEW]
		rem !3_BACKGROUND! /NOCONSOLE "cmd.exe /c start "!fileScriptFullWithBars!" /WAIT !programExePath!\!programExe!.exe !fileScript! & ping -n 2 -w 1000 127.0.0.1 > nul & call !fileChrome_Extension!\src\scripts\BAT\processCmdKeep.bat !arg1! !arg2! !arg3! !restartOnStop! !arg5! !arg6!"
		rem OBRIGATORIO O '/RUNAS'!!!
		!3_BACKGROUND! /NOCONSOLE /RUNAS "cmd.exe /c title CMD_!fileScriptFullWithBars!& start "!fileScriptFullWithBars!" /WAIT !programExePath!\!programExe!.exe !fileScript! & ping -n 2 -w 1000 127.0.0.1 > nul & call !fileChrome_Extension!\src\scripts\BAT\processCmdKeep.bat !arg1! !arg2! !arg3! !restartOnStop! !arg5! !arg6!"

		rem JANELA DO LOG POSICIONAR
		!3_BACKGROUND! /NOCONSOLE "cmd.exe /c ping -n 4 -w 1000 127.0.0.1 > nul & !fileNircmdSetSize! "!fileScriptFullWithBars!" "!action!""
	)
)

rem LOG E RETORNAR O RESULTADO
!fileLog! "[!arg5!] = [EXE: SIM - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!"
rem BAT2 - DEFINIR O VALOR E RETORNAR (USAR '%' NAS VARIAVEIS!!!)

endlocal & set "ret2=%ret2%" & setlocal enabledelayedexpansion & exit /b


