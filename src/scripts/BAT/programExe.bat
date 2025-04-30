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
set "devMaster=ERRO" & set "nodeJsProjects=#" & set "pythonProjects=#"
for /f "usebackq delims=" %%a in ("!fileChrome_Extension!\src\master.json") do ( 
	set "conteudo=%%a"
	set "conteudo=!conteudo:"=!"
	if not "!conteudo!" == "!conteudo:master:=!" ( set "devMaster=!conteudo!" & goto DEVMASTER_ENCONTRADO )
)

!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\nDEVMASTER NAO ENCONTRADO!"" & exit
:DEVMASTER_ENCONTRADO

rem ************* AWS
rem set "nodeJsAws=WebSocket_server" & set "pythonAws=Chat_Python_server"
set "nodeJsAws=WebSocket_server" & set "pythonAws="
rem ************* ESTRELAR
set "nodeJsEstrelar=WebSocket_server,URA_Reversa_serverJsf,WebScraper_serverC6,WebScraper_serverC6_New2,WebScraper_serverC6_New3,WebScraper_serverC6_New4,WebScraper_serverC6_New5,WebScraper_serverC6_New6,WebScraper_serverC6_New7,WebScraper_serverC6_New8"
rem ************* OPSEUA
set "nodeJsOpseua=!nodeJsAws!,!nodeJsEstrelar!,IPTV_server;Sniffer_Python_server" & set "pythonOpseua=!pythonAws!,Sniffer_Python_server"

rem ************* AWS | ESTRELAR | OPSEUA
if not "!devMaster!" == "!devMaster:AWS=!" ( set "nodeJsOk=!nodeJsAws!" & set "pythonOk=!pythonAws!" )
if not "!devMaster!" == "!devMaster:ESTRELAR=!" ( set "nodeJsOk=!nodeJsEstrelar!" )
if not "!devMaster!" == "!devMaster:OPSEUA=!" ( set "nodeJsOk=!nodeJsOpseua!" & set "pythonOk=!pythonOpseua!" )

rem REMOVER DUPLICATAS (SEPARADOS POR ',') [NODEJS/PYTHON]
for %%a in ("%nodeJsOk:,=";"%") DO (
    if not !testA%%~a!==TRUE (
        set testA%%~a=TRUE
		if "!nodeJsProjects!"=="" ( set "nodeJsProjects=%%~a" ) else ( set "nodeJsProjects=!nodeJsProjects!,%%~a"  )
    )
)
for %%a in ("%pythonOk:,=";"%") DO (
    if not !testB%%~a!==TRUE (
        set testB%%~a=TRUE
        if "!pythonProjects!"=="" ( set "pythonProjects=%%~a" ) else ( set "pythonProjects=!pythonProjects!,%%~a"  )
    )
)

rem REMOVER VIRGULAS DESNECESSARIAS [NODEJS/PYTHON]
set "nodeJsOk=" & set "pythonOk="
for %%A in (!nodeJsProjects!) do ( if not "%%A"=="" ( if defined nodeJsOk ( set "nodeJsOk=!nodeJsOk!,%%A" ) else ( set "nodeJsOk=%%A" ) ) )
for %%A in (!pythonProjects!) do ( if not "%%A"=="" ( if defined pythonOk ( set "pythonOk=!pythonOk!,%%A" ) else ( set "pythonOk=%%A" ) ) )
set "nodeJsProjects=!nodeJsOk:#,=!" & set "pythonProjects=!pythonOk:#,=!"

