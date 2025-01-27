@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" == "" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nNENHUM PARAMETRO PASSADO"" & exit )

NET SESSION > nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
rem set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem ********************************************************************************************************************************************************

rem REGISTRAR GATILHO
!fileLog! "[COMMANDS] = [### INICIOU ###] {ADM-!adm!} (PARS: !arg1!)"

rem ************************** 'ON'      → [OFF] →→→ [ON] (EXCETO Sniffer_Python)
rem ************************** 'OFF'     → [ON] →→→ [OFF]
rem ************************** 'RESTART' → [OFF] →→→ [ON] (EXCETO Sniffer_Python)       |       [ON] →→→ [OFF] →→→ [ON] (Sniffer_Python SO ATE O 'OFF')
rem ************************** 'RESTORE' → [ON] →→→ [OFF] →→→ [ON]

rem IDENTIFICAR O DEVMASTER PELO CONFIG
set "devMaster=ERRO" & set "action=!arg1!" & set "projects=ERRO" & set "projectsOff= " & set "projectsOn= "
for /f "usebackq delims=" %%a in ("!fileChrome_Extension!\src\master.json") do ( 
	rem NAO SUBIR!!!
	set "conteudo=%%a"
	set "conteudo=!conteudo:"=!"
	if not "!conteudo!" == "!conteudo:master:=!" ( set "devMaster=!conteudo!" & goto DEVMASTER_ENCONTRADO )
)
:DEVMASTER_ENCONTRADO

rem DEVS QUE EXECUTAM O PROJETO E MODO
set "projects=#WebSocket_server#"
if not "!devMaster!" == "!devMaster:AWS=!" ( set "atalhoModo=ON_VIEW" & set "projects=!projects! #URA_Reversa_serverJsf#" )
if not "!devMaster!" == "!devMaster:OPSEUA=!" ( set "atalhoModo=ON_HIDE" & set "projects=!projects! #Sniffer_Python_server#" )
if not "!devMaster!" == "!devMaster:ESTRELAR=!" ( set "atalhoModo=ON_VIEW" & set "projects=!projects! #WebScraper_serverC6# #WebScraper_serverC6_New2# #WebScraper_serverC6_New3# #WebScraper_serverC6_New4# #WebScraper_serverC6_New5#" )

rem Chat_Python (EXECUTAVEL DIFERENTE)
set "project=Chat_Python" & set "z_OUTROS=server"
if not "!projects!" == "!projects:#%project%_%z_OUTROS%#=!" (
	tasklist /fi "ImageName eq python!project!_!z_OUTROS!.exe" /fo csv 2> nul | find /I "python!project!_!z_OUTROS!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		rem EXECUTANDO [SIM]
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTORE_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!#" & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	) else (
		rem EXECUTANDO [NAO]
		if not "!action!" == "!action:_ON_=!" ( set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	)
)

rem Sniffer_Python (EXCETO ON, RESTART*)
set "project=Sniffer_Python" & set "z_OUTROS=server"
if not "!projects!" == "!projects:#%project%_%z_OUTROS%#=!" (
	tasklist /fi "ImageName eq node!project!_!z_OUTROS!.exe" /fo csv 2> nul | find /I "node!project!_!z_OUTROS!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		rem EXECUTANDO [SIM]
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTORE_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!#" & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	)
)

rem URA_Reversa [JSF]
set "project=URA_Reversa" & set "z_OUTROS=serverJsf"
if not "!projects!" == "!projects:#%project%_%z_OUTROS%#=!" (
	tasklist /fi "ImageName eq node!project!_!z_OUTROS!.exe" /fo csv 2> nul | find /I "node!project!_!z_OUTROS!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		rem EXECUTANDO [SIM]
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTORE_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!#" & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	) else (
		rem EXECUTANDO [NAO]
		if not "!action!" == "!action:_ON_=!" ( set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	)
)

