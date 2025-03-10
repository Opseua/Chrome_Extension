@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "local=%~dp0" & set "local=!local:~0,-1!" & set "letra=!local:~0,1!" & set "arquivo=%~nx0" & set "argString=%*" & set "arg1=%~1"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" == "" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nNENHUM PARAMETRO PASSADO"" & exit )
rem NET SESSION > nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )
rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a" & set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"
rem ********************************************************************************************************************************************************

rem REGISTRAR GATILHO
!fileLog! "[NODE EXE] = [### INICIOU ###] (P: !arg1!)"

if "!arg1!" == "APAGAR" ( goto COPIA_APAGAR ) else ( if "!arg1!" == "CRIAR" ( goto COPIA_CRIAR ) )
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nPARAMETROS INVALIDOS. Exemplo:\\n\\n!arquivo! 'APAGAR/CRIAR'"" & exit

:COPIA_CRIAR
rem IDENTIFICAR O DEVMASTER PELO CONFIG (NAO SUBIR!!!)
set "devMaster=ERRO" & set "projectsNode=#" & set "projectsPython=#"
for /f "usebackq delims=" %%a in ("!fileChrome_Extension!\src\master.json") do ( 
	set "conteudo=%%a"
	set "conteudo=!conteudo:"=!"
	if not "!conteudo!" == "!conteudo:master:=!" ( set "devMaster=!conteudo!" & goto DEVMASTER_ENCONTRADO )
)

!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\nDEVMASTER NAO ENCONTRADO!"" & exit
:DEVMASTER_ENCONTRADO

rem ************* AWS
set "awsNodeJs=WebSocket_server,WebSocket_server" & set "awsPython=Chat_Python_server"
rem ************* ESTRELAR
set "estrelarNodeJs=WebSocket_server,URA_Reversa_serverJsf,WebScraper_serverC6,WebScraper_serverC6_New2,WebScraper_serverC6_New3,WebScraper_serverC6_New4,WebScraper_serverC6_New5,WebScraper_serverC6_New6,WebScraper_serverC6_New7,WebScraper_serverC6_New8"
rem ************* OPSEUA
set "opseuaNodeJs=!awsNodeJs!,!estrelarNodeJs!,Sniffer_Python_server" & set "opseuaPython=!awsPython!,Sniffer_Python_server" & set "newstringNodeJs=" & set "newstringPython="

rem RMEOVER DUPLICATAS (SEPARADOS POR ',') [APENAS DO 'OPSEUA'] {NODEJS/PYTHON}
for %%a in ("%opseuaNodeJs:,=";"%") DO (
    if not !test%%~a!==TRUE (
        set test%%~a=TRUE
		if "!newstringNodeJs!"=="" ( set "newstringNodeJs=%%~a" ) else ( set "newstringNodeJs=!newstringNodeJs!,%%~a"  )
    )
)
for %%a in ("%opseuaPython:,=";"%") DO (
    if not !test%%~a!==TRUE (
        set test%%~a=TRUE
        if "!newstringPython!"=="" ( set "newstringPython=%%~a" ) else ( set "newstringPython=!newstringPython!,%%~a"  )
    )
)

rem ************* AWS
if not "!devMaster!" == "!devMaster:AWS=!" ( set "projectsNode=!awsNodeJs!" & set "projectsPython=!awsPython!" )
rem ************* ESTRELAR
if not "!devMaster!" == "!devMaster:ESTRELAR=!" ( set "projectsNode=!estrelarNodeJs!" )
rem ************* OPSEUA
if not "!devMaster!" == "!devMaster:OPSEUA=!" ( set "projectsNode=!newstringNodeJs!" & set "projectsPython=!newstringPython!" )

