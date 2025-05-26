@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "local=%~dp0" & set "local=!local:~0,-1!" & set "letra=!local:~0,1!" & set "arquivo=%~nx0" & set "argString=%*" & set "arg1=%~1"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" == "" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nNENHUM PARAMETRO PASSADO"" & exit )
rem NET SESSION > nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )
rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a" & set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"
rem ********************************************************************************************************************************************************

rem REGISTRAR GATILHO
!fileLog! "[PROGRAM EXE] = [### INICIOU ###] (P: !arg1!)"

if "!arg1!" == "APAGAR" ( goto COPIA_APAGAR ) else ( if "!arg1!" == "CRIAR" ( goto COPIA_CRIAR ) )
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nPARAMETROS INVALIDOS. Exemplo:\\n\\n!arquivo! 'APAGAR/CRIAR'"" & exit

set "devMaster=#" & set "nodeOk=#" & set "pythonOk=#" & set fileQtdNode=0 & set "fileNode=" & set "fileBlNode=" & set fileQtdPython=0 & set "filePython=" & set "fileBlPython="
:COPIA_CRIAR
rem IDENTIFICAR O DEVMASTER PELO CONFIG (NAO SUBIR!!!)
for /f "usebackq delims=" %%a in ("!fileChrome_Extension!\src\master.json") do ( 
	set "conteudo=%%a"
	set "conteudo=!conteudo:"=!"
	if not "!conteudo!" == "!conteudo:master:=!" ( set "devMaster=!conteudo!" & goto DEVMASTER_ENCONTRADO )
)

!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\nDEVMASTER NAO ENCONTRADO!"" & exit
:DEVMASTER_ENCONTRADO

rem ************* AWS
set "nodeAws=WebSocket_server" & set "pythonAws="
rem ************* ESTRELAR
set "nodeEstrelar=WebSocket_server;URA_Reversa_serverJsf;WebScraper_serverC6;WebScraper_serverC6_New2" & set "pythonEstrelar="
rem ************* OPSEUA
set "nodeOpseua=!nodeAws!;!nodeEstrelar!;IPTV_server;Sniffer_Python_server" & set "pythonOpseua=!pythonAws!;Sniffer_Python_server"

rem ************* AWS | ESTRELAR | OPSEUA
if not "!devMaster!" == "!devMaster:AWS=!" ( set "nodeOk=!nodeAws!" & set "pythonOk=!pythonAws!" )
if not "!devMaster!" == "!devMaster:ESTRELAR=!" ( set "nodeOk=!nodeEstrelar!" & set "pythonOk=!pythonEstrelar!" )
if not "!devMaster!" == "!devMaster:OPSEUA=!" ( set "nodeOk=!nodeOpseua!" & set "pythonOk=!pythonOpseua!" )
if not "!devMaster!" == "!devMaster:NOTE_HP=!" ( set "nodeOk=!nodeOpseua!" & set "pythonOk=!pythonOpseua!" )

rem REMOVER DUPLICATAS (SEPARADOS POR ';') [NODE] | REMOVER CARACTERES DESNECESSARIOS '#;' E ';#' [NAO APAGAR!!!]
set "varOk=#;"
for %%a in ("%nodeOk:;=";"%") do (
	if not "%%a" == """" (
		set "is_duplicate="
		if not "!varOk!" == "!varOk:;%%~a;=!" ( set "is_duplicate=1" ) 
		if not defined is_duplicate ( set "varOk=!varOk!%%~a;" )
	) 
)
set "varOk=!varOk:#;=!" & set "varOk=!varOk!#" & set "varOk=!varOk:;#=!" & set "nodeOk=!varOk!"

rem REMOVER DUPLICATAS (SEPARADOS POR ';') [PYTHON] | REMOVER CARACTERES DESNECESSARIOS '#;' E ';#' [NAO APAGAR!!!]
set "varOk=#;"
for %%a in ("%pythonOk:;=";"%") do (
	if not "%%a" == """" (
		set "is_duplicate="
		if not "!varOk!" == "!varOk:;%%~a;=!" ( set "is_duplicate=1" ) 
		if not defined is_duplicate ( set "varOk=!varOk!%%~a;" )
	) 
)
set "varOk=!varOk:#;=!" & set "varOk=!varOk!#" & set "varOk=!varOk:;#=!" & set "pythonOk=!varOk!"