rem WebScraper [C6]
set "project=WebScraper" & set "z_OUTROS=serverC6"
if not "!projects!" == "!projects:#%project%_%z_OUTROS%#=!" (
	tasklist /fi "ImageName eq node!project!_!z_OUTROS!.exe" /fo csv 2> nul | find /I "node!project!_!z_OUTROS!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		rem EXECUTANDO [SIM]
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTORE_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!#" & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	) else (
		rem EXECUTANDO [NAO]
		if not "!action!" == "!action:_ON_=!" ( set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	)
)

rem WebScraper [C6_New2]
set "project=WebScraper" & set "z_OUTROS=serverC6_New2"
if not "!projects!" == "!projects:#%project%_%z_OUTROS%#=!" (
	tasklist /fi "ImageName eq node!project!_!z_OUTROS!.exe" /fo csv 2> nul | find /I "node!project!_!z_OUTROS!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		rem EXECUTANDO [SIM]
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTORE_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!#" & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	) else (
		rem EXECUTANDO [NAO]
		if not "!action!" == "!action:_ON_=!" ( set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	)
)

rem WebScraper [C6_New3]
set "project=WebScraper" & set "z_OUTROS=serverC6_New3"
if not "!projects!" == "!projects:#%project%_%z_OUTROS%#=!" (
	tasklist /fi "ImageName eq node!project!_!z_OUTROS!.exe" /fo csv 2> nul | find /I "node!project!_!z_OUTROS!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		rem EXECUTANDO [SIM]
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTORE_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!#" & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	) else (
		rem EXECUTANDO [NAO]
		if not "!action!" == "!action:_ON_=!" ( set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	)
)

rem WebScraper [C6_New4]
set "project=WebScraper" & set "z_OUTROS=serverC6_New4"
if not "!projects!" == "!projects:#%project%_%z_OUTROS%#=!" (
	tasklist /fi "ImageName eq node!project!_!z_OUTROS!.exe" /fo csv 2> nul | find /I "node!project!_!z_OUTROS!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		rem EXECUTANDO [SIM]
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTORE_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!#" & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	) else (
		rem EXECUTANDO [NAO]
		if not "!action!" == "!action:_ON_=!" ( set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	)
)

rem WebScraper [C6_New5]
set "project=WebScraper" & set "z_OUTROS=serverC6_New5"
if not "!projects!" == "!projects:#%project%_%z_OUTROS%#=!" (
	tasklist /fi "ImageName eq node!project!_!z_OUTROS!.exe" /fo csv 2> nul | find /I "node!project!_!z_OUTROS!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		rem EXECUTANDO [SIM]
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTORE_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!#" & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	) else (
		rem EXECUTANDO [NAO]
		if not "!action!" == "!action:_ON_=!" ( set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	)
)

