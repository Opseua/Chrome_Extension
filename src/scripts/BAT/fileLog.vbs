rem IDENTIFICAR O ARQUIVO E A LOCALIZACAO COMPLETA (sem o nome do arquivo)
Set objFSO = CreateObject("Scripting.FileSystemObject")
arquivo = objFSO.GetFileName(WScript.ScriptFullName)
arquivoSemExtensao = Replace(arquivo, ".vbs", "")
localizacao = objFSO.GetParentFolderName(WScript.ScriptFullName)

rem DIVIDIR O CAMINHO POR '\' | QUANTIDADE DE ARRAYs | ULTIMA PASTA | LETRA DA UNIDADE
arr = Split(localizacao, ":\")
letra = arr(0)

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
	hora = HoraPadrao12(hora)
	rem #####################################################################s
	
	hora = Right("00" & hora, 2)
	completaData = "z_MES_" & mes & "_DIA_" & dia
    completaHora = hora & ":" & minuto & ":" & segundo & "." & milissegundo & horaAmPm

	rem VERIFICAR SE O ARQUIVO EXISTE
	pathArquivo = letra & ":\ARQUIVOS\WINDOWS\BAT\z_log\" & completaData & ".txt"
    Dim fsoFile
    If Not objFSO.FileExists(pathArquivo) Then
		rem EXISTE NAO. CRIAR
        Set fsoFile = objFSO.CreateTextFile(pathArquivo)
    Else
		rem EXISTE SIM. ABRIR
        Set fsoFile = objFSO.OpenTextFile(pathArquivo, 8)
    End If
	
    rem CONCATENANDO DATA E HORA COM TEXTO
    strLine = completaHora & " - " & Wscript.Arguments.Item(0)

    rem ESCREVENDO NO ARQUIVO E FECHAR
    fsoFile.WriteLine(strLine)
    fsoFile.Close
End If

rem ENCERRAR SCRIPT
Wscript.Quit
