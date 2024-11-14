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
set "projectWebSocket=AWS_OPSEUA_ESTRELAR"
set "projectChat_Python=AWS_OPSEUA"
set "projectSniffer_Python=OPSEUA"
set "projectWebScraper_C6=ESTRELAR"
set "projectWebScraper_C6_New2=ESTRELAR"
set "projectWebScraper_C6_New3=ESTRELAR"
set "projectWebScraper_Jucesp=ESTRELAR"

rem IDENTIFICAR O DEVMASTER PELO CONFIG
set "conteudo=" & set "atalhoModo="
for /f "usebackq delims=" %%a in ("!fileChrome_Extension!\src\master.json") do ( 
	rem NAO SUBIR!!!
	set "devMaster=%%a"
	set "devMaster=!devMaster:"=!"
	if not "!devMaster!"=="!devMaster:master:=!" ( set "conteudo=!devMaster!" & goto DEVMASTER_ENCONTRADO )
)
:DEVMASTER_ENCONTRADO

rem DEVMASTER 'AWS'
if not "!conteudo!"=="!conteudo:AWS=!" ( set "conteudo=AWS" & set "atalhoModo=ON_VIEW" )

rem DEVMASTER 'OPSEUA'
if not "!conteudo!"=="!conteudo:OPSEUA=!" ( set "conteudo=OPSEUA" & set "atalhoModo=ON_HIDE" )

rem DEVMASTER 'ESTRELAR'
if not "!conteudo!"=="!conteudo:ESTRELAR=!" ( set "conteudo=ESTRELAR" & set "atalhoModo=ON_VIEW" )

rem ### SOMENTE INICIAR OS SCRIPTS (SE FOI ESPECIFICADO NO PARAMENTRO)
if not "!arg1!"=="!arg1:ONLY_START=!" goto START_SCRIPTS

rem ################################## SCRIPTS PARAR
rem → Chat_Python
if not "!projectChat_Python!"=="!projectChat_Python:%conteudo%=!" ( "!fileProjetos!\Chat_Python\src\z_Outros_server\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → Sniffer_Python
if not "!projectSniffer_Python!"=="!projectSniffer_Python:%conteudo%=!" ( "!fileProjetos!\Sniffer_Python\src\z_Outros_server\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [C6]
if not "!projectWebScraper_C6!"=="!projectWebScraper_C6:%conteudo%=!" ( "!fileProjetos!\WebScraper\src\z_Outros_serverC6\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [C6_New2]
if not "!projectWebScraper_C6_New2!"=="!projectWebScraper_C6_New2:%conteudo%=!" ( "!fileProjetos!\WebScraper\src\z_Outros_serverC6_New2\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [C6_New3]
if not "!projectWebScraper_C6_New3!"=="!projectWebScraper_C6_New3:%conteudo%=!" ( "!fileProjetos!\WebScraper\src\z_Outros_serverC6_New3\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebScraper [Jucesp]
if not "!projectWebScraper_Jucesp!"=="!projectWebScraper_Jucesp:%conteudo%=!" ( "!fileProjetos!\WebScraper\src\z_Outros_serverJucesp\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebSocket (MANTER COMO ULTIMO PARA GARANTIR QUE OUTROS PROJETOS CONSIGAM ENVIAR OS COMANDOS ATE ENCERRAR TUDO)
if not "!projectWebSocket!"=="!projectWebSocket:%conteudo%=!" ( "!fileProjetos!\WebSocket\src\z_Outros_server\OFF.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem ### SOMENTE PARAR OS SCRIPTS (SE FOI ESPECIFICADO NO PARAMENTRO)
if not "!arg1!"=="!arg1:ONLY_STOP=!" goto FIM_DO_SCRIPT

rem ESPERAR PARA INICIAR (PARA EVITAR FORCAR A CPU)
ping -n 5 -w 1000 127.0.0.1 >nul

:START_SCRIPTS
rem ################################## SCRIPTS INICIAR
rem → Chat_Python
if not "!projectChat_Python!"=="!projectChat_Python:%conteudo%=!" ( "!fileProjetos!\Chat_Python\src\z_Outros_server\!atalhoModo!.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem → WebSocket
if not "!projectWebSocket!"=="!projectWebSocket:%conteudo%=!" ( "!fileProjetos!\WebSocket\src\z_Outros_server\!atalhoModo!.vbs" & ping -n 3 -w 1000 127.0.0.1 >nul )

rem ATALHO ACIONADO FOI 'AllRestart'
if not "!arg1!"=="!arg1:ALL_RESTART=!" (
	if not "!atalhoModo!"=="!atalhoModo:ON_VIEW=!" (
	
		rem NAO ABRIR PROGRAMAS SE JA ESTIVEREM ABERTOS
		tasklist /fi "ImageName eq SystemInformer.exe" /fo csv 2>NUL | find /I "SystemInformer.exe">NUL
		if "!ERRORLEVEL!"=="0" ( goto FIM_DO_SCRIPT )
	
		rem (AWS/ESTRELAR) ABRIR EXPLORER/TASKMANAGER/NOTEPAD++ E POSICIONAR JANELAS
		ping -n 3 -w 1000 127.0.0.1 >nul
		
		!2_BACKGROUND! explorer
		
		ping -n 7 -w 1000 127.0.0.1 >nul
		
		!2_BACKGROUND! !fileWindows!\PORTABLE_Notepad++\notepad++.exe !fileWindows!\BAT\z_log\z_MES_!mes!_DIA_!dia!.txt -monitor
		
		ping -n 3 -w 1000 127.0.0.1 >nul
		
		rem !2_BACKGROUND! taskmgr
		!2_BACKGROUND! !fileWindows!\PORTABLE_System_Informer\SystemInformer.exe
		
		ping -n 3 -w 1000 127.0.0.1 >nul
		
		rem !fileNircmdSetSize! "Task Manager" "890 50 600 600"
		!fileNircmdSetSize! "System Informer" "890 50 600 400"
	)
)

:FIM_DO_SCRIPT

!fileLog! "[WAKEUP_RESTART] = FIM"

