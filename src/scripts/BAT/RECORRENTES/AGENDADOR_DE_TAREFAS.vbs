LOCALIZACAO = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
LOCAL_ABRIR_ARQUIVO = LOCALIZACAO + "\1_BACKGROUND.exe"
CreateObject("WScript.Shell").Run(LOCAL_ABRIR_ARQUIVO)