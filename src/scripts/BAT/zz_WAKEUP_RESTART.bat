@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" equ "" "!fileMsg!" "[!local!\!arquivo!]\n\nNao usar o BAT/BACKGROUND" & exit

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
rem set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

"!fileLog!" "[WAKEUP_RESTART] = [### INICIOU ###] [PARS-!arg1!]"

rem SCRIPTS PARAR 
rem WebSocket [Old]
"!letra!:\ARQUIVOS\PROJETOS\WebSocketOld\src\z_Outros_server\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem WebSocket
"!letra!:\ARQUIVOS\PROJETOS\WebSocket\src\z_Outros_server\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem Sniffer_Python
"!letra!:\ARQUIVOS\PROJETOS\Sniffer_Python\src\z_Outros_server\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem URA_Reversa [Telein]
"!letra!:\ARQUIVOS\PROJETOS\URA_Reversa\src\z_Outros_serverTelein\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem URA_Reversa [JSF]
"!letra!:\ARQUIVOS\PROJETOS\URA_Reversa\src\z_Outros_serverJsf\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem WebScraper [Jucesp]
"!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverJucesp\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem WebScraper [C6]
"!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverC6\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul

rem ### ENCERRAR SCRIPT E NAO INICIAR OS PROCESSOS (SE FOI ESPECIFICADO NO PARAMENTRO)
if not "!arg1!"=="!arg1:ONLY_STOP=!" goto FIM_DO_SCRIPT

rem APAGAR LOGS DO PM2
del /f /s /q "C:\Users\!usuario!\.pm2\logs" & del /f /s /q "C:\Users\!usuario!\.pm2\pids" & del /f "C:\Users\!usuario!\.pm2\pm2.log" & del /f /s /q "C:\Users\!usuario!\.pm2\pm2.pid"
"!fileLog!" "[WAKEUP_RESTART] = LOGS PM2 DELETADOS"

rem LER O CONFIG
set "conteudo="
for /f "usebackq delims=" %%a in ("!letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\config.json") do ( set "conteudo=!conteudo!%%a" )

rem IDENTIFICAR O DISPOSITIVO (OPSEUA/EC2/AWS/ESTRELAR)
set "devMaster="
set "str=!conteudo!"

rem DEVMASTER 'OPSEUA'
set "search=master": "OPSEUA"
set "resultDevMaster=!str:%search%=!"
if /I "!resultDevMaster!" neq "!str!" (
	set "devMaster=OPSEUA"
	goto ENCONTROU_DEVMASTER[SIM]
)

rem DEVMASTER 'EC2'
set "search=master": "EC2"
set "resultDevMaster=!str:%search%=!"
if /I "!resultDevMaster!" neq "!str!" (
	set "devMaster=EC2"
	goto ENCONTROU_DEVMASTER[SIM]
)

rem DEVMASTER 'AWS'
set "search=master": "AWS"
set "resultDevMaster=!str:%search%=!"
if /I "!resultDevMaster!" neq "!str!" (
	set "devMaster=AWS"
	goto ENCONTROU_DEVMASTER[SIM]
)

rem DEVMASTER 'ESTRELAR'
set "search=master": "ESTRELAR"
set "resultDevMaster=!str:%search%=!"
if /I "!resultDevMaster!" neq "!str!" (
	set "devMaster=ESTRELAR"
	goto ENCONTROU_DEVMASTER[SIM]
)

:ENCONTROU_DEVMASTER[SIM]

rem SCRIPTS INICIAR 
if "!devMaster!"=="OPSEUA" (
	rem → OPSEUA
	rem INICIAR WebSocket (hide) [Old]
	"!letra!:\ARQUIVOS\PROJETOS\WebSocketOld\src\z_Outros_server\ON_HIDE.vbs"
	ping -n 3 -w 1000 127.0.0.1 >nul
	
	rem INICIAR WebSocket (hide)
	"!letra!:\ARQUIVOS\PROJETOS\WebSocket\src\z_Outros_server\ON_HIDE.vbs"
	ping -n 3 -w 1000 127.0.0.1 >nul
	
	rem INICIAR URA_Reversa [JSF] (view)
	rem "!letra!:\ARQUIVOS\PROJETOS\URA_Reversa\src\z_Outros_serverJsf\ON_VIEW.vbs"
	ping -n 3 -w 1000 127.0.0.1 >nul
) else (
	rem → EC2/AWS/ESTRELAR
	rem INICIAR WebSocket (view) [Old]
	"!letra!:\ARQUIVOS\PROJETOS\WebSocketOld\src\z_Outros_server\ON_VIEW.vbs"
	ping -n 3 -w 1000 127.0.0.1 >nul
	
	rem INICIAR WebSocket (view)
	"!letra!:\ARQUIVOS\PROJETOS\WebSocket\src\z_Outros_server\ON_VIEW.vbs"
	ping -n 3 -w 1000 127.0.0.1 >nul
	
	rem INICIAR URA_Reversa [Telein] (view)
	"!letra!:\ARQUIVOS\PROJETOS\URA_Reversa\src\z_Outros_serverJsf\ON_VIEW.vbs"
	ping -n 3 -w 1000 127.0.0.1 >nul
	
	rem INICIAR URA_Reversa [JSF] (view)
	rem "!letra!:\ARQUIVOS\PROJETOS\URA_Reversa\src\z_Outros_serverJsf\ON_VIEW.vbs"
	ping -n 3 -w 1000 127.0.0.1 >nul
)

:FIM_DO_SCRIPT

"!fileLog!" "[WAKEUP_RESTART] = FIM"

exit
exit


