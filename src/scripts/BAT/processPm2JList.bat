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

rem ESCREVER LOG PM2JLIST NO TXT
set "arquivoTemp=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\processPm2JList.txt"
set "loopMax=500" & set "loopQtd=0" & del /f !arquivoTemp!
"!2_BACKGROUND!" pm2 jlist#2#!arquivoTemp!

:LER_ARQUIVO
set /a loopQtd+=1
if exist !arquivoTemp! (
    set /p arquivoConteudo=<"!arquivoTemp!"
    if !errorlevel! neq 0 (
        if !loopQtd! lss !loopMax! (
			ping -n 1 -w 1 127.0.0.1 >nul
            goto LER_ARQUIVO
        ) else (
            goto FIM_SCRIPT
        )
    )
) else (
    if !loopQtd! lss !loopMax! (
		goto LER_ARQUIVO
    ) else (
        goto FIM_SCRIPT
    )
)

rem PATH COMPLETO DO SCRIPT SEM BARRA E DOIS PONTOS
set "replace=-"
set "fileScriptFullWithBars=!fileScript::=%replace%!" && set "fileScriptFullWithBars=!fileScriptFullWithBars:\=%replace%!"
set "fileScriptFullWithBars=!project!_!fileScriptFullWithBars!"

rem CHECAR SE ESTA NO JLIST
findstr /m "!fileScriptFullWithBars!" "!arquivoTemp!" >Nul
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

rem ACTION → NAO DEFINIDA (ENCERRAR)
if "!actionRun!"=="ERRO" ( "!fileLog!" "[NODEJS FILE] = [EXE: EXIT - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun! - LOOP: !loopMax!/!loopQtd!] # !fileScriptFullWithBars!" & exit )

rem CHECAR A ULTIMA EXECUCAO (NAO SUBIR O 'echo !timeNow!>!file!' !!!)
set "file=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\logTime!project!!outrosAdd!.txt" & if not exist "!file!" ( set "timeLast=123" ) else ( set /p timeLast=<!file! )
set /a "dif=timeNow - timeLast"
if not "!mode!"=="RESTART" (
	if not "!action!"=="!action:TOGGLE=!" ( if not !dif! geq 7 ( echo !TIME! - [NODEJS FILE] = [EXE: NAO - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun!] # !fileScriptFullWithBars!>>"!fileAll!" & exit ) )	
)
echo !timeNow!>"!file!"

rem ### → ACAO | PARAR
if "!actionRun!"=="OFF" (
	"!2_BACKGROUND!" pm2 del !fileScriptFullWithBars!
	rem JANELA DO LOG FECHAR
	"!2_BACKGROUND!" !nircmd! win close ititle "#_!fileScriptFullWithBars!"
)

rem ### → ACAO | INICIAR
if "!actionRun!"=="ON" (
	rem INICIAR SCRIPT NO PM2
	"!2_BACKGROUND!" pm2 start "!fileScript!" --name "!fileScriptFullWithBars!" -i 1
	
	rem [VIEW]
	if not "!action!"=="!action:VIEW=!" (
		rem start cmd.exe /c "title #_!fileScriptFullWithBars!& !letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\nodeZPm2JList.exe "%letra%:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\node_modules\pm2\bin\pm2" logs !fileScriptFullWithBars!"
		rem "D:\ARQUIVOS\WINDOWS\BAT\RUN_PORTABLE\2_BACKGROUND.exe" start "!fileScriptFullWithBars!" /WAIT !letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\!nodeExe!.exe !fileScript! #1# start cmd.exe /c !letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\scripts\BAT\processPm2JList.bat !action! !project!@!outrosAdd! !fileScript! REBOOT
		rem "D:\ARQUIVOS\WINDOWS\BAT\RUN_PORTABLE\2_BACKGROUND.exe" start "#_!fileScriptFullWithBars!" !letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\nodeZPm2JList.exe %letra%:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\node_modules\pm2\bin\pm2 logs !fileScriptFullWithBars!
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
		"!2_BACKGROUND!" timeout 2 #2# nul #1# !nircmd! win setsize ititle #_!fileScriptFullWithBars! !winTP!
	)
)

:FIM_SCRIPT

rem LOG E RETORNAR O RESULTADO
echo !TIME! - [NODEJS FILE] = [EXE: SIM - OLD: !ret2! - CALL: !mode! - ACT: !action! - RUN: !actionRun! - LOOP: !loopMax!/!loopQtd!] # !fileScriptFullWithBars!>>"!fileAll!"
rem BAT2 - DEFINIR O VALOR E RETORNAR (USAR '%' NAS VARIAVEIS!!!)
endlocal & set "ret2=%ret2%" & setlocal enabledelayedexpansion & exit /b



























