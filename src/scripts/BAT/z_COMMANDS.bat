@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "local=%~dp0" & set "local=!local:~0,-1!" & set "letra=!local:~0,1!" & set "arquivo=%~nx0" & set "argString=%*" & set "arg1=%~1"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" == "" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nNENHUM PARAMETRO PASSADO"" & exit )
rem NET SESSION > nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )
rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a" & set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"
rem ********************************************************************************************************************************************************

rem CHECAR A ULTIMA EXECUCAO (NAO SUBIR O 'findstr'!!!)
!fileLastRun! "CMD_TOGGLE" "z_COMMANDS"
findstr /m "SIM" "!fileWindows!\BAT\z_logs\logTime_z_COMMANDS.txt" > nul
if not %errorlevel%==0 ( exit )

rem REGISTRAR GATILHO
!fileLog! "[COMMANDS] = [### INICIOU ###] (P: !arg1!)"

rem ****************************** IDENTIFICAR O DEVMASTER PELO CONFIG (NAO SUBIR!!!) ***************************************************************
set "devMaster=#" & set "search=    master: " & set "replace="
for /f "usebackq delims=" %%a in ("!fileChrome_Extension!\src\master.json") do ( 
	set "conteudo=%%a"
	set "conteudo=!conteudo:"=!"
	if not "!conteudo!" == "!conteudo:master:=!" ( set "devMaster=!conteudo!" & goto DEVMASTER_ENCONTRADO )
)
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\nDEVMASTER NAO ENCONTRADO!"" & exit
:DEVMASTER_ENCONTRADO
set "result=!devMaster:%search%=%replace%!" & set "result=!result:,=%replace%!" & set "devMaster=!result!"
rem ********************************************************************************************************************************************************

rem PROJETOS E MODO
set "atalhoModo=ERRO" & set "action=!arg1!" & set "projectsOff= " & set "projectsOn= " & set "projects=#"
if "!devMaster!" == "AWS" ( set "atalhoModo=ON_VIEW" & set "projects=#WebSocket_server# #Chat_Python#" & goto PROJETOS_ENCONTRADO )
if "!devMaster!" == "OPSEUA" ( set "atalhoModo=ON_HIDE" & set "projects=#WebSocket_server# #Sniffer_Python_server#" & goto PROJETOS_ENCONTRADO )
if "!devMaster!" == "ESTRELAR" ( set "atalhoModo=ON_VIEW" & set "projects=#WebSocket_server# #URA_Reversa_serverJsf# #WebScraper_serverC6# #WebScraper_serverC6_New2#" & goto PROJETOS_ENCONTRADO )
if "!devMaster!" == "ESTRELAR_MARCOS" ( set "atalhoModo=ON_HIDE" & set "projects=#WebSocket_server# " & goto PROJETOS_ENCONTRADO )
if "!devMaster!" == "ESTRELAR_THAYNA" ( set "atalhoModo=ON_HIDE" & set "projects=#WebSocket_server# " & goto PROJETOS_ENCONTRADO )
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\nNENHUM PROJETO PARA ESSE PC!"" & exit
:PROJETOS_ENCONTRADO

rem ********************************************************************************************************************************************************

rem EXECUTANDO [SIM] | [NAO] = [__pythonChat_Python_server__] {EXECUTAVEL DIFERENTE}
set "project_zOutros=Chat_Python_server"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq python!project_zOutros!.exe" /fo csv 2> nul | find /I "python!project_zOutros!.exe" > nul
	if "!errorlevel!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__pythonChat_Python_server__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	) else ( if not "!action!" == "!action:_RESTART_=!" ( set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
)
:IGNORAR_IF-__pythonChat_Python_server__

