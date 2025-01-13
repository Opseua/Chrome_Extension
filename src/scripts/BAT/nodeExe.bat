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
!fileLog! "[NODE EXE] = {ADM-!adm!} [### INICIOU ###] (PARS-!arg1!)"

rem NAO SUBIR!!!
if "!arg1!" == "APAGAR" ( goto COPIA_APAGAR )
if "!arg1!" == "CRIAR" ( goto COPIA_CRIAR )
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nPARAMETROS INVALIDOS. Exemplo:\\n\\n!arquivo! 'APAGAR/CRIAR'"" & exit

:COPIA_CRIAR
rem IDENTIFICAR O DEVMASTER PELO CONFIG
set "devMaster=ERRO"
for /f "usebackq delims=" %%a in ("!fileChrome_Extension!\src\master.json") do ( 
	rem NAO SUBIR!!!
	set "conteudo=%%a"
	set "conteudo=!conteudo:"=!"
	if not "!conteudo!" == "!conteudo:master:=!" ( set "devMaster=!conteudo!" & goto DEVMASTER_ENCONTRADO )
)
:DEVMASTER_ENCONTRADO

rem NAO APAGAR!!!
set "projectsNode=#" & set "projectsPython=#"

rem AWS
if not "!devMaster!" == "!devMaster:AWS=!" (
	set "projectsNode=WebSocket_server;URA_Reversa_serverJsf"
	set "projectsPython=Chat_Python_server"
)

rem OPSEUA
if not "!devMaster!" == "!devMaster:OPSEUA=!" (
	set "projectsNode=WebSocket_server;URA_Reversa_serverJsf;Sniffer_Python_server;WebScraper_serverC6;WebScraper_serverC6_New2;WebScraper_serverC6_New3;WebScraper_serverC6_New4;WebScraper_serverC6_New5"
	set "projectsPython=Chat_Python_server;Sniffer_Python_server"
)

rem ESTRELAR
if not "!devMaster!" == "!devMaster:ESTRELAR=!" (
	set "projectsNode=WebSocket_server;URA_Reversa_serverJsf;Sniffer_Python_server;WebScraper_serverC6;WebScraper_serverC6_New2;WebScraper_serverC6_New3;WebScraper_serverC6_New4;WebScraper_serverC6_New5"
)

rem ---------------------------------------------------------- CRIAR ------------------------------------------------------------------------------

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO NODEJS
set fileQtdCopyNode=0
if not "!projectsNode!" == "!projectsNode:_=!" ( 
	set "projectsNode=!projectsNode!;" & cd /d !fileWindows!\PORTABLE_NodeJS
	for %%a in ("%projectsNode:;=" "%") do (
		if exist "!cd!\node%%~a.exe" (
			echo EXISTE [SIM] - %%~a
		) else (
			echo EXISTE [NAO] - %%~a
			rem COPIAR: CRIAR | FIREWALL [PERMITIR]
			set /a fileQtdCopyNode+=1
			set "destino=!cd!\node%%~a.exe"
			echo F|xcopy /Q /Y /F "!cd!\node.exe" "!destino!"
			!3_BACKGROUND! /NOCONSOLE ""!fileWindows!\BAT\firewallAllowBlock.bat" "ALLOW" "!destino!" "NAO_MOSTRAR_POPUP""
		)
	)
)

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO PYTHON
set fileQtdCopyPython=0
if not "!projectsPython!" == "!projectsPython:_=!" ( 
	set "projectsPython=!projectsPython!;" & cd /d !fileWindows!\PORTABLE_Python
	for %%a in ("%projectsPython:;=" "%") do (
		if exist "!cd!\python%%~a.exe" (
			echo EXISTE [SIM] - %%~a
		) else (
			echo EXISTE [NAO] - %%~a
			rem COPIAR: CRIAR | FIREWALL [PERMITIR]
			set /a fileQtdCopyPython+=1
			set "destino=!cd!\python%%~a.exe"
			echo F|xcopy /Q /Y /F "!cd!\python.exe" "!destino!"
			!3_BACKGROUND! /NOCONSOLE ""!fileWindows!\BAT\firewallAllowBlock.bat" "ALLOW" "!destino!" "NAO_MOSTRAR_POPUP""
		)
	)
)

!fileLog! "[NODE EXE] = [*** FIM ***] - [COPIADOS [NODEJS]: !fileQtdCopyNode!] - [COPIADOS [PYTHON]: !fileQtdCopyPython!]"
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nCOPIADOS [NODEJS]: !fileQtdCopyNode!\\nCOPIADOS [PYTHON]: !fileQtdCopyPython!"" & exit

rem ---------------------------------------------------------- APAGAR ------------------------------------------------------------------------------

:COPIA_APAGAR
rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO NODEJS
set fileQtdAllNode=0 & set fileQtdDelNode=0 & cd /d !fileWindows!\PORTABLE_NodeJS
for %%F in (*) do (
	set /a fileQtdAllNode+=1
    set "filename=%%~nxF"
	if not "!filename!" == "!filename:node=!" (
		if not "!filename!" == "!filename:.exe=!" (
			if /I "!filename!" == "node.exe" (
				echo [MANTER] - !filename!
			) else (
				rem COPIAR: APAGAR (EXCETO O PROPRIO) | FIREWALL [APAGAR REGRA]
				set /a fileQtdDelNode+=1
				echo [APAGAR] →→→ - !filename!
				del /f "!cd!\!filename!"
				!3_BACKGROUND! /NOCONSOLE ""!fileWindows!\BAT\firewallAllowBlock.bat" "DEL" "!cd!\!filename!" "NAO_MOSTRAR_POPUP""
			)
		) else (
			echo [NAO] - !filename!
		)
	) else (
		echo [NAO] - !filename!
	)
)

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO PYTHON
set fileQtdAllPython=0 & set fileQtdDelPython=0 & cd /d !fileWindows!\PORTABLE_Python
for %%F in (*) do (
	set /a fileQtdAllPython+=1
    set "filename=%%~nxF"
	if not "!filename!" == "!filename:python=!" (
		if not "!filename!" == "!filename:.exe=!" (
			if /I "!filename!" == "python.exe" (
				echo [MANTER] - !filename!
			) else (
				if /I "!filename!" == "pythonw.exe" (
					echo [MANTER] - !filename!
				) else (
					rem COPIAR: APAGAR (EXCETO O PROPRIO) | FIREWALL [APAGAR REGRA]
					set /a fileQtdDelPython+=1
					echo [APAGAR] →→→ - !filename!
					del /f "!cd!\!filename!"
					!3_BACKGROUND! /NOCONSOLE ""!fileWindows!\BAT\firewallAllowBlock.bat" "DEL" "!cd!\!filename!" "NAO_MOSTRAR_POPUP""
				)
			)
		) else (
			echo [NAO] - !filename!
		)
	) else (
		echo [NAO] - !filename!
	)
)

!fileLog! "[NODE EXE] = [*** FIM ***] - [APAGADOS [NODEJS]: !fileQtdDelNode!] - [APAGADOS [PYTHON]: !fileQtdDelPython!]"
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nAPAGADOS [NODEJS]: !fileQtdDelNode!\\nAPAGADOS [PYTHON]: !fileQtdDelPython!"" & exit


