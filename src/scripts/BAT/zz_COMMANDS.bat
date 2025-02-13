@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" == "" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nNENHUM PARAMETRO PASSADO"" & exit )

NET SESSION > nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a" & set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem ********************************************************************************************************************************************************

rem REGISTRAR GATILHO
!fileLog! "[COMMANDS] = [### INICIOU ###] {ADM-!adm!} (PARS: !arg1!)"

rem IDENTIFICAR O DEVMASTER PELO CONFIG
set "devMaster=ERRO" & set "action=!arg1!" & set "projects=ERRO" & set "projectsOff= " & set "projectsOn= " & set "projects=#"
for /f "usebackq delims=" %%a in ("!fileChrome_Extension!\src\master.json") do ( 
	rem NAO SUBIR!!!
	set "conteudo=%%a"
	set "conteudo=!conteudo:"=!"
	if not "!conteudo!" == "!conteudo:master:=!" ( set "devMaster=!conteudo!" & goto DEVMASTER_ENCONTRADO )
)
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\nDEVMASTER NAO ENCONTRADO!"" & exit
:DEVMASTER_ENCONTRADO

rem DEVS QUE EXECUTAM O PROJETO E MODO
if not "!devMaster!" == "!devMaster:AWS=!" ( set "atalhoModo=ON_VIEW" & set "projects=#WebSocket_server# #Chat_Python#" & goto PROJETOS_ENCONTRADO )
if not "!devMaster!" == "!devMaster:OPSEUA=!" ( set "atalhoModo=ON_HIDE" & set "projects=#WebSocket_server# #Sniffer_Python_server#" & goto PROJETOS_ENCONTRADO )
if not "!devMaster!" == "!devMaster:ESTRELAR=!" ( set "atalhoModo=ON_VIEW" & set "projects=#WebSocket_server# #URA_Reversa_serverJsf# #WebScraper_serverC6# #WebScraper_serverC6_New2# #WebScraper_serverC6_New3# #WebScraper_serverC6_New4# #WebScraper_serverC6_New5# #WebScraper_serverC6_New6# #WebScraper_serverC6_New7# #WebScraper_serverC6_New8#" & goto PROJETOS_ENCONTRADO )
:PROJETOS_ENCONTRADO

