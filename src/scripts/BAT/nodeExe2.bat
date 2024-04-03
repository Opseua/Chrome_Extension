@chcp 65001 && @echo off && setlocal enabledelayedexpansion
set "letra=%~d0" &&  set "local=%~dp0"
set "letra=%letra:~0,1%" && set "local=%local:~0,-1%" && set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" && set "argTUDO=%~1 %~2 %~3 %~4 %~5" && set "arg1=%~1" && set "arg2=%~2" && set "arg3=%~3" && set "arg4=%~4"

rem set "start=ERRO" & set "adm=ERRO" && NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
rem set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!" & set "fileAll=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\z_MES_!mes!_DIA_!dia!.txt"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!"=="" ( msg * "[!local!\!arquivo!] Usar o atalho e nao o executavel" & exit )

rem ALTERAR LOCAL PARA PASTA 'PORTABLE_NodeJS'
set "local=!letra!:\ARQUIVOS\WINDOWS\PORTABLE_NodeJS"

rem LOCAL DE EXCUCAO DO TERMINAL
cd\ & !letra!: & cd "!local!"

if "!arg1!"=="APAGAR" ( goto COPIA_APAGAR )
if "!arg1!"=="CRIAR" ( goto COPIA_CRIAR )
msg * "[!local!\!arquivo!] Paramentro invalido. Deve ser 'APAGAR' ou 'CRIAR'" & exit

:COPIA_CRIAR
rem CRIAR COPIA nodeExe
set "projects=nodeZPm2JList;Chrome_Extension;Chrome_ExtensionOld;Sniffer_Python_server;URA_Reversa_serverJsf;URA_Reversa_serverTelein;WebScraper_serverC6;WebScraper_serverJucesp"
set "projects=!projects!;WebSocket_server;WebSocketOld_server"
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
    )
)
msg * "Copiados: !fileQtdCopy!" & exit

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
			)
		) else (
			echo [NAO] - !filename!
		)
	) else (
		echo [NAO] - !filename!
	)
)
msg * "Total de arquivos: !fileQtdAll! - Deletados: !fileQtdDel!" & exit