rem EXECUTANDO [SIM] | [NAO] = [__nodeSniffer_Python_server__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=Sniffer_Python_server"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!errorlevel!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__nodeSniffer_Python_server__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__nodeSniffer_Python_server__

rem EXECUTANDO [SIM] | [NAO] = [__nodeURA_Reversa_serverJsf__]
set "project_zOutros=URA_Reversa_serverJsf"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!errorlevel!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__nodeURA_Reversa_serverJsf__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	) else ( if not "!action!" == "!action:_RESTART_=!" ( set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
)
:IGNORAR_IF-__nodeURA_Reversa_serverJsf__

rem EXECUTANDO [SIM] | [NAO] = [__nodeWebScraper_serverC6__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=WebScraper_serverC6"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!errorlevel!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__nodeWebScraper_serverC6__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__nodeWebScraper_serverC6__

rem EXECUTANDO [SIM] | [NAO] = [__nodeWebScraper_serverC6_New2__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=WebScraper_serverC6_New2"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!errorlevel!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__nodeWebScraper_serverC6_New2__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__nodeWebScraper_serverC6_New2__

rem EXECUTANDO [SIM] | [NAO] = [__nodeWebSocket_server__]
set "project_zOutros=WebSocket_server"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!errorlevel!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__nodeWebSocket_server__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	) else ( if not "!action!" == "!action:_RESTART_=!" ( set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
)
:IGNORAR_IF-__nodeWebSocket_server__

rem ---------------------------------------------- _OFF_ --------------------------------------------------------------------

rem → Chat_Python
if not "!projectsOff!" == "!projectsOff:#Chat_Python_server#=!" ( !fileProjetos!\Chat_Python\src\z_OUTROS_server\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
rem → Sniffer_Python
if not "!projectsOff!" == "!projectsOff:#Sniffer_Python_server#=!" ( !fileProjetos!\Sniffer_Python\src\z_OUTROS_server\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
rem → URA_Reversa [JSF]
if not "!projectsOff!" == "!projectsOff:#URA_Reversa_serverJsf#=!" ( !fileProjetos!\URA_Reversa\src\z_OUTROS_serverJsf\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6]
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New2#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New2\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )

rem → WebSocket (MANTER COMO ULTIMO)
if not "!projectsOff!" == "!projectsOff:#WebSocket_server#=!" ( !fileProjetos!\WebSocket\src\z_OUTROS_server\OFF.vbs TRUE & ping -n 5 -w 1000 127.0.0.1 > nul )

rem ---------------------------------------------- _ON_ --------------------------------------------------------------------

rem → WebSocket (MANTER COMO PRIMEIRO)
if not "!projectsOn!" == "!projectsOn:#WebSocket_server#=!" ( !fileProjetos!\WebSocket\src\z_OUTROS_server\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
rem → Chat_Python
if not "!projectsOn!" == "!projectsOn:#Chat_Python_server#=!" ( !fileProjetos!\Chat_Python\src\z_OUTROS_server\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
rem → Sniffer_Python
if not "!projectsOn!" == "!projectsOn:#Sniffer_Python_server#=!" ( !fileProjetos!\Sniffer_Python\src\z_OUTROS_server\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
rem → URA_Reversa [JSF]
if not "!projectsOn!" == "!projectsOn:#URA_Reversa_serverJsf#=!" ( !fileProjetos!\URA_Reversa\src\z_OUTROS_serverJsf\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6]
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New2#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New2\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )

rem ---------------------------------------------- ABRIR PROGRAMAS E POSICIONAR SE NECESSARIO --------------------------------------------------------------------

if "!devMaster!" == "OPSEUA" ( goto END_CMD )
if "!devMaster!" == "ESTRELAR_MARCOS" ( goto END_CMD )
if "!devMaster!" == "ESTRELAR_THAYNA" ( goto END_CMD )

if not "!arg1!" == "!arg1:_REST=!" (
	set "c1=!nircmd! win normal ititle" & set "c2=!nircmd! win setsize ititle" & set "c3=!nircmd! win min ititle"
	if "!devMaster!" == "AWS" ( set "res1=-7 543 1050 447" & set "res2=585 50 695 400" & set "res3=585 480 695 500" ) else ( set "res1=-2 564 1050 447" & set "res2=970 80 695 400" & set "res3=970 500 695 500" )
	!3_BACKGROUND! /NOCONSOLE "!fileWindows!\PORTABLE_Notepad++\notepad++.exe !fileWindows!\BAT\z_logs\z_MES_!DATE:~3,2!_DIA_!DATE:~0,2!.txt -monitor" & ping -n 4 -w 1000 127.0.0.1 > nul
	tasklist /fi "ImageName eq SystemInformer.exe" /fo csv 2> nul | find /I "SystemInformer.exe" > nul
	if not "!errorlevel!" == "0" ( !3_BACKGROUND! /NOCONSOLE "explorer" & !3_BACKGROUND! /NOCONSOLE "cmd.exe /c "!fileWindows!\PORTABLE_System_Informer\SystemInformer.vbs"" & ping -n 4 -w 1000 127.0.0.1 > nul )
	!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !c1! "- Notepad+" & !c2! "- Notepad++" !res1! & !c2! "System Informer" !res2! & !c2! "This PC" !res3! & !c3! "- Notepad+" & !c1! "- Notepad+" & !c3! "_WIND" & !c1! "_WIND""
)
:END_CMD

!fileLog! "[COMMANDS] = [*** FIM ***]"


