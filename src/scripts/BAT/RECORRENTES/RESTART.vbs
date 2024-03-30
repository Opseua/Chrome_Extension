LOCALIZACAO = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
LOCAL_ABRIR_ARQUIVO = LOCALIZACAO + "\RESTART.bat"
CreateObject("WScript.Shell").Run(LOCAL_ABRIR_ARQUIVO)