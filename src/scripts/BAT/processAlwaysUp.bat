@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" equ "" "!fileMsg!" "[!local!\!arquivo!]\n\nNao usar o BAT/BACKGROUND" & exit

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem VARIAVEIS
set "ret2=ERRO" & set "actionRun=ERRO" & set "winTP=15 65 500 300" & set "action=!arg1!" & set "fileScript=!arg3!" & set "mode=!arg4!" & set "fileScriptProcess=!fileScript:\=\\!"
for /f "tokens=1,2 delims=@" %%a in ("!arg2!") do ( set "project=%%a" & set "outrosAdd=%%b" ) & if not "!mode!"=="!mode:RESTART_STOP=!" ( exit )
if not "!mode!"=="!mode:LEGACY=!" ( set "restartOnStop=RESTART_STOP" ) else ( set "restartOnStop=RESTART" )

rem DEFINIR nodeExe
set "nodeExe=node!project!_!outrosAdd!"

rem PATH COMPLETO DO SCRIPT SEM BARRA E DOIS PONTOS
set "replace=-"
set "fileScriptFullWithBars=!fileScript::=%replace%!" && set "fileScriptFullWithBars=!fileScriptFullWithBars:\=%replace%!"
set "fileScriptFullWithBars=!project!_!fileScriptFullWithBars!"

rem CHECAR SE ESTA RODANDO
set "url=http://127.0.0.1:9999/api/get-status?password=c590ad16d9f928fc1b75b88adf5bb7eb&application=!nodeExe!"
set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
set "bodyPathRes=!local!\z_BODY_RES.txt" & "!wget!" "!headers!" --quiet -O "!bodyPathRes!" "!url!"

rem DEFINIR STATUS DO PROCESSO
set "ret2=ERRO"
findstr /m "Running" "!bodyPathRes!" >Nul
if !errorlevel! equ 0 ( set "ret2=TRUE" )
findstr /m "Restarting" "!bodyPathRes!" >Nul
if !errorlevel! equ 0 ( set "ret2=TRUE" )
findstr /m "Stopping" "!bodyPathRes!" >Nul
if !errorlevel! equ 0 ( set "ret2=FALSE" )
findstr /m "Stopped" "!bodyPathRes!" >Nul
if !errorlevel! equ 0 ( set "ret2=FALSE" )
del /f !bodyPathRes!

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
if "!actionRun!"=="ERRO" (
	"!fileLog!" "[NODEJS FILE] = [EXE: EXIT - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!" & exit
)

rem CHECAR A ULTIMA EXECUCAO (NAO SUBIR O 'echo !timeNow!>!file!' !!!)
set "file=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\logTime!project!!outrosAdd!.txt" & if not exist "!file!" ( set "timeLast=123" ) else ( set /p timeLast=<!file! )
set /a "dif=timeNow - timeLast"
if not "!mode!"=="RESTART" (
	if not "!action!"=="!action:TOGGLE=!" ( if not !dif! geq 7 ( "!fileLog!" "[NODEJS FILE] = [EXE: NAO - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!" & exit ) )	
)
echo !timeNow!>"!file!"

rem ### → ACAO | PARAR
if "!actionRun!"=="OFF" (
	"!2_BACKGROUND!" "C:\Program Files (x86)\AlwaysUp\AlwaysUp.exe" -stop "!nodeExe!"
)

rem ### → ACAO | INICIAR
if "!actionRun!"=="ON" (
	rem [HIDE]
	if not "!action!"=="!action:HIDE=!" (
		"!2_BACKGROUND!" "C:\Program Files (x86)\AlwaysUp\AlwaysUp.exe" -start "!nodeExe!"
	)
	
	rem [VIEW]
	if not "!action!"=="!action:VIEW=!" (
		"!2_BACKGROUND!" "C:\Program Files (x86)\AlwaysUp\AlwaysUp.exe" -start-in-current-session "!nodeExe!"
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
		"!2_BACKGROUND!" ping -n 5 -w 1000 127.0.0.1 #2# nul #1# !nircmd! win setsize ititle !nodeExe! !winTP!
	)
)

rem LOG E RETORNAR O RESULTADO
"!fileLog!" "[NODEJS FILE] = [EXE: SIM - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!"
rem BAT2 - DEFINIR O VALOR E RETORNAR (USAR '%' NAS VARIAVEIS!!!)
endlocal & set "ret2=%ret2%" & setlocal enabledelayedexpansion & exit /b





