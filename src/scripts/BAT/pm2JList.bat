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
if "!arg1!"=="" ( msg * "[pm2JList.bat] Usar o atalho e nao o executavel" & exit )

rem VARIAVEIS
set "ret2=ERRO" & set "actionRun=ERRO" & set "winTP=15 65 500 300" & set "action=!arg1!" & set "fileScript=!arg3!"
for /f "tokens=1,2 delims=@" %%a in ("!arg2!") do ( set "project=%%a" & set "outrosAdd=%%b" )

set "arquivoTemp=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\pm2JList.txt"
del /f !arquivoTemp!
"!letra!:\ARQUIVOS\WINDOWS\BAT\RUN_PORTABLE\1_BACKGROUND.exe" "pm2 jlist>!arquivoTemp!"
set "loopMax=500"
set "loopQtd=0"
set "ret2=ERRO"

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

rem  CHECAR SE O SCRIPT ESTA NO JLIST
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

rem TESTES!!!
rem msg * "[pm2JList.bat] action: !action! - actionRun: !actionRun! - ret2: !ret2! - fileScript: !fileScript!" & exit

rem ACTION → NAO DEFINIDA (ENCERRAR)
if "!actionRun!"=="ERRO" (
	echo !TIME! - [NODEJS FILE 1] = [EXE: EXIT - ANTES: !ret2! - CALL: !arg4! - ACTION: !action! - ACTION_RUN: !actionRun! - LOOP: !loopMax!/!loopQtd!] # !fileScriptFullWithBars!>>!fileAll! & exit
)

rem CHECAR A ULTIMA EXECUCAO (NAO SUBIR O 'echo !timeNow!>!file!' !!!)
set "file=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\logTime!project!!outrosAdd!.txt" & if not exist "!file!" ( set "timeLast=123" ) else ( set /p timeLast=<!file! )
set /a "dif=timeNow - timeLast"
if "!arg4!"=="SCRIPT" (
	if not "!action!"=="!action:TOGGLE=!" ( if not !dif! geq 7 ( echo !TIME! - [NODEJS FILE 1] = [EXE: NAO - ANTES: !ret2! - CALL: !arg4! - ACTION: !action! - ACTION_RUN: !actionRun!] # !fileScriptFullWithBars!>>!fileAll! & exit ) )	
)
echo !timeNow!>!file!

rem ### → ACAO | PARAR
if "!actionRun!"=="OFF" (
	!1_BACKGROUND! "pm2 del !fileScriptFullWithBars!"
	rem JANELA DO LOG FECHAR
	!1_BACKGROUND! "!nircmd! win close ititle ""#_!fileScriptFullWithBars!"""
)

rem ### → ACAO | INICIAR
if "!actionRun!"=="ON" (
	rem INICIAR SCRIPT NO PM2
	!1_BACKGROUND! "pm2 start ""!fileScript!"" --name ""!fileScriptFullWithBars!"" -i 1"
	
	rem [VIEW]
	if not "!action!"=="!action:VIEW=!" (
		start cmd.exe /c "title #_!fileScriptFullWithBars!& !letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\nodeZPm2JList.exe "%letra%:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS\node_modules\pm2\bin\pm2" logs !fileScriptFullWithBars!"
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
		!1_BACKGROUND! "timeout 2 > nul & !nircmd! win setsize ititle #_!fileScriptFullWithBars! !winTP!"
	)
)

:FIM_SCRIPT

rem LOG E RETORNAR O RESULTADO
echo !TIME! - [NODEJS FILE 1] = [EXE: SIM - ANTES: !ret2! - CALL: !arg4! - ACTION: !action! - ACTION_RUN: !actionRun! - LOOP: !loopMax!/!loopQtd!] # !fileScriptFullWithBars!>>!fileAll!
endlocal & set "ret2=%ret2%"
exit /b














