@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!"=="" ( !fileMsg! "[!local!\!arquivo!]\n\nNao usar o BAT/BACKGROUND" & exit )

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
rem set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem ALTERAR LOCAL PARA PASTA 'PORTABLE_NodeJS'
set "local=!fileWindows!\PORTABLE_NodeJS"

rem LOCAL DE EXCUCAO DO TERMINAL
cd\ & !letra!: & cd "!local!"

if "!arg1!"=="APAGAR" ( goto COPIA_APAGAR )
if "!arg1!"=="CRIAR" ( goto COPIA_CRIAR )
!fileMsg! "[!local!\!arquivo!]\nParamentro invalido. Deve ser 'APAGAR' ou 'CRIAR'" & exit

:COPIA_CRIAR
rem CRIAR COPIA nodeExe
set "projects=WebSocket_server"

rem IDENTIFICAR O DEVMASTER PELO CONFIG
set "conteudo="
for /f "usebackq delims=" %%a in ("!fileChrome_Extension!\src\master.json") do ( set "conteudo=!conteudo!%%a" )

rem AWS
set "search=master": "AWS"
set "resultDevMaster=!conteudo:%search%=!"
if /I "!resultDevMaster!" neq "!conteudo!" ( set "projects=!projects!" )

rem NOTEBOOK
set "search=master": "OPSEUA"
set "resultDevMaster=!conteudo:%search%=!"
if /I "!resultDevMaster!" neq "!conteudo!" ( set "projects=!projects!;Sniffer_Python_server;WebScraper_serverC6;WebScraper_serverC6_New2;WebScraper_serverC6_New3;WebScraper_serverC6_New4;WebScraper_serverC6_New5" )

rem ESTRELAR
set "search=master": "ESTRELAR"
set "resultDevMaster=!conteudo:%search%=!"
if /I "!resultDevMaster!" neq "!conteudo!" ( set "projects=!projects!;Sniffer_Python_server;WebScraper_serverC6;WebScraper_serverC6_New2;WebScraper_serverC6_New3;WebScraper_serverC6_New4;WebScraper_serverC6_New5" )

set "projects=!projects!;"
set fileQtdCopy=0
for %%a in ("%projects:;=" "%") do (
    if exist "!local!\node%%~a.exe" (
        echo EXISTE [SIM] - %%~a
    ) else (
        echo EXISTE [NAO] - %%~a
        rem CRIAR A NOVA COPIA
		set /a fileQtdCopy+=1
        set "origem=!local!\node.exe"
        set "destino=!local!\node%%~a.exe"
        echo F|xcopy /Q /Y /F "!origem!" "!destino!"
		rem FIREWALL [PERMITIR]
		!2_BACKGROUND! !fileWindows!\BAT\firewallAllowBlock.bat ALLOW !destino! NAO_MOSTRAR_POPUP
    )
)
!fileMsg! "[!local!\!arquivo!]\n\nCopiados: !fileQtdCopy!" & exit

:COPIA_APAGAR
rem APAGAR OS nodeExe ANTIGOS (EXCETO O PROPRIO 'node.exe')
set fileQtdAll=0
set fileQtdDel=0
for %%F in (*) do (
	set /a fileQtdAll+=1
    set "filename=%%~nxF"
	if not "!filename!"=="!filename:node=!" (
		if not "!filename!"=="!filename:.exe=!" (
			if /I "!filename!"=="node.exe" (
				echo [MANTER] - !filename!
			) else (
				set /a fileQtdDel+=1
				echo [APAGAR] →→→ - !filename!
				del /f "!local!\!filename!"
				rem FIREWALL [APAGAR REGRA]
				!2_BACKGROUND! !fileWindows!\BAT\firewallAllowBlock.bat DEL !local!\!filename! NAO_MOSTRAR_POPUP
			)
		) else (
			echo [NAO] - !filename!
		)
	) else (
		echo [NAO] - !filename!
	)
)
!fileMsg! "[!local!\!arquivo!]\n\nTotal de arquivos: !fileQtdAll!\nDeletados: !fileQtdDel!" & exit