rem ---------------------------------------------------------- CRIAR ------------------------------------------------------------------------------

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO NODE (CRIAR | FIREWALL [PERMITIR])
if not "!nodeOk!" == "!nodeOk:_=!" ( 
	cd /d !fileWindows!\PORTABLE_Node & powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "ALLOW" "!cd!\node.exe"
	for %%a in ("%nodeOk:;=";"%") do (
		set "varOk=%%~a" & set "varOk=!varOk:"=!"
		if not exist "!cd!\node!varOk!.exe" (
			set /a fileQtdNode+=1 & set "fileNode=!fileNode!node!varOk!; " & set "destino=!cd!\node!varOk!.exe"
			echo F|xcopy /Q /Y /F "!cd!\node.exe" "!destino!" & powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "ALLOW" "!destino!"
		)
	)
)
if not !fileQtdNode! GTR 0 ( set "fileQtdNode=0" & set "fileNode=; " )

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO PYTHON (CRIAR | FIREWALL [PERMITIR])
if not "!pythonOk!" == "!pythonOk:_=!" ( 
	cd /d !fileWindows!\PORTABLE_Python & powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "ALLOW" "!cd!\python.exe"
	for %%a in ("%pythonOk:;=";"%") do (
		set "varOk=%%~a" & set "varOk=!varOk:"=!"
		if not exist "!cd!\python!varOk!.exe" (
			set /a fileQtdPython+=1 & set "filePython=!filePython!python!varOk!; " & set "destino=!cd!\python!varOk!.exe"
			echo F|xcopy /Q /Y /F "!cd!\python.exe" "!destino!" & powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "ALLOW" "!destino!"
		)
	)
)
if not !fileQtdPython! GTR 0 ( set "fileQtdPython=0" & set "filePython=; " )

!fileLog! "[PROGRAM EXE] = [*** FIM ***] - COPIADOS   [NODE]: !fileQtdNode! - !fileNode!" & !fileLog! "[PROGRAM EXE] = [*** FIM ***] - COPIADOS [PYTHON]: !fileQtdPython! - !filePython!"
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nCOPIADOS [NODE]: !fileQtdNode!\\n!fileNode:; =\\n!\\nCOPIADOS [PYTHON]: !fileQtdPython!\\n!filePython:;=\\n!"" & exit

rem ---------------------------------------------------------- APAGAR ------------------------------------------------------------------------------

:COPIA_APAGAR

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO NODE (APAGAR (EXCETO O PROPRIO) | FIREWALL [APAGAR REGRA])
cd /d !fileWindows!\PORTABLE_Node & powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "DELETE" "!cd!\node.exe"
for %%F in (*) do (
	set "filename=%%~nxF"
	if not "!filename!" == "!filename:node=!" (
		if not "!filename!" == "!filename:.exe=!" (
			if /I not "!filename!" == "node.exe" (
				set /a fileQtdNode+=1 & del /f "!cd!\!filename!" & set "fileNode=!fileNode!!filename:.exe=!; " & powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "DELETE" "!cd!\!filename!"
			)
		) 
	)
)
if not !fileQtdNode! GTR 0 ( set "fileQtdNode=0" & set "fileNode=; " )

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO PYTHON (APAGAR (EXCETO O PROPRIO) | FIREWALL [APAGAR REGRA])
cd /d !fileWindows!\PORTABLE_Python & powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "DELETE" "!cd!\python.exe"
for %%F in (*) do (
	set "filename=%%~nxF"
	if not "!filename!" == "!filename:python=!" (
		if not "!filename!" == "!filename:.exe=!" (
			if /I not "!filename!" == "python.exe" (
				if /I not "!filename!" == "pythonw.exe" (
					set /a fileQtdPython+=1 & del /f "!cd!\!filename!" & set "filePython=!filePython!!filename:.exe=!; " & powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "DELETE" "!cd!\!filename!"
				)
			)
		)
	)
)
if not !fileQtdPython! GTR 0 ( set "fileQtdPython=0" & set "filePython=; " )

!fileLog! "[PROGRAM EXE] = [*** FIM ***] - APAGADOS   [NODE]: !fileQtdNode! - !fileNode!" & !fileLog! "[PROGRAM EXE] = [*** FIM ***] - APAGADOS [PYTHON]: !fileQtdPython! - !filePython!"
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nAPAGADOS [NODE]: !fileQtdNode!\\n!fileNode:; =\\n!\\nAPAGADOS [PYTHON]: !fileQtdPython!\\n!filePython:;=\\n!"" & exit


