rem COMO USAR
rem %fileLog% "ISSO SERA ESCRITO"

rem IDENTIFICAR O ARQUIVO E A LOCALIZACAO COMPLETA
Set objFSO = CreateObject("Scripting.FileSystemObject")
arquivo = objFSO.GetFileName(WScript.ScriptFullName)
localizacao = objFSO.GetParentFolderName(WScript.ScriptFullName)

rem DIVIDIR O CAMINHO POR '\' | QUANTIDADE DE ARRAYs | ULTIMA PASTA | LETRA DA UNIDADE
arr = Split(localizacao, ":\")
letra = arr(0)

Set WshShell = CreateObject("WScript.Shell")

rem PEGAR VARIAVEL DE AMBIENTE
fileWindows = WshShell.ExpandEnvironmentStrings("%fileWindows%")

If WScript.Arguments.Count = 0 Then
	rem NENHUM PARAMENTRO PASSADO
	MsgBox (Replace(  "[" & localizacao & "\" & arquivo & "]\n\nNao usar o VBS"  ,"\n",Chr(13)))
Else
	rem PARAMENTROS PASSADOS
    rem  DEFININDO A DATA E HORA ATUAL
    dataAtual = Now
	horaAmPm = ""
    dia = Right("00" & Day(dataAtual), 2)
    mes = Right("00" & Month(dataAtual), 2)
    ano = Year(dataAtual)
    rem hora = Right("00" & Hour(dataAtual), 2)
	hora = Hour(dataAtual)
    minuto = Right("00" & Minute(dataAtual), 2)
    segundo = Right("00" & Second(dataAtual), 2)
    milissegundo = Right("000" & Round((Timer - Int(Timer)) * 1000), 3)
	
	rem #####################################################################
	rem CONVERTER PARA O FORMATO '12 HORAS' (SE NECESSARIO)
	Function HoraPadrao12(hora)
		If hora < 13 Then
			horaAmPm = " AM"
		Else
			horaAmPm = " PM"
			hora = hora - 12
		End If
		HoraPadrao12 = hora
	End Function
	rem hora = HoraPadrao12(hora)
	rem #####################################################################
	
	rem #####################################################################
	rem ESCREVER NO ARQUIVO (CRIAR OU ADICIONAR)
	Function fileWriteAppend(filePath, textToWrite)
		Dim attempt, fsoFile
		Set objFSO = CreateObject("Scripting.FileSystemObject")
		rem DESATIVAR AVISO DE ERROS
		On Error GoTo 0
		For attempt = 1 To 50
			rem DESATIVAR AVISO DE ERROS TEMPORARIOS
			On Error Resume Next
			If Not objFSO.FileExists(filePath) Then
				rem EXISTE NAO. CRIAR
				Set fsoFile = objFSO.CreateTextFile(filePath)
			Else
				rem EXISTE SIM. ABRIR
				Set fsoFile = objFSO.OpenTextFile(filePath, 8)
			End If
			rem ESCREVER NO ARQUIVO E FECHAR
			fsoFile.WriteLine(textToWrite)
			fsoFile.Close
			If Err.Number = 0 Then
				rem ERRO NAO. SAIR DO LOOP
				Exit For
			Else
				rem ERRO SIM. LIMPAR ERRO ATUAL. ESPERAR x MILESSEGUNDOS E VOLTAR PARA O LOOP (ESPERAR NO MAXIMO 5 SEGUNDOS)
				Err.Clear
				WScript.Sleep(100)
			End If
		Next
	End Function
	rem #####################################################################
	
	hora = Right("00" & hora, 2)
	completaData = "z_MES_" & mes & "_DIA_" & dia
    completaHora = hora & ":" & minuto & ":" & segundo & "." & milissegundo & horaAmPm

	pathArquivo = fileWindows & "\BAT\z_log\" & completaData & ".txt"
    strLine = completaHora & " - " & Wscript.Arguments.Item(0)
	fileWriteAppend pathArquivo, strLine
End If

rem ENCERRAR SCRIPT
Wscript.Quit
