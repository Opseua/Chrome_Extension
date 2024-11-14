rem COMO USAR
rem %fileMsg% "TITULO\n\nTexto"

rem IDENTIFICAR O ARQUIVO E A LOCALIZACAO COMPLETA
Set objFSO = CreateObject("Scripting.FileSystemObject")
arquivo = objFSO.GetFileName(WScript.ScriptFullName)
localizacao = objFSO.GetParentFolderName(WScript.ScriptFullName)

rem DIVIDIR O CAMINHO POR '\' | QUANTIDADE DE ARRAYs | ULTIMA PASTA | LETRA DA UNIDADE
arr = Split(localizacao, ":\")
letra = arr(0)

If WScript.Arguments.Count = 0 Then
	rem NENHUM PARAMENTRO PASSADO
	MsgBox (Replace(  "[" & localizacao & "\" & arquivo & "]\n\nNao usar o VBS"  ,"\n",Chr(13)))
Else
	rem PARAMENTROS PASSADOS
	rem MOSTRAR POPUP
	MsgBox (Replace(  Wscript.Arguments.Item(0)  ,"\n",Chr(13)))
End If

rem ENCERRAR SCRIPT
Wscript.Quit
