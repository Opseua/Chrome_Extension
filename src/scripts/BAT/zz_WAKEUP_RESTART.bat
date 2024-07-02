@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" equ "" !fileMsg! "[!local!\!arquivo!]\n\nNao usar o BAT/BACKGROUND" & exit

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

!fileLog! "[WAKEUP_RESTART] = [### INICIOU ###] [PARS-!arg1!]"

rem QUAIS DEVS EXECUTAM O PROJETO
set "projectWebSocket=OPSEUA_AWS_ESTRELAR"
set "projectWebSocketOld=OPSEUA_AWS_ESTRELAR"
set "projectSniffer_Python=OPSEUA"
set "projectURA_Reversa_Jsf=ESTRELAR"
set "projectWebScraper_C6=ESTRELAR"
set "projectWebScraper_C6_New2=ESTRELAR"
set "projectWebScraper_Jucesp=ESTRELAR"
set "projectWebScraper_Jucesp_New2=ESTRELAR"

rem IDENTIFICAR O DEVMASTER PELO CONFIG
set "conteudo=" & set "atalhoModo="
for /f "usebackq delims=" %%a in ("!fileChrome_Extension!\src\config.json") do ( set "conteudo=!conteudo!%%a" )

rem DEVMASTER 'OPSEUA'
set "search=master": "OPSEUA"
set "resultDevMaster=!conteudo:%search%=!"
if /I "!resultDevMaster!" neq "!conteudo!" ( set "conteudo=OPSEUA" &  set "atalhoModo=ON_HIDE" )

rem DEVMASTER 'AWS'
set "search=master": "AWS"
set "resultDevMaster=!conteudo:%search%=!"
if /I "!resultDevMaster!" neq "!conteudo!" ( set "conteudo=AWS" &  set "atalhoModo=ON_VIEW" )

rem DEVMASTER 'ESTRELAR'
set "search=master": "ESTRELAR"
set "resultDevMaster=!conteudo:%search%=!"
if /I "!resultDevMaster!" neq "!conteudo!" ( set "conteudo=ESTRELAR" &  set "atalhoModo=ON_VIEW" )

rem ### SOMENTE INICIAR OS SCRIPTS (SE FOI ESPECIFICADO NO PARAMENTRO)
if not "!arg1!"=="!arg1:ONLY_START=!" goto START_SCRIPTS

rem ################################## SCRIPTS PARAR
rem → WebSocket
if not "!projectWebSocket!"=="!projectWebSocket:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebSocket\src\z_Outros_server\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebSocket [Old]
if not "!projectWebSocketOld!"=="!projectWebSocketOld:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebSocketOld\src\z_Outros_server\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → Sniffer_Python
if not "!projectSniffer_Python!"=="!projectSniffer_Python:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\Sniffer_Python\src\z_Outros_server\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → URA_Reversa [Jsf]
if not "!projectURA_Reversa_Jsf!"=="!projectURA_Reversa_Jsf:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\URA_Reversa\src\z_Outros_serverJsf\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [C6]
if not "!projectWebScraper_C6!"=="!projectWebScraper_C6:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverC6\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [C6_New2]
if not "!projectWebScraper_C6_New2!"=="!projectWebScraper_C6_New2:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverC6_New2\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [Jucesp]
if not "!projectWebScraper_Jucesp!"=="!projectWebScraper_Jucesp:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverJucesp\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [Jucesp_New2]
if not "!projectWebScraper_Jucesp_New2!"=="!projectWebScraper_Jucesp_New2:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverJucesp_New2\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem ### SOMENTE PARAR OS SCRIPTS (SE FOI ESPECIFICADO NO PARAMENTRO)
if not "!arg1!"=="!arg1:ONLY_STOP=!" goto FIM_DO_SCRIPT

:START_SCRIPTS
rem ################################## SCRIPTS INICIAR
rem → WebSocket
if not "!projectWebSocket!"=="!projectWebSocket:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebSocket\src\z_Outros_server\!atalhoModo!.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebSocket [Old
if not "!projectWebSocketOld!"=="!projectWebSocketOld:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebSocketOld\src\z_Outros_server\!atalhoModo!.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → URA_Reversa [Jsf]
if not "!projectURA_Reversa_Jsf!"=="!projectURA_Reversa_Jsf:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\URA_Reversa\src\z_Outros_serverJsf\!atalhoModo!.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [C6]
rem if not "!projectWebScraper_C6!"=="!projectWebScraper_C6:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverC6\!atalhoModo!.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [C6_New2]
rem if not "!projectWebScraper_C6_New2!"=="!projectWebScraper_C6_New2:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverC6_New2\!atalhoModo!.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [Jucesp]
rem if not "!projectWebScraper_Jucesp!"=="!projectWebScraper_Jucesp:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverJucesp\!atalhoModo!.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [Jucesp_New2]
rem if not "!projectWebScraper_Jucesp_New2!"=="!projectWebScraper_Jucesp_New2:%conteudo%=!" ( "!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverJucesp_New2\!atalhoModo!.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem ABRIR EXPLORER/TASKMANAGER/NOTEPAD++ E POSICIONAR JANELAS
if not "!atalhoModo!"=="!atalhoModo:ON_VIEW=!" (
	rem → AWS/ESTRELAR
	
	ping -n 3 -w 1000 127.0.0.1 >nul
	
	!2_BACKGROUND! explorer
	
	ping -n 7 -w 1000 127.0.0.1 >nul
	
	!2_BACKGROUND! "!letra!:\ARQUIVOS\WINDOWS\PORTABLE_Notepad++\notepad++.exe" "!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\z_MES_!mes!_DIA_!dia!.txt" -monitor
	
	ping -n 3 -w 1000 127.0.0.1 >nul
	
	!2_BACKGROUND! taskmgr
	
	ping -n 3 -w 1000 127.0.0.1 >nul
	
	!fileNircmdSetSize! "Task Manager" "890 50 600 600"
)


:FIM_DO_SCRIPT

!fileLog! "[WAKEUP_RESTART] = FIM"

exit
exit


