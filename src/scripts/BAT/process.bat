@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4" & set "arg5=%~5" & set "arg6=%~6"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" == "" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nNENHUM PARAMETRO PASSADO"" & exit /b )

rem NET SESSION > nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a" & set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem ********************************************************************************************************************************************************

rem VARIAVEIS
set "ret2=AAA" & set "actionRun=ERRO" & set "action=!arg1!" & set "project=!arg2!" & set "outrosAdd=!arg3!" & set "mode=!arg4!" & set "programExe=!arg5!" & set "old=!arg6!"
if "!mode!" == "!mode:E=!" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nPARAMETROS INVALIDOS. Exemplo:\\n'mode' DEVE SER 'KEEP/LEGACY'"" & exit /b )
if "!mode!" == "RESTART_STOP" (
	"!fileProjetos!\!project!\src\z_OUTROS_!outrosAdd!\OFF.vbs" & exit /b
) else (
	if not "!mode!" == "RESTART" ( if "!mode!" == "KEEP" ( set "restartOnStop=RESTART" ) else ( set "restartOnStop=RESTART_STOP" ) )
)

rem DEFINIR programExe E programExePath
if not "!programExe!" == "!programExe:node=!" ( set "fpA=js" & set "fpB=NodeJS" ) else ( if "!programExe!" == "python" ( set "fpA=py" & set "fpB=Python" ) )
set "programExe=!programExe!!project!_!outrosAdd!" & set "fileScript=!fileProjetos!\!project!\src\!outrosAdd!.!fpA!" & set "programExePath=!fileWindows!\PORTABLE_!fpB!\!programExe!.exe"

rem CHECAR SE O programExe EXISTE
if not exist "!programExePath!" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nPROGRAM EXE NAO EXISTE\\n'!programExePath!'"" & exit /b )

rem DEFINIR SE ESTA RODANDO
if "!old!" == "" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nTRUE ou FALSE NAO INFORMADO"" & exit /b ) else ( set "ret2=!old!" )

rem rem DEFINIR ACAO → RODANDO [NAO] | RODANDO [SIM]
if not "!ret2!" == "!ret2:FALSE=!" ( if not "!action!" == "!action:TOGGLE=!" ( set "actionRun=ON" ) else ( if not "!action!" == "!action:ON=!" ( set "actionRun=ON" ) & goto IGNORE_IF_ACTION ) )
if "!ret2!" == "FALSE" ( if not "!action!" == "!action:TOGGLE=!" ( set "actionRun=ON" ) else ( if not "!action!" == "!action:ON=!" ( set "actionRun=ON" ) & goto IGNORE_IF_ACTION ) )
if "!ret2!" == "TRUE" ( if not "!action!" == "!action:TOGGLE=!" ( set "actionRun=OFF" ) else ( if not "!action!" == "!action:OFF=!" ( set "actionRun=OFF" ) & goto IGNORE_IF_ACTION ) )
:IGNORE_IF_ACTION

rem ACTION → NAO DEFINIDA (ENCERRAR)
if "!actionRun!" == "!actionRun:O=!" ( !fileLog! "[PROCESS] = [exe: EXIT - old: !ret2! - call: !mode! - act: !action! - run: !actionRun!] # !programExe!" & exit /b )

rem CHECAR A ULTIMA EXECUCAO (NAO SUBIR O 'findstr'!!!)
!fileLastRun! "!mode!_!action!" "!programExe!"
findstr /m "SIM" "!fileWindows!\BAT\z_log\logTime_!programExe!.txt" > nul
if not %ERRORLEVEL%==0 ( !fileLog! "[PROCESS] = [exe: NAO - old: !ret2! - call: !mode! - act: !action! - run: !actionRun!] # !programExe!" & exit /b )

rem ### → ACAO | PARAR [FORCADO] PILHA DE PROCESSOS
if "!actionRun!" == "OFF" (
	rem powershell.exe -Command "$a = @(); function getId { Param([int]$f); $global:a += $f; Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $f } | ForEach-Object { getId $_.ProcessId } }; $s = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'cmd.exe' -and $_.CommandLine -like '*!programExe!.exe*' } | Select-Object -ExpandProperty ProcessId; foreach ($i in $s) { getId $i }; foreach ($i in $a) { Stop-Process -Id $i }"
	if "!usuario!" == "Orlando" ( taskkill /F /FI "WINDOWTITLE eq Administrador:  CMD_!programExe!_CMD" /T ) else ( taskkill /F /FI "WINDOWTITLE eq Administrator:  CMD_!programExe!_CMD" /T )
)

rem ### → ACAO | INICIAR
if "!actionRun!" == "ON" (
	rem ALTERAR LOCAL DO TERMINAL
	cd /d !fileProjetos!\!project!

	if not "!action!" == "!action:HIDE=!" (
		rem [HIDE] OBRIGATORIO O '/RUNAS'!!!
		rem !3_BACKGROUND! /NOCONSOLE /RUNAS "cmd.exe /c title CMD_!programExe!_CMD& !programExePath! !fileScript! & ping -n 2 -w 1000 127.0.0.1 > nul & call !fileChrome_Extension!\src\scripts\BAT\process.bat !arg1! !arg2! !arg3! !restartOnStop! !arg5! !arg6!"
		!3_BACKGROUND! /NOCONSOLE /RUNAS "cmd.exe /c title CMD_!programExe!_CMD& !programExePath! !fileScript! & !3_BACKGROUND! /NOCONSOLE /DELAY=2 "cmd.exe /c echo a" & call !fileChrome_Extension!\src\scripts\BAT\process.bat !arg1! !arg2! !arg3! !restartOnStop! !arg5! !arg6!"
	) else (
		rem [VIEW] OBRIGATORIO O '/RUNAS'!!! | JANELA DO LOG POSICIONAR
		rem !3_BACKGROUND! /NOCONSOLE /RUNAS "cmd.exe /c title CMD_!programExe!_CMD& start "_!programExe!_" /WAIT !programExePath! !fileScript! & ping -n 2 -w 1000 127.0.0.1 > nul & call !fileChrome_Extension!\src\scripts\BAT\process.bat !arg1! !arg2! !arg3! !restartOnStop! !arg5! !arg6!" "cmd.exe /c ping -n 4 -w 1000 127.0.0.1 > nul & !fileNircmdSetSize! _!programExe!_ !action!"
		!3_BACKGROUND! /NOCONSOLE /RUNAS "cmd.exe /c title CMD_!programExe!_CMD& start "_!programExe!_" /WAIT !programExePath! !fileScript! & !3_BACKGROUND! /NOCONSOLE /DELAY=2 "cmd.exe /c echo a" & call !fileChrome_Extension!\src\scripts\BAT\process.bat !arg1! !arg2! !arg3! !restartOnStop! !arg5! !arg6!" "!3_BACKGROUND! /NOCONSOLE /DELAY=4 "cmd.exe /c !fileNircmdSetSize! _!programExe!_ !action! EXATO"
	)
)

rem LOG E RETORNAR O RESULTADO
!fileLog! "[PROCESS] = [exe: SIM - old: !ret2! - call: !mode! - act: !action! - run: !actionRun!] # !programExe!"

rem BAT2 - DEFINIR O VALOR E RETORNAR (USAR '%' NAS VARIAVEIS!!!)
endlocal & set "ret2=%ret2%" & setlocal enabledelayedexpansion & exit /b


