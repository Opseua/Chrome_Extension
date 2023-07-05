import { nodeOrBrowser } from './nodeOrBrowser.js';

async function fileWrite(inf) {

    if (inf.file == undefined || inf.file == '') {
        console.log('INFORMAR O "file"');
    } else if (typeof inf.replace !== 'boolean') {
        console.log('INFORMAR O "replace" TRUE ou FALSE');
    } else if (inf.text == undefined || inf.text == '') {
        console.log('INFORMAR O "text"');
    } else {
        const resNodeOrBrowser = await nodeOrBrowser()
        if (resNodeOrBrowser.res == 'node') {
            const fs = await import('fs');
            fs.writeFile(inf.file, inf.text, { flag: inf.replace ? 'w' : 'a' }, function (err) {
                if (err) {
                    console.log('ARQUIVO: ERRO | ', err);
                } else { console.log('ARQUIVO: OK'); }
            });
        } else {
            try {
                // const blob = new Blob(['3333\nCASA'], { type: 'text/plain' });
                // const downloadOptions = {
                //     url: URL.createObjectURL(blob),
                //     filename: 'NOVO.txt',
                //     saveAs: false, // PERGUNTAR AO USUÁRIO ONDE SALVAR
                //     conflictAction: 'overwrite' // overwrite (SUBSTITUIR) OU uniquify (REESCREVER→ ADICIONANDO (1), (2), (3)... NO FINAL)
                // };

                // chrome.downloads.download(downloadOptions, function (downloadId) {
                //     console.log('Download iniciado:', downloadId);

                //     // Verificar a condição desejada
                //     const condition = false;

                //     if (condition) {
                //         // Excluir o download da lista do Chrome
                //         chrome.downloads.erase({ id: downloadId }, function () {
                //             console.log('Download excluído com sucesso');
                //         });
                //     } else {
                //         console.log('Download não foi excluído');
                //     }
                // });






                chrome.downloads.search({ query: 'nome_do_arquivo.txt' }, function (results) {
                    if (results.length > 0) {
                        const fileId = results[0].id;
                        chrome.downloads.getFileIcon(fileId, { size: 0 }, function (iconUrl) {
                            chrome.fileSystem.getDisplayPath(fileId, function (filePath) {
                                chrome.fileSystem.restoreEntry(filePath, function (entry) {
                                    entry.file(function (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = function () {
                                            const existingContent = reader.result;

                                            // Adicione o novo conteúdo ao conteúdo existente
                                            const newContent = existingContent + '\nNovo conteúdo a ser adicionado';

                                            // Crie um novo Blob com o conteúdo atualizado
                                            const updatedBlob = new Blob([newContent], { type: 'text/plain' });

                                            // Substitua o arquivo existente pelo novo conteúdo atualizado
                                            chrome.fileSystem.getWritableEntry(entry, function (writableEntry) {
                                                writableEntry.createWriter(function (writer) {
                                                    writer.onwriteend = function () {
                                                        console.log('Conteúdo adicionado ao arquivo com sucesso');
                                                    };
                                                    writer.write(updatedBlob);
                                                });
                                            });
                                        };
                                        reader.readAsText(file);
                                    });
                                });
                            });
                        });
                    }
                });









            } catch (err) {
                console.log('ARQUIVO: ERRO');
            }
        }
    }
}

export { fileWrite }