rem WebSocket
set "project=WebSocket" & set "z_OUTROS=server"
if not "!projects!" == "!projects:#%project%_%z_OUTROS%#=!" (
	tasklist /fi "ImageName eq node!project!_!z_OUTROS!.exe" /fo csv 2> nul | find /I "node!project!_!z_OUTROS!.exe" > nul
	if "!ERRORLEVEL!" == "0" (
		rem EXECUTANDO [SIM]
		if not "!action!" == "!action:_OFF_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!# " & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTORE_=!" ( set "projectsOff=!projectsOff!#!project!_!z_OUTROS!#" & set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	) else (
		rem EXECUTANDO [NAO]
		if not "!action!" == "!action:_ON_=!" ( set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
		if not "!action!" == "!action:_RESTART_=!" ( set "projectsOn=!projectsOn!#!project!_!z_OUTROS!# " )
	)
)

rem ---------------------------------------------- _OFF_ --------------------------------------------------------------------

rem → Chat_Python
if not "!projectsOff!" == "!projectsOff:#Chat_Python_server#=!" ( !fileProjetos!\Chat_Python\src\z_OUTROS_server\OFF.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → Sniffer_Python
if not "!projectsOff!" == "!projectsOff:#Sniffer_Python_server#=!" ( !fileProjetos!\Sniffer_Python\src\z_OUTROS_server\OFF.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → URA_Reversa [JSF]
if not "!projectsOff!" == "!projectsOff:#URA_Reversa_serverJsf#=!" ( !fileProjetos!\URA_Reversa\src\z_OUTROS_serverJsf\OFF.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6]
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6\OFF.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6_New2]
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New2#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New2\OFF.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6_New3]
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New3#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New3\OFF.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6_New4]
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New4#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New4\OFF.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6_New5]
if not "!projectsOff!" == "!projectsOff:#WebScraper_serverC6_New5#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New5\OFF.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → WebSocket (MANTER COMO ULTIMO)
if not "!projectsOff!" == "!projectsOff:#WebSocket_server#=!" ( !fileProjetos!\WebSocket\src\z_OUTROS_server\OFF.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )

rem ---------------------------------------------- _ON_ --------------------------------------------------------------------

rem → WebSocket (MANTER COMO PRIMEIRO)
if not "!projectsOn!" == "!projectsOn:#WebSocket_server#=!" ( !fileProjetos!\WebSocket\src\z_OUTROS_server\!atalhoModo!.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → Chat_Python
if not "!projectsOn!" == "!projectsOn:#Chat_Python_server#=!" ( !fileProjetos!\Chat_Python\src\z_OUTROS_server\!atalhoModo!.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → Sniffer_Python
if not "!projectsOn!" == "!projectsOn:#Sniffer_Python_server#=!" ( !fileProjetos!\Sniffer_Python\src\z_OUTROS_server\!atalhoModo!.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → URA_Reversa [JSF]
if not "!projectsOn!" == "!projectsOn:#URA_Reversa_serverJsf#=!" ( !fileProjetos!\URA_Reversa\src\z_OUTROS_serverJsf\!atalhoModo!.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6]
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6\!atalhoModo!.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6_New2]
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New2#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New2\!atalhoModo!.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6_New3]
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New3#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New3\!atalhoModo!.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6_New4]
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New4#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New4\!atalhoModo!.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )
rem → WebScraper [C6_New5]
if not "!projectsOn!" == "!projectsOn:#WebScraper_serverC6_New5#=!" ( !fileProjetos!\WebScraper\src\z_OUTROS_serverC6_New5\!atalhoModo!.vbs & ping -n 3 -w 1000 127.0.0.1 > nul )

rem ---------------------------------------------- ABRIR PROGRAMAS E POSICIONAR SE NECESSARIO --------------------------------------------------------------------
if not "!devMaster!" == "!devMaster:OPSEUA=!" (
	rem NADA A FAZER
) else (
	if not "!arg1!" == "!arg1:_ON_=!" (
		tasklist /fi "ImageName eq SystemInformer.exe" /fo csv 2> nul | find /I "SystemInformer.exe" > nul
		if "!ERRORLEVEL!" == "0" ( goto END_CMD )
		ping -n 3 -w 1000 127.0.0.1 > nul & !3_BACKGROUND! /NOCONSOLE "explorer" & set "fNSS=!fileNircmdSetSize!"
		ping -n 3 -w 1000 127.0.0.1 > nul & !3_BACKGROUND! /NOCONSOLE "!fileWindows!\PORTABLE_Notepad++\notepad++.exe !fileWindows!\BAT\z_log\z_MES_!DATE:~3,2!_DIA_!DATE:~0,2!.txt -monitor"
		ping -n 3 -w 1000 127.0.0.1 > nul & !3_BACKGROUND! /NOCONSOLE "cmd.exe /c "!fileWindows!\PORTABLE_System_Informer\System Informer.lnk""
		ping -n 3 -w 1000 127.0.0.1 > nul & !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fNSS! "This PC" "585 480 695 500" & !fNSS! "System Informer" "880 50 600 400" & !fNSS! "- Notepad++" "-7 545 1050 447""
		ping -n 3 -w 1000 127.0.0.1 > nul & !3_BACKGROUND! /NOCONSOLE "!nircmd! win normal ititle "- Notepad++""	
	)
)

:END_CMD

!fileLog! "[COMMANDS] = [*** FIM ***]"


