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
ElseIf Not (WScript.Arguments.Count > 1) Then
	rem Paramentros invalidos
	MsgBox (Replace(  "[" & localizacao & "\" & arquivo & "]\n\nParametros invalidos. Exemplo:\n" & arquivo & " " & "'MANUAL/RESTART' 'NOME_DO_PROCESSO'"  ,"\n",Chr(13)))
Else
    rem Definir variaveis
    Dim fsoFile, timeManual, timeReboot, rebootQtd, dif, allow, obs, strLine
    runType = WScript.Arguments.Item(0)
    idProcess = WScript.Arguments.Item(1)
    timeNow = DateDiff("s", #1/1/1970 00:00:00 AM#, Now())

    rem Verificar se o arquivo existe
    pathArquivo = letra & ":\ARQUIVOS\WINDOWS\BAT\z_log\logTime_" & idProcess & ".txt"
    If Not objFSO.FileExists(pathArquivo) Then
	    rem Se o arquivo nao existe, definir valores padrao
        timeManual = timeNow
        timeReboot = timeNow
        rebootQtd = 0
		allow = "SIM"
        obs = "NUNCA_EXECUTADO"
    Else
	    rem Se o arquivo existe, ler os dados
        Set fsoFile = objFSO.OpenTextFile(pathArquivo, 1)
        conteudoArquivo = fsoFile.ReadAll
        fsoFile.Close
        pars = Split(conteudoArquivo, "@")
        timeManual = pars(3)
        timeReboot = pars(5)
        rebootQtd = pars(7)

		rem Calcular a diferença de tempo e determinar permissao
		If Not runType = "RESTART" Then
			dif = timeNow - timeManual
			rebootQtd = 0
			If dif > 6 Then
				allow = "SIM"
				obs = "EXECUTAR"
				timeManual = timeNow
			Else
				allow = "NAO"
				obs = "MUITO_RECENTE"
			End If
		Else
			dif = timeNow - timeReboot
			If dif > 59 Then
				allow = "SIM"
				obs = "RESTART_ANTIGO"
				timeReboot = timeNow
				rebootQtd = 1
			ElseIf rebootQtd > 4 Then
				allow = "NAO"
				obs = "MUITOS_RESTARTS"
			Else
				allow = "SIM"
				obs = "POUCOS_RESTARTS"
				timeReboot = timeNow
				rebootQtd = rebootQtd + 1
			End If
		End If
    End If

    rem Abrir o arquivo para escrita
    Set fsoFile = objFSO.CreateTextFile(pathArquivo, True)

    rem Gerar a linha de texto
    strLine = "atual@" & timeNow & "@manual@" & timeManual & "@reboot@" & timeReboot & "@reboot_qtd@" & rebootQtd & "@diferenca@" & dif & "@permitido@" & allow & "@obs@" & obs

    rem Escrever no arquivo
    fsoFile.Write strLine

    rem Fechar o arquivo
    fsoFile.Close
End If

rem WScript.Sleep 5000

rem ENCERRAR SCRIPT
Wscript.Quit