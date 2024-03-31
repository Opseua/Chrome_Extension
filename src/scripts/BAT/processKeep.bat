@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "letra=%letra:~0,1%" & set "local=%~dp0"
set "local=%local:~0,-1%" & set "arquivo=%~nx0"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4"

rem set "start=SIM"
rem set "adm=#" && NET SESSION >nul 2>&1
rem if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!" & set "fileAll=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\z_MES_!mes!_DIA_!dia!.txt"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!"=="" ( msg * "[processKeep.bat] Usar o atalho e nao o executavel" & exit )

rem VARIAVEIS
set "ret2=ERRO" & set "actionRun=ERRO" & set "winTP=15 65 500 300" & set "action=!arg1!" & set "fileScript=!arg3!" & set "fileScriptProcess=!fileScript:\=\\!"
for /f "tokens=1,2 delims=@" %%a in ("!arg2!") do ( set "project=%%a" & set "outrosAdd=%%b" )

rem CHECAR SE O nodeExe EXISTE
set "nodeExe=node!project!_!outrosAdd!"
if not exist "!letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\!nodeExe!.exe" ( msg * "[processKeep.bat] Executavel nodeExe nao existe → !nodeExe!.exe" & exit )

rem PATH COMPLETO DO SCRIPT SEM BARRA E DOIS PONTOS
set "replace=-"
set "fileScriptFullWithBars=!fileScript::=%replace%!" && set "fileScriptFullWithBars=!fileScriptFullWithBars:\=%replace%!"
set "fileScriptFullWithBars=!project!_!fileScriptFullWithBars!"

rem CHECAR SE ESTA RODANDO
tasklist | findstr /i "!nodeExe!" >nul
if not !errorlevel! equ 0 ( set "ret2=FALSE" ) else ( set "ret2=TRUE" )

rem rem DEFINIR ACAO → RODANDO [NAO] | RODANDO [SIM]
if "!ret2!"=="FALSE" (
	if not "!action!"=="!action:ON=!" ( set "actionRun=ON" )
	if not "!action!"=="!action:TOGGLE=!" ( set "actionRun=ON" ) 
)
if "!ret2!"=="TRUE" (
	if not "!action!"=="!action:OFF=!" ( set "actionRun=OFF" )
	if not "!action!"=="!action:TOGGLE=!" ( set "actionRun=OFF" )
)

rem TESTES!!!
rem msg * "[processKeep.bat] action: !action! - actionRun: !actionRun! - ret2: !ret2! - fileScript: !fileScript!" & exit

rem ACTION → NAO DEFINIDA (ENCERRAR)
if "!actionRun!"=="ERRO" (
	echo !TIME! - [NODEJS FILE 2] = [EXE: EXIT - ANTES: !ret2! - CALL: !arg4! - ACTION: !action! - ACTION_RUN: !actionRun!] # !fileScriptFullWithBars!>>!fileAll! & exit
)

rem CHECAR A ULTIMA EXECUCAO (NAO SUBIR O 'echo !timeNow!>!file!' !!!)
set "file=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\logTime!project!!outrosAdd!.txt" & if not exist "!file!" ( set "timeLast=123" ) else ( set /p timeLast=<!file! )
set /a "dif=timeNow - timeLast"
if "!arg4!"=="SCRIPT" (
	if not "!action!"=="!action:TOGGLE=!" ( if not !dif! geq 7 ( echo !TIME! - [NODEJS FILE 2] = [EXE: NAO - ANTES: !ret2! - CALL: !arg4! - ACTION: !action! - ACTION_RUN: !actionRun!] # !fileScriptFullWithBars!>>!fileAll! & exit ) )	
)
echo !timeNow!>!file!

rem ### → ACAO | PARAR
rem if "!actionRun!"=="OFF" ( taskkill /F /FI "WindowTitle eq Administrador:  !fileScriptFullWithBars!" /T )
rem if "!actionRun!"=="OFF" ( powershell -Command "(Get-WmiObject Win32_Process | where {$_.CommandLine -like '*!fileScript!*'}).Terminate()" )
if "!actionRun!"=="OFF" ( wmic Path win32_process Where "CommandLine Like '%%!fileScriptProcess!%%'" Call Terminate > nul )

rem ### → ACAO | INICIAR
if "!actionRun!"=="ON" (
	rem [HIDE]
	if not "!action!"=="!action:HIDE=!" (
		rem !1_BACKGROUND! "title !fileScriptFullWithBars!& !letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\!nodeExe!.exe !fileScript! & !letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\scripts\BAT\processKeep.bat !action! !project!@!outrosAdd! !fileScript! REBOOT"
		"D:\ARQUIVOS\WINDOWS\BAT\RUN_PORTABLE\2_BACKGROUND.exe" title !fileScriptFullWithBars!#1# !letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\!nodeExe!.exe !fileScript! #1# !letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\scripts\BAT\processKeep.bat !action! !project!@!outrosAdd! !fileScript! REBOOT
	)
	
	rem [VIEW]
	if not "!action!"=="!action:VIEW=!" ( 
		rem start cmd.exe /c "title !fileScriptFullWithBars!& !letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\!nodeExe!.exe !fileScript! & !letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\scripts\BAT\processKeep.bat !action! !project!@!outrosAdd! !fileScript! REBOOT"
		"D:\ARQUIVOS\WINDOWS\BAT\RUN_PORTABLE\2_BACKGROUND.exe" start "!fileScriptFullWithBars!" /WAIT !letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\!nodeExe!.exe !fileScript! #1# start cmd.exe /c !letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\scripts\BAT\processKeep.bat !action! !project!@!outrosAdd! !fileScript! REBOOT
		if "!letra!"=="D" (
			rem OPSEUA
			if not "!action!"=="!action:WINTP1=!" ( set "winTP=15 65 500 300" )
			if not "!action!"=="!action:WINTP2=!" ( set "winTP=15 380 500 300" )
			if not "!action!"=="!action:WINTP3=!" ( set "winTP=15 695 500 300" )
			if not "!action!"=="!action:WINTP4=!" ( set "winTP=520 65 500 300" )
			if not "!action!"=="!action:WINTP5=!" ( set "winTP=520 380 500 300" )
			if not "!action!"=="!action:WINTP6=!" ( set "winTP=520 695 500 300" )
		) else (
			rem EC2/AWS/ESTRELAR
			if not "!action!"=="!action:WINTP1=!" ( set "winTP=15 50 410 300" )
			if not "!action!"=="!action:WINTP2=!" ( set "winTP=15 350 410 300" )
			if not "!action!"=="!action:WINTP3=!" ( set "winTP=15 650 410 300" )
			if not "!action!"=="!action:WINTP4=!" ( set "winTP=420 50 410 300" )
			if not "!action!"=="!action:WINTP5=!" ( set "winTP=420 350 410 300" )
			if not "!action!"=="!action:WINTP6=!" ( set "winTP=420 650 410 300" )
		)
		rem JANELA DO LOG POSICIONAR
		!1_BACKGROUND! "timeout 3 > nul & !nircmd! win setsize ititle !fileScriptFullWithBars! !winTP!"
	)
)

rem LOG E RETORNAR O RESULTADO
echo !TIME! - [NODEJS FILE 2] = [EXE: SIM - ANTES: !ret2! - CALL: !arg4! - ACTION: !action! - ACTION_RUN: !actionRun!] # !fileScriptFullWithBars!>>!fileAll!
endlocal & set "ret2=%ret2%"
exit /b












