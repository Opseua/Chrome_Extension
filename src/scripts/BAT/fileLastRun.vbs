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
ElseIf Not (WScript.Arguments.Count > 1) Then
	rem PARAMENTROS INVALIDOS
	MsgBox (Replace(  "[" & localizacao & "\" & arquivo & "]\n\nParametros invalidos. Exemplo:\n" & arquivo & " " & "'MANUAL/RESTART' 'NOME_DO_PROCESSO'"  ,"\n",Chr(13)))
Else
    rem DEFINIR VARIAVEIS
    Dim fsoFile, timeManual, timeReboot, rebootQtd, dif, allow, obs, strLine
    runType = WScript.Arguments.Item(0)
    idProcess = WScript.Arguments.Item(1)
    timeNow = DateDiff("s", #1/1/1970 00:00:00 AM#, Now())

    rem VERIFICAR SE O ARQUIVO EXISTE
    pathArquivo = letra & ":\ARQUIVOS\WINDOWS\BAT\z_log\logTime_" & idProcess & ".txt"
    If Not objFSO.FileExists(pathArquivo) Then
	    rem SE O ARQUIVO NAO EXISTIR, DEFINIR VALORES PADROES
        timeManual = timeNow
        timeReboot = timeNow
        rebootQtd = 0
		allow = "SIM"
        obs = "NUNCA_EXECUTADO"
    Else
	    rem SE O ARQUIVO EXISTIR, LER OS DADOS
        Set fsoFile = objFSO.OpenTextFile(pathArquivo, 1)
        conteudoArquivo = fsoFile.ReadAll
        fsoFile.Close
        pars = Split(conteudoArquivo, "@")
        timeManual = pars(3)
        timeReboot = pars(5)
        rebootQtd = pars(7)

		rem CALCULAR A DIFERENCA DE TEMPO E DETERMINAR A PERMISSAO
		If InStr(runType, "RESTART") Then
			dif = timeNow - timeReboot
			If dif > 29 Then
				allow = "SIM"
				obs = "RESTART_ANTIGO"
				timeReboot = timeNow
				rebootQtd = 1
			ElseIf rebootQtd > 2 Then
				allow = "NAO"
				obs = "MUITOS_RESTARTS"
			Else
				allow = "SIM"
				obs = "POUCOS_RESTARTS"
				timeReboot = timeNow
				rebootQtd = rebootQtd + 1
			End If
		Else
			dif = timeNow - timeManual
			rebootQtd = 0
			If InStr(runType, "TOGGLE") Then
				If dif > 6 Then
					allow = "SIM"
					obs = "EXECUTAR"
					timeManual = timeNow
				Else
					allow = "NAO"
					obs = "MUITO_RECENTE"
				End If
			Else
					allow = "SIM"
					obs = "EXECUTAR_FORCADO"
					timeManual = timeNow
			End If
		End If
    End If

    rem ABRIR ARQUIVO PARA ESCRITA
    Set fsoFile = objFSO.CreateTextFile(pathArquivo, True)

    rem GERAR A LINHA DE TEXTO
    strLine = "atual@" & timeNow & "@manual@" & timeManual & "@reboot@" & timeReboot & "@reboot_qtd@" & rebootQtd & "@diferenca@" & dif & "@permitido@" & allow & "@obs@" & obs

    rem ESCREVER NO ARQUIVO
    fsoFile.Write strLine

    rem FECHAR ARQUIVO
    fsoFile.Close	
End If


rem ENCERRAR SCRIPT
Wscript.Quit