async function salvarArquivo(inf) {

    const conteudo = inf.inf;
    const blob = new Blob([conteudo], { type: inf.typ });
    const downloadOptions = {
        url: URL.createObjectURL(blob),
        filename: inf.nom,
        saveAs: false, // PERGUTAR AO USUARIO ONDE SALVAR
        conflictAction: 'overwrite' // SUBSTITUIR SE JA EXISTIR
    };
    chrome.downloads.download(downloadOptions, function (downloadId) {
    });

}

export default salvarArquivo

