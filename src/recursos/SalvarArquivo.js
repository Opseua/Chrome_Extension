async function SalvarArquivo(inf) {

    const conteudo = inf.inf;
    const blob = new Blob([conteudo], { type: inf.typ });
    const downloadOptions = {
        url: URL.createObjectURL(blob),
        filename: inf.nom,
        saveAs: false
    };
    chrome.downloads.download(downloadOptions, function (downloadId) {
    });

}

export default SalvarArquivo

