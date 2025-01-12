rem COMO USAR
rem %fileNircmdSetSize% "System Informer" "890 50 600 400"

rem BIBLIOTECA NECESSARIA
Set objFSO = CreateObject("Scripting.FileSystemObject")

If WScript.Arguments.Count <= 1 Then
	arquivo = objFSO.GetFileName(WScript.ScriptFullName)
	localizacao = objFSO.GetParentFolderName(WScript.ScriptFullName)

    If WScript.Arguments.Count = 0 Then
		rem NENHUM PARAMENTRO PASSADO
		MsgBox (Replace(  "[" & localizacao & "\" & arquivo & "]\\n\\nNENHUM PARAMETRO PASSADO"  , "\\n" , Chr(13)))
    Else
		rem PARAMETROS INVALIDOS
		MsgBox (Replace(  "[" & localizacao & "\" & arquivo & "]\\n\\nPARAMETROS INVALIDOS. Exemplo:\\n" & arquivo & " " & "'TITULO_DA_JANELA' '15 65 500 300'"  , "\\n", Chr(13) ))
    End If
Else
	rem Definir variaveis
	windowResize = WScript.Arguments.Item(1)
	
	rem Posicionamento padrao
	If InStr(objFSO.GetParentFolderName(WScript.ScriptFullName), "D:\") Then
		rem OPSEUA
		If InStr(windowResize, "WINTP1") Then
			windowResize = "15 65 480 300"
		ElseIf InStr(windowResize, "WINTP2") Then
			windowResize = "15 380 480 300"
		ElseIf InStr(windowResize, "WINTP3") Then
			windowResize = "15 695 480 300"
		ElseIf InStr(windowResize, "WINTP4") Then
			windowResize = "520 65 480 300"
		ElseIf InStr(windowResize, "WINTP5") Then
			windowResize = "520 380 480 300"
		ElseIf InStr(windowResize, "WINTP6") Then
			windowResize = "520 695 480 300"
		End If
	Else
		rem EC2/AWS/ESTRELAR
		If InStr(windowResize, "WINTP1") Then
			windowResize = "15 50 410 300"
		ElseIf InStr(windowResize, "WINTP2") Then
			windowResize = "15 350 410 300"
		ElseIf InStr(windowResize, "WINTP3") Then
			windowResize = "15 650 410 300"
		ElseIf InStr(windowResize, "WINTP4") Then
			windowResize = "420 50 410 300"
		ElseIf InStr(windowResize, "WINTP5") Then
			windowResize = "420 350 410 300"
		ElseIf InStr(windowResize, "WINTP6") Then
			windowResize = "420 650 410 300"
		End If
	End If

	CreateObject("Shell.Application").ShellExecute CreateObject("WScript.Shell").ExpandEnvironmentStrings("%fileWindows%") & "\BAT\nircmd.exe", "win setsize ititle " & """" & WScript.Arguments.Item(0) & """" & " " & windowResize & "", , "runas", 1
End If

rem ENCERRAR SCRIPT
Wscript.Quit


