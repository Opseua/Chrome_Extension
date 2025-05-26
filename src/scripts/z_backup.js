let startup = new Date(); globalThis['sP'] = import.meta.url; await import('../resources/@export.js'); let e = sP, ee = e;

async function backups() {
    let m = `!fileChrome_Extension!/src/scripts/BAT/fileMsg.vbs`;
    try {
        await logConsole({ e, ee, 'txt': `**************** SERVER **************** [${startupTime(startup, new Date())}]`, 'write': false, });

        let retDateHour = dateHour().res; retDateHour = `MES ${retDateHour.mon} - DIA ${retDateHour.day} - HORA ${retDateHour.hou}.${retDateHour.min}`;
        let nameMaster = await configStorage({ e, 'action': 'get', 'key': 'master', 'path': `!fileChrome_Extension!/src/master.json`, }); nameMaster = nameMaster.res;
        let back = {
            'destino': `${letter}:/ARQUIVOS/PROJETOS/z_OUTROS/BACKUPS_${nameMaster}/${retDateHour}`,
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
                        'clearTemp.bat', 'firewallAllowBlockDelete.ps1', '1_SET_VARS.vbs', '2_SCRIPT.bat',
                    ],
                },
            ],
        }; let err, p = back.destino; let n = `%nircmd%`, s = `sendkeypress lwin`, w = `wait 1500`;

        // CRIAR PASTA SE NÃO EXISTIR [BACKUP GERAL]
        if (!_fs.existsSync(back.destino)) { _fs.mkdirSync(back.destino, { recursive: true, }); } for (let backup of back.backups) {
            // CRIAR PASTA SE NÃO EXISTIR [BACKUP ATUAL]
            let pastaBackup = _path.join(back.destino, backup.nomePastaBackup); if (!_fs.existsSync(pastaBackup)) { _fs.mkdirSync(pastaBackup, { recursive: true, }); } for (let pasta of backup.pastasFilho) {
                let origemPasta = _path.join(backup.pastaPai, pasta); let destinoPasta = _path.join(pastaBackup, pasta); if (_fs.existsSync(origemPasta)) {
                    // CRIAR PASTA SE NÃO EXISTIR [BACKUP DESTINO]
                    if (!_fs.existsSync(destinoPasta)) { _fs.mkdirSync(destinoPasta, { recursive: true, }); } for (let pastaNeto of backup.copiarPastasNeto) {
                        // COPIAR PASTAS
                        let origemSrc = _path.join(origemPasta, pastaNeto); let destinoSrc = _path.join(destinoPasta, pastaNeto);
                        if (_fs.existsSync(origemSrc)) { try { await _fs.promises.cp(origemSrc, destinoSrc, { recursive: true, }); } catch (err) { console.log(`ERRO [PASTA]: ${origemSrc}`, err); } }
                    } for (let arquivoNeto of backup.copiarArquivosNeto) {
                        // COPIAR ARQUIVOS
                        let origemArquivo = _path.join(origemPasta, arquivoNeto); let destinoArquivo = _path.join(destinoPasta, arquivoNeto);
                        if (_fs.existsSync(origemArquivo)) { try { await _fs.promises.copyFile(origemArquivo, destinoArquivo); } catch (err) { console.log(`ERRO [ARQUIVO]: ${origemArquivo}`, err); } }
                    } console.log(`OK [${backup.nomePastaBackup}]: ${origemPasta}`);
                }
            }
        }

        // ABRIR MENU INICIAR → TIRAR PRINT → FECHAR MENU INICIAR
        await commandLine({ e, 'awaitFinish': true, 'command': `${n} ${s} & ${n} ${w} & ${n} savescreenshot "${p}/screenshot.png" & ${n} ${s}`, 'withCmd': true, });

        // MENU INICIAR
        let c = await commandLine({ e, 'awaitFinish': true, 'command': `xcopy "C:/Users/%username%/AppData/Roaming/Microsoft/Windows/Start Menu" "${p}/MENU_INICIAR" /E /H /C /I`, 'withCmd': true, });
        if (!c.ret) { err = `ERRO | BACKUP ATALHOS MENU INICIAR`; console.log(`${err}`); commandLine({ e, 'command': `"${m}" "${err}"`, }); return; }

        // ZIPAR PASTA
        await new Promise(r => { setTimeout(r, 500); }); console.log(`ZIPANDO...`); c = `!fileWindows!/PORTABLE_WinRAR/z_OUTROS/PORTABLE_7-Zip/App/7-Zip64/7z.exe`;
        c = await commandLine({ e, 'awaitFinish': true, 'command': `"${c}" a -tzip "${p}.zip" "${p}/*"`, });
        if (!c.ret) { err = `ERRO | AO ZIPAR`; console.log(`${err}`); commandLine({ e, 'command': `"${m}" "${err}"`, }); return; } else {
            let f = await file({ e, 'action': 'del', 'path': p, }); if (!f.ret) { err = `ERRO | AO APAGAR PASTA ANTIGA`; console.log(`${err}`); commandLine({ e, 'command': `"${m}" "${err}"`, }); return; }
            else { p = p.split('/').pop(); console.log(`CONCLUIDO → '${p}.zip'`); commandLine({ e, 'command': `"${m}" "CONCLUIDO → '${p}.zip'"`, }); }
        } await new Promise(r => { setTimeout(r, 1500); });

    } catch (catchErr) {
        console.log(`ERRO AO FAZER BACKUPS`, '\n', catchErr); commandLine({ e, 'command': `"${m}" "ERRO AO FAZER BACKUPS"`, });
    }
}
backups();


