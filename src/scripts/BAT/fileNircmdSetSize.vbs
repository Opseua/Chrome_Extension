rem COMO USAR
rem %fileNircmdSetSize% "stem Inform" "890 50 600 400" (BUSCANDO POR PARTE DO NOME) [PARAMENTROS: 3]
rem %fileNircmdSetSize% "System Informer" "890 50 600 400" "EXATO" (BUSCANDO PELO NOME EXATO) [PARAMENTROS: 4]

rem ARGUMENTOS QTD
argsQtd = WScript.Arguments.Count

rem BIBLIOTECA NECESSARIA
Set objFSO = CreateObject("Scripting.FileSystemObject")

If argsQtd <= 1 Then
	arquivo = objFSO.GetFileName(WScript.ScriptFullName)
	localizacao = objFSO.GetParentFolderName(WScript.ScriptFullName)

	If argsQtd = 0 Then
		rem NENHUM PARAMENTRO PASSADO
		MsgBox ( Replace(  "[" & localizacao & "\" & arquivo & "]\\n\\nNENHUM PARAMETRO PASSADO"  , "\\n" , Chr(13)) )
	Else
		rem PARAMETROS INVALIDOS
		MsgBox ( Replace(  "[" & localizacao & "\" & arquivo & "]\\n\\nPARAMETROS INVALIDOS. Exemplo:\\n" & arquivo & " " & "'TITULO_DA_JANELA' '15 65 500 300'"  , "\\n", Chr(13) ) )
	End If
Else
	rem Definir variaveis
	windowResize = WScript.Arguments.Item(1)
	
	rem Posicionamento padrao
	If InStr(objFSO.GetParentFolderName(WScript.ScriptFullName), "D:\") Then
		rem OPSEUA
		If InStr(windowResize, "WINTP12") Then
			windowResize = "1440 695 480 300"
		ElseIf InStr(windowResize, "WINTP11") Then
			windowResize = "1440 380 480 300"
		ElseIf InStr(windowResize, "WINTP10") Then
			windowResize = "1440 65 480 300"
		ElseIf InStr(windowResize, "WINTP9") Then
			windowResize = "965 695 480 300"
		ElseIf InStr(windowResize, "WINTP8") Then
			windowResize = "965 380 480 300"
		ElseIf InStr(windowResize, "WINTP7") Then
			windowResize = "965 65 480 300"
		ElseIf InStr(windowResize, "WINTP6") Then
			windowResize = "490 695 480 300"
		ElseIf InStr(windowResize, "WINTP5") Then
			windowResize = "490 380 480 300"
		ElseIf InStr(windowResize, "WINTP4") Then
			windowResize = "490 65 480 300"
		ElseIf InStr(windowResize, "WINTP3") Then
			windowResize = "15 695 480 300"
		ElseIf InStr(windowResize, "WINTP2") Then
			windowResize = "15 380 480 300"
		ElseIf InStr(windowResize, "WINTP1") Then
			windowResize = "15 65 480 300"
		End If
	Else
		rem SERVIDORES
		If InStr(windowResize, "WINTP12") Then
			windowResize = "1230 650 410 300"
		ElseIf InStr(windowResize, "WINTP11") Then
			windowResize = "1230 350 410 300"
		ElseIf InStr(windowResize, "WINTP10") Then
			windowResize = "1230 50 410 300"
		ElseIf InStr(windowResize, "WINTP9") Then
			windowResize = "825 650 410 300"
		ElseIf InStr(windowResize, "WINTP8") Then
			windowResize = "825 350 410 300"
		ElseIf InStr(windowResize, "WINTP7") Then
			windowResize = "825 50 410 300"
		ElseIf InStr(windowResize, "WINTP6") Then
			windowResize = "420 650 410 300"
		ElseIf InStr(windowResize, "WINTP5") Then
			windowResize = "420 350 410 300"
		ElseIf InStr(windowResize, "WINTP4") Then
			windowResize = "420 50 410 300"
		ElseIf InStr(windowResize, "WINTP3") Then
			windowResize = "15 650 410 300"
		ElseIf InStr(windowResize, "WINTP2") Then
			windowResize = "15 350 410 300"
		ElseIf InStr(windowResize, "WINTP1") Then
			windowResize = "15 50 410 300"
		End If
	End If
	
	rem BIBLIOTECAS VBS
	Set Shell = CreateObject("Shell.Application"): Set WshShell = CreateObject("WScript.Shell"): nircmd = WshShell.ExpandEnvironmentStrings("%nircmd%")
	
	rem (BUSCANDO POR PARTE DO NOME) | (BUSCANDO PELO NOME EXATO)
	If argsQtd = 2 Then: nircmdPar = "ititle": Else: nircmdPar = "title": End If

	rem POSICIONAR JANELA
	comm = "win setsize" & " " & nircmdPar & " " & """" & WScript.Arguments.Item(0) & """" & " " & windowResize: Shell.ShellExecute nircmd, comm, , "runas", 0
	
	rem ESPERAR E ATIVAR JANELA (PARA O CHROME NAO FICAR NA FRENTE)
	comm = "win activate" & " " & "ititle" & " " & "_WIND": Shell.ShellExecute "cmd", "/c " & "ping -n 3 -w 1000 127.0.0.1 > nul & " & nircmd & " " & comm, , "runas", 0
	
End If

rem ENCERRAR SCRIPT
Wscript.Quit


