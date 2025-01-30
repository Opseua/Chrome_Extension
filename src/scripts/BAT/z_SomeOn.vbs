Set fso = CreateObject("Scripting.FileSystemObject")                          rem * BIBLIOTECAS VBS
pathCompleto = WScript.ScriptFullName                                         rem → 'D:\ARQUIVOS\SINCRONIZADO\FILE.vbs'
rem letra = Split( pathCompleto , ":" )(0)                                        rem → 'D'
local = fso.GetParentFolderName(pathCompleto)                                 rem → 'D:\ARQUIVOS\SINCRONIZADO'
rem pastaAtual = fso.GetFileName(local)                                           rem → 'SINCRONIZADO'
rem pathAtePastaAnterior = Split( pathCompleto , "\" & pastaAtual & "\" )(0)      rem → 'D:\ARQUIVOS'
rem arquivo = Replace( fso.GetFileName(pathCompleto) , ".vbs" , "" )              rem → 'FILE'

rem MsgBox ( Replace( "1: " & pathCompleto & "\\n2: " & letra & "\\n3: " & local & "\\n4: " & pastaAtual & "\\n5: " & pathAtePastaAnterior & "\\n6: " & arquivo , "\\n" , Chr(13) ) )

rem ---------------------------------------------------------------------------------------

rem BIBLIOTECAS VBS
Set Shell = CreateObject("Shell.Application")
rem Set WshShell = CreateObject("WScript.Shell")
rem PEGAR VARIAVEL DE AMBIENTE
rem fileProjetos = WshShell.ExpandEnvironmentStrings("%fileProjetos%")
rem fileWindows = WshShell.ExpandEnvironmentStrings("%fileWindows%")
rem MUDAR LOCAL DO TERMINAL
rem WshShell.CurrentDirectory = fileProjetos

rem ---------------------------------------------------------------------------------------

rem Shell.ShellExecute "D:\ARQUIVOS\BAT.bat", "PAR_1 PAR_2 PAR_3 PAR_4 PAR_5", , "runas", 0
rem Shell.ShellExecute "wscript.exe", "D:\ARQUIVOS\VBS.vbs PAR_1 PAR_2 PAR_3 PAR_4 PAR_5", , "runas", 0

rem ******************************************************************************************************************************

Shell.ShellExecute """" & local & "\zz_COMMANDS.bat" & """", "ATALHO_ON_", , "runas", 0