rem ---------------------------------------------------------- CRIAR ------------------------------------------------------------------------------

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO NODEJS (CRIAR | FIREWALL [PERMITIR])
set fileQtdCopyNode=0 & set "fileNameCopyNode= "
if not "!projectsNode!" == "!projectsNode:_=!" ( 
	set "projectsNode=!projectsNode!," & cd /d !fileWindows!\PORTABLE_NodeJS
	for %%a in ("%projectsNode:,=" "%") do (
		if not exist "!cd!\node%%~a.exe" (
			set /a fileQtdCopyNode+=1 & set "fileNameCopyNode=!fileNameCopyNode!node%%~a.exe "
			set "destino=!cd!\node%%~a.exe"
			echo F|xcopy /Q /Y /F "!cd!\node.exe" "!destino!"
			!3_BACKGROUND! /NOCONSOLE ""!fileWindows!\BAT\firewallAllowBlock.bat" "ALLOW" "!destino!" "NAO_MOSTRAR_POPUP""
		)
	)
)

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO PYTHON (CRIAR | FIREWALL [PERMITIR])
set fileQtdCopyPython=0 & set "fileNameCopyPython= "
if not "!projectsPython!" == "!projectsPython:_=!" ( 
	set "projectsPython=!projectsPython!," & cd /d !fileWindows!\PORTABLE_Python
	for %%a in ("%projectsPython:,=" "%") do (
		if not exist "!cd!\python%%~a.exe" (
			set /a fileQtdCopyPython+=1 & set "fileNameCopyPython=!fileNameCopyPython!python%%~a.exe "
			set "destino=!cd!\python%%~a.exe"
			echo F|xcopy /Q /Y /F "!cd!\python.exe" "!destino!"
			!3_BACKGROUND! /NOCONSOLE ""!fileWindows!\BAT\firewallAllowBlock.bat" "ALLOW" "!destino!" "NAO_MOSTRAR_POPUP""
		)
	)
)

!fileLog! "[NODE EXE] = [*** FIM ***] - COPIADOS [NODEJS]: !fileQtdCopyNode! -!fileNameCopyNode!" & !fileLog! "[NODE EXE] = [*** FIM ***] - COPIADOS [PYTHON]: !fileQtdCopyPython! -!fileNameCopyPython!"
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nCOPIADOS [NODEJS]: !fileQtdCopyNode!\\nCOPIADOS [PYTHON]: !fileQtdCopyPython!"" & exit

rem ---------------------------------------------------------- APAGAR ------------------------------------------------------------------------------

:COPIA_APAGAR
rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO NODEJS (APAGAR (EXCETO O PROPRIO) | FIREWALL [APAGAR REGRA])
set fileQtdAllNode=0 & set fileQtdDelNode=0 & set "fileNamedDelNode= " & cd /d !fileWindows!\PORTABLE_NodeJS
for %%F in (*) do (
	set /a fileQtdAllNode+=1
    set "filename=%%~nxF"
	if not "!filename!" == "!filename:node=!" (
		if not "!filename!" == "!filename:.exe=!" (
			if /I not "!filename!" == "node.exe" (
				set /a fileQtdDelNode+=1
				del /f "!cd!\!filename!" & set "fileNamedDelNode=!fileNamedDelNode!!filename! "
				!3_BACKGROUND! /NOCONSOLE ""!fileWindows!\BAT\firewallAllowBlock.bat" "DEL" "!cd!\!filename!" "NAO_MOSTRAR_POPUP""
			)
		) 
	)
)

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO PYTHON (APAGAR (EXCETO O PROPRIO) | FIREWALL [APAGAR REGRA])
set fileQtdAllPython=0 & set fileQtdDelPython=0 & set "fileNamedDelPython= " & cd /d !fileWindows!\PORTABLE_Python
for %%F in (*) do (
	set /a fileQtdAllPython+=1
    set "filename=%%~nxF"
	if not "!filename!" == "!filename:python=!" (
		if not "!filename!" == "!filename:.exe=!" (
			if /I not "!filename!" == "python.exe" (
				if /I not "!filename!" == "pythonw.exe" (
					set /a fileQtdDelPython+=1
					del /f "!cd!\!filename!" & set "fileNamedDelPython=!fileNamedDelPython!!filename! "
					!3_BACKGROUND! /NOCONSOLE ""!fileWindows!\BAT\firewallAllowBlock.bat" "DEL" "!cd!\!filename!" "NAO_MOSTRAR_POPUP""
				)
			)
		)
	)
)

!fileLog! "[NODE EXE] = [*** FIM ***] - APAGADOS [NODEJS]: !fileQtdDelNode! -!fileNamedDelNode!" & !fileLog! "[NODE EXE] = [*** FIM ***] - APAGADOS [PYTHON]: !fileQtdDelPython! -!fileNamedDelPython!"
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nAPAGADOS [NODEJS]: !fileQtdDelNode!\\nAPAGADOS [PYTHON]: !fileQtdDelPython!"" & exit