rem ---------------------------------------------------------- CRIAR ------------------------------------------------------------------------------

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO NODEJS (CRIAR | FIREWALL [PERMITIR])
set fileQtdCopyNode=0 & set "fileNameCopyNode= "
if not "!nodeJsProjects!" == "!nodeJsProjects:_=!" ( 
	set "nodeJsProjects=!nodeJsProjects!," & cd /d !fileWindows!\PORTABLE_NodeJS
	powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "ALLOW" "!cd!\node.exe"
	for %%a in ("%nodeJsProjects:,=" "%") do (
		if not exist "!cd!\node%%~a.exe" (
			set /a fileQtdCopyNode+=1 & set "fileNameCopyNode=!fileNameCopyNode!node%%~a.exe "
			set "destino=!cd!\node%%~a.exe"
			echo F|xcopy /Q /Y /F "!cd!\node.exe" "!destino!"
			powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "ALLOW" "!destino!"
		)
	)
)

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO PYTHON (CRIAR | FIREWALL [PERMITIR])
set fileQtdCopyPython=0 & set "fileNameCopyPython= "
if not "!pythonProjects!" == "!pythonProjects:_=!" ( 
	set "pythonProjects=!pythonProjects!," & cd /d !fileWindows!\PORTABLE_Python
	powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "ALLOW" "!cd!\python.exe"
	for %%a in ("%pythonProjects:,=" "%") do (
		if not exist "!cd!\python%%~a.exe" (
			set /a fileQtdCopyPython+=1 & set "fileNameCopyPython=!fileNameCopyPython!python%%~a.exe "
			set "destino=!cd!\python%%~a.exe"
			echo F|xcopy /Q /Y /F "!cd!\python.exe" "!destino!"
			powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "ALLOW" "!destino!"
		)
	)
)

!fileLog! "[NODE EXE] = [*** FIM ***] - COPIADOS [NODEJS]: !fileQtdCopyNode! -!fileNameCopyNode!" & !fileLog! "[NODE EXE] = [*** FIM ***] - COPIADOS [PYTHON]: !fileQtdCopyPython! -!fileNameCopyPython!"
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nCOPIADOS [NODEJS]: !fileQtdCopyNode!\\nCOPIADOS [PYTHON]: !fileQtdCopyPython!"" & exit

rem ---------------------------------------------------------- APAGAR ------------------------------------------------------------------------------

:COPIA_APAGAR
rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO NODEJS (APAGAR (EXCETO O PROPRIO) | FIREWALL [APAGAR REGRA])
set fileQtdAllNode=0 & set fileQtdDelNode=0 & set "fileNamedDelNode= " & cd /d !fileWindows!\PORTABLE_NodeJS
powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "DELETE" "!cd!\node.exe"
for %%F in (*) do (
	set /a fileQtdAllNode+=1
    set "filename=%%~nxF"
	if not "!filename!" == "!filename:node=!" (
		if not "!filename!" == "!filename:.exe=!" (
			if /I not "!filename!" == "node.exe" (
				set /a fileQtdDelNode+=1
				del /f "!cd!\!filename!" & set "fileNamedDelNode=!fileNamedDelNode!!filename! "
				powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "DELETE" "!cd!\!filename!"
			)
		) 
	)
)

rem → ************* ALTERAR LOCAL DO TERMINAL PARA A PASTA DO PYTHON (APAGAR (EXCETO O PROPRIO) | FIREWALL [APAGAR REGRA])
set fileQtdAllPython=0 & set fileQtdDelPython=0 & set "fileNamedDelPython= " & cd /d !fileWindows!\PORTABLE_Python
powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "DELETE" "!cd!\python.exe"
for %%F in (*) do (
	set /a fileQtdAllPython+=1
    set "filename=%%~nxF"
	if not "!filename!" == "!filename:python=!" (
		if not "!filename!" == "!filename:.exe=!" (
			if /I not "!filename!" == "python.exe" (
				if /I not "!filename!" == "pythonw.exe" (
					set /a fileQtdDelPython+=1
					del /f "!cd!\!filename!" & set "fileNamedDelPython=!fileNamedDelPython!!filename! "
					powershell "!fileWindows!\BAT\firewallAllowBlockDelete.ps1" "DELETE" "!cd!\!filename!"
				)
			)
		)
	)
)

!fileLog! "[NODE EXE] = [*** FIM ***] - APAGADOS [NODEJS]: !fileQtdDelNode! -!fileNamedDelNode!" & !fileLog! "[NODE EXE] = [*** FIM ***] - APAGADOS [PYTHON]: !fileQtdDelPython! -!fileNamedDelPython!"
!3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nAPAGADOS [NODEJS]: !fileQtdDelNode!\\nAPAGADOS [PYTHON]: !fileQtdDelPython!"" & exit


