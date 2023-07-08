// const infFileWrite = {
//     'file': 'TESTE.txt',
//     'rewrite': false, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
//     'text': '1'
// }
// fileWrite(infFileWrite)


import { nodeOrBrowser } from './nodeOrBrowser.js';
import { fileRead } from './fileRead.js';

async function fileWrite(inf) {

    if (inf.file == undefined || inf.file == '') {
        console.log('INFORMAR O "file"');
    } else if (typeof inf.rewrite !== 'boolean') {
        console.log('INFORMAR O "rewrite" TRUE ou FALSE');
    } else if (inf.text == undefined || inf.text == '') {
        console.log('INFORMAR O "text"');
    } else {
        try {
            const resNodeOrBrowser = await nodeOrBrowser()
            if (resNodeOrBrowser.res == 'node') {
                // NODEJS
                const fs = await import('fs');
                fs.writeFile(inf.file, inf.text, { flag: inf.rewrite ? 'a' : 'w' }, function (err) {
                });
            } else {
                // CHROME
                let textOk = inf.text;
                if (inf.rewrite) {
                    textOk = `${await fileRead(`D:/Downloads/Google Chrome/${inf.file}`)}${textOk}`
                }
                const blob = new Blob([textOk], { type: 'text/plain' });
                const downloadOptions = {
                    url: URL.createObjectURL(blob),
                    filename: inf.file,
                    saveAs: false, // PERGUNTAR AO USUARIO ONDE SALVAR
                    conflictAction: 'overwrite' // overwrite (SUBSTITUIR) OU uniquify (REESCREVER→ ADICIONANDO (1), (2), (3)... NO FINAL)
                };
                chrome.downloads.download(downloadOptions, async function (downloadId) {
                    const deleteListDownload = true;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    if (deleteListDownload) {
                        // EXCLUIR O DOWNLOAD DA LISTA DO CHROME
                        chrome.downloads.erase({ id: downloadId }, function () {
                            //console.log('Download excluído com sucesso');
                        });
                    } else {
                        //console.log('Download não foi excluído');
                    }
                });
            }
            console.log('ARQUIVO: OK');
        } catch (err) {
            console.log('ARQUIVO: ERRO', err);
        }
    }

}

export { fileWrite }
