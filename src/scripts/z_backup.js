await import('../resources/@export.js'); let e = import.meta.url, ee = e;

// IMPORTAR BIBLIOTECA [NODEJS]
if (typeof _path === 'undefined') { await funLibrary({ 'lib': '_path', }); }; if (typeof _fs === 'undefined') { await funLibrary({ 'lib': '_fs', }); };

let retDateHour = dateHour().res; retDateHour = `MES ${retDateHour.mon} - DIA ${retDateHour.day} - HORA ${retDateHour.hou}.${retDateHour.min}`;

let back = {
    'destino': `${fileProjetos}/z_ANTIGOS/# BACKUPS/${retDateHour}`,
    'backups': [
        {
            'pastaPai': `${fileProjetos}`,
            'nomePastaBackup': 'PROJETOS',
            'pastasFilho': [
                'Chat_Python',
                'Chrome_Extension',
                'Sniffer_Python',
                'URA_Reversa',
                'WebScraper',
                'WebSocket',
            ],
            'copiarPastasNeto': [
                'src',
            ],
            'copiarArquivosNeto': [
                '.gitignore',
                'eslint.config.js',
                'manifest.json',
                'package.json',
            ],
        },
        {
            'pastaPai': `${fileWindows}`,
            'nomePastaBackup': 'WINDOWS',
            'pastasFilho': [
                'BAT',
                'PORTABLE_z_SetPath',
            ],
            'copiarPastasNeto': [
                'RECORRENTES',
            ],
            'copiarArquivosNeto': [
                'clearTemp.bat', 'firewallAllowBlock.bat', '1_SET_VARS.vbs', '2_SCRIPT.bat',
            ],
        },
    ],
};

async function backups() {
    // CRIAR PASTA SE NÃO EXISTIR [BACKUP GERAL]
    if (!_fs.existsSync(back.destino)) { _fs.mkdirSync(back.destino, { recursive: true, }); }

    for (let backup of back.backups) {
        let pastaBackup = _path.join(back.destino, backup.nomePastaBackup);

        // CRIAR PASTA SE NÃO EXISTIR [BACKUP ATUAL]
        if (!_fs.existsSync(pastaBackup)) { _fs.mkdirSync(pastaBackup, { recursive: true, }); }
        for (let pasta of backup.pastasFilho) {
            let origemPasta = _path.join(backup.pastaPai, pasta); let destinoPasta = _path.join(pastaBackup, pasta);

            if (_fs.existsSync(origemPasta)) {
                // CRIAR PASTA SE NÃO EXISTIR [BACKUP DESTINO]
                if (!_fs.existsSync(destinoPasta)) { _fs.mkdirSync(destinoPasta, { recursive: true, }); }

                // COPIAR PASTAS
                for (let pastaNeto of backup.copiarPastasNeto) {
                    let origemSrc = _path.join(origemPasta, pastaNeto); let destinoSrc = _path.join(destinoPasta, pastaNeto);
                    if (_fs.existsSync(origemSrc)) { try { await _fs.promises.cp(origemSrc, destinoSrc, { recursive: true, }); } catch (err) { console.log(`ERRO [PASTA]: ${origemSrc}`, err); } }
                }

                // COPIAR ARQUIVOS
                for (let arquivoNeto of backup.copiarArquivosNeto) {
                    let origemArquivo = _path.join(origemPasta, arquivoNeto); let destinoArquivo = _path.join(destinoPasta, arquivoNeto);
                    if (_fs.existsSync(origemArquivo)) { try { await _fs.promises.copyFile(origemArquivo, destinoArquivo); } catch (err) { console.log(`ERRO [ARQUIVO]: ${origemArquivo}`, err); } }
                }

                console.log(`OK [${backup.nomePastaBackup}]: ${origemPasta}`);

            }
        }
    }

    // ZIPAR PASTA
    await new Promise(resolve => { setTimeout(resolve, 500); }); console.log(`ZIPANDO...`); let p = back.destino; let c = `!fileWindows!/PORTABLE_WinRAR/z_OUTROS/PORTABLE_7-Zip/App/7-Zip64/7z.exe`;
    let m = `!fileChrome_Extension!/src/scripts/BAT/fileMsg.vbs`; c = await commandLine({ e, 'awaitFinish': true, 'command': `"${c}" a -tzip "${p}.zip" "${p}/*"`, });
    if (!c.ret) { console.log(`ERRO | AO ZIPAR`); commandLine({ e, 'command': `"${m}" "ERRO | AO ZIPAR"`, }); } else {
        let f = await file({ e, 'action': 'del', 'path': p, }); if (!f.ret) { console.log(`ERRO | AO APAGAR PASTA ANTIGA`); commandLine({ e, 'command': `"${m}" "ERRO | AO APAGAR PASTA ANTIGA"`, }); }
        else { p = p.split('z_ANTIGOS/')[1]; console.log(`CONCLUIDO → '${p}.zip'`); commandLine({ e, 'command': `"${m}" "CONCLUIDO → '${p}.zip'"`, }); }
    } await new Promise(resolve => { setTimeout(resolve, 1500); });

}

backups().catch((catchErr) => { console.error(`ERRO AO FAZER BACKUPS`, catchErr); });