rem EXECUTANDO [SIM] | [NAO] = [__Chat_Python_server__] {EXECUTAVEL DIFERENTE}
set "project_zOutros=Chat_Python_server"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq python!project_zOutros!.exe" /fo csv 2> nul | find /I "python!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__Chat_Python_server__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	) else ( if not "!action!" == "!action:_RESTART_=!" ( set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
)
:IGNORAR_IF-__Chat_Python_server__

rem EXECUTANDO [SIM] | [NAO] = [__Sniffer_Python_server__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=Sniffer_Python_server"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__Sniffer_Python_server__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__Sniffer_Python_server__

rem EXECUTANDO [SIM] | [NAO] = [__URA_Reversa_serverJsf__]
set "project_zOutros=URA_Reversa_serverJsf"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__URA_Reversa_serverJsf__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	) else ( if not "!action!" == "!action:_RESTART_=!" ( set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
)
:IGNORAR_IF-__URA_Reversa_serverJsf__

rem EXECUTANDO [SIM] | [NAO] = [__WebScraper_serverC6__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=WebScraper_serverC6"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__WebScraper_serverC6__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__WebScraper_serverC6__

rem EXECUTANDO [SIM] | [NAO] = [__WebScraper_serverC6_New2__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=WebScraper_serverC6_New2"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__WebScraper_serverC6_New2__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__WebScraper_serverC6_New2__

rem EXECUTANDO [SIM] | [NAO] = [__WebScraper_serverC6_New3__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=WebScraper_serverC6_New3"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__WebScraper_serverC6_New3__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__WebScraper_serverC6_New3__

rem EXECUTANDO [SIM] | [NAO] = [__WebScraper_serverC6_New4__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=WebScraper_serverC6_New4"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__WebScraper_serverC6_New4__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__WebScraper_serverC6_New4__

rem EXECUTANDO [SIM] | [NAO] = [__WebScraper_serverC6_New5__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=WebScraper_serverC6_New5"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__WebScraper_serverC6_New5__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__WebScraper_serverC6_New5__

rem EXECUTANDO [SIM] | [NAO] = [__WebScraper_serverC6_New6__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=WebScraper_serverC6_New6"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__WebScraper_serverC6_New6__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__WebScraper_serverC6_New6__

rem EXECUTANDO [SIM] | [NAO] = [__WebScraper_serverC6_New7__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=WebScraper_serverC6_New7"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__WebScraper_serverC6_New7__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__WebScraper_serverC6_New7__

rem EXECUTANDO [SIM] | [NAO] = [__WebScraper_serverC6_New8__] ([se OFF] NENHUMA ACAO)
set "project_zOutros=WebScraper_serverC6_New8"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__WebScraper_serverC6_New8__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	)
)
:IGNORAR_IF-__WebScraper_serverC6_New8__

rem EXECUTANDO [SIM] | [NAO] = [__WebSocket_server__]
set "project_zOutros=WebSocket_server"
if not "!projects!" == "!projects:#%project_zOutros%#=!" (
	tasklist /fi "ImageName eq node!project_zOutros!.exe" /fo csv 2> nul | find /I "node!project_zOutros!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & goto IGNORAR_IF-__WebSocket_server__ )
		if not "!projects!" == "!projects:#%project_zOutros%#=!" ( if not "!action!" == "!action:_REST=!" ( set "projectsOff=!projectsOff!#!project_zOutros!# " & set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
	) else ( if not "!action!" == "!action:_RESTART_=!" ( set "projectsOn=!projectsOn!#!project_zOutros!# " ) )
)
:IGNORAR_IF-__WebSocket_server__

rem ---------------------------------------------- _OFF_ --------------------------------------------------------------------

rem → Chat_Python
if not "!projectsOff!" == "!projectsOff:#Chat_Python_server#=!" ( !fileProjetos!\Chat_Python\src\z_OUTROS_server\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
rem → Sniffer_Python
if not "!projectsOff!" == "!projectsOff:#Sniffer_Python_server#=!" ( !fileProjetos!\Sniffer_Python\src\z_OUTROS_server\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
rem → URA_Reversa [JSF]
if not "!projectsOff!" == "!projectsOff:#URA_Reversa_serverJsf#=!" ( !fileProjetos!\URA_Reversa\src\z_OUTROS_serverJsf\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
rem → WebScraper [0,2,3,4,5,6]
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New2#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New2\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New3#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New3\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New4#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New4\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New5#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New5\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New6#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New6\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New7#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New7\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New8#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New8\OFF.vbs TRUE & ping -n 4 -w 1000 127.0.0.1 > nul )
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
rem → WebScraper [0,2,3,4,5,6]
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New2#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New2\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New3#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New3\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New4#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New4\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New5#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New5\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New6#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New6\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New7#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New7\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New8#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New8\!atalhoModo!.vbs FALSE & ping -n 4 -w 1000 127.0.0.1 > nul )

rem ---------------------------------------------- ABRIR PROGRAMAS E POSICIONAR SE NECESSARIO --------------------------------------------------------------------
if not "!devMaster!" == "OPSEUA" (
	if not "!arg1!" == "!arg1:_RESTART_=!" (
		tasklist /fi "ImageName eq SystemInformer.exe" /fo csv 2> nul | find /I "SystemInformer.exe" > nul
		if "!ERRORLEVEL!" == "0" ( goto END_CMD )
		ping -n 4 -w 1000 127.0.0.1 > nul & !3_BACKGROUND! /NOCONSOLE "explorer" & set "fNSS=!fileNircmdSetSize!"
		ping -n 4 -w 1000 127.0.0.1 > nul & !3_BACKGROUND! /NOCONSOLE "!fileWindows!\PORTABLE_Notepad++\notepad++.exe !fileWindows!\BAT\z_log\z_MES_!DATE:~3,2!_DIA_!DATE:~0,2!.txt -monitor"
		ping -n 4 -w 1000 127.0.0.1 > nul & !3_BACKGROUND! /NOCONSOLE "cmd.exe /c "!fileWindows!\PORTABLE_System_Informer\SystemInformer.vbs""
		ping -n 4 -w 1000 127.0.0.1 > nul & !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fNSS! "This PC" "585 480 695 500" & !fNSS! "System Informer" "880 50 600 400" & !fNSS! "- Notepad++" "-7 545 1050 447""
		ping -n 4 -w 1000 127.0.0.1 > nul & !3_BACKGROUND! /NOCONSOLE "!nircmd! win normal ititle "- Notepad++""	
	)
)
:END_CMD

!fileLog! "[COMMANDS] = [*** FIM ***]"


