// let infFile, retFile // 'raw': true,         rewrite TRUE → adicionar no mesmo arquivo
// infFile = { e, 'action': 'relative', 'functionLocal': false, 'path': './PASTA/arquivo.txt', };
// infFile = { e, 'action': 'write', 'functionLocal': false, 'path': './PASTA/arquivo.txt', 'rewrite': true, 'text': '1234\n', };
// infFile = { e, 'action': 'isFolder', 'functionLocal': false, 'path': './PASTA/', };
// infFile = { e, 'action': 'read', 'functionLocal': false, 'path': './PASTA/arquivo.txt', };
// infFile = { e, 'action': 'md5', 'functionLocal': false, 'path': './PASTA/arquivo.txt', };
// infFile = { e, 'action': 'change', 'functionLocal': false, 'path': './PASTA/arquivo.txt', 'pathNew': './PASTA/arquivo2.txt', };
// infFile = { e, 'action': 'list', 'functionLocal': false, 'path': './PASTA', 'max': 10, };
// infFile = { e, 'action': 'del', 'functionLocal': false, 'path': './PASTA', };
// infFile = { e, 'action': 'storage', 'functionLocal': false, 'path': 'C:', }; // SEMPRE COMO 'ADM'!!!
// retFile = await file(infFile); console.log(retFile);

let e = import.meta.url, ee = e;
async function file(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { action, functionLocal, path, } = inf; let infFile, retFile;

        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _path === 'undefined') { await funLibrary({ 'lib': '_path', }); };

        // SUBSTITUIR '!letter!' PELA LETRA DA UNIDADE
        if (path) { path = path.replace(/!letter!|%letter%|!letra!|%letra%/g, letter).replace(/!fileProjetos!|%fileProjetos%/g, fileProjetos).replace(/!fileWindows!|%fileWindows%/g, fileWindows); inf.path = path; };

        if (!action || !['write', 'read', 'del', 'inf', 'relative', 'list', 'change', 'md5', 'isFolder', 'storage',].includes(action)) { ret['msg'] = `FILE: ERRO | INFORMAR O 'action'`; }
        else if (typeof functionLocal !== 'boolean' && action !== 'inf' && !path.includes(':')) { ret['msg'] = `FILE: ERRO | INFORMAR O 'functionLocal'`; }
        else if (action !== 'inf' && (!path || path === '')) { ret['msg'] = `FILE: ERRO | INFORMAR O 'path'`; }
        else {
            function formatBytes(b, d = 2) {
                if (b === 0) return '0 Bytes'; let i = Math.floor(Math.log(b) / Math.log(1024)); return parseFloat((b / Math.pow(1024, i)).toFixed(d < 0 ? 0 : d)) + ' ' + ['bytes', 'KB', 'MB', 'GB',][i];
            }; function rawText(inf = {}) {
                let { obj, concat, } = inf; let ret = ''; try {
                    if ((/<!.* html>.*<\/html>/s.test(obj) || !(typeof obj === 'object'))) { return obj; } else {
                        let raw = ''; concat = concat || `\n\n######################################################################\n\n`;
                        for (let c in obj) { if (typeof obj[c] === 'object') { for (let sC in obj[c]) { raw += obj[c][sC] + concat; } } else { raw += obj[c] + concat; } }; ret = `${JSON.stringify(obj)}\n\n\n\n${raw}`;
                    }
                } catch (catchErr) { esLintIgnore = catchErr; }; return ret;
            };

            async function fileRelative(inf = {}) {
                let { path, functionLocal, } = inf; let resNew = { 'ret': false, }; let relative = path; let relativeParts; function runPath(pp, par) {
                    if (pp.startsWith('./')) { pp = pp.slice(2); } else if (relative.startsWith('/')) { pp = pp.slice(1); }
                    par = par ? `${gW.root}${eng ? ':/' : ''}/${gW.functions}` : `${eng ? `` : `${gW.root}/`}${gW.project}`; let pathFull = par.split('/'); relativeParts = pp.split('/');
                    while (pathFull.length > 0 && relativeParts[0] === '..') { pathFull.pop(); relativeParts.shift(); }; let retRelative = pathFull.concat(relativeParts).join('/');
                    if (retRelative.endsWith('/.')) { retRelative = retRelative.slice(0, -2); }
                    else if (retRelative.endsWith('.') || retRelative.endsWith('/')) { retRelative = retRelative.slice(0, -1); }; return retRelative;
                }; let res = [`${eng && functionLocal ? '' : `${letter}:/`}${runPath(path, !!functionLocal)}`,]; resNew['ret'] = true; resNew['msg'] = `FILE [RELATIVE]: OK`; resNew['res'] = res; return resNew;
            }

            async function fileWrite(inf = {}) {
                let { functionLocal, path, rewrite, text, raw, } = inf; let resNew = { 'ret': false, }; if (typeof rewrite !== 'boolean') { resNew['msg'] = `FILE [WRITE]: ERRO | INFORMAR O 'rewrite' TRUE ou FALSE`; }
                else if (!text || text === '') { resNew['msg'] = `FILE [WRITE]: ERRO | INFORMAR O 'text'`; } else {
                    if (raw) { let infRawText = { e, 'obj': text, }; let retRawText = rawText(infRawText); text = retRawText; }
                    else if (typeof text === 'object') { text = JSON.stringify(text); /* STRING / OBJETO / BUFFER */ }; if (path.includes(':')) { if (eng) { path = path.split(':/')[1]; } } else {
                        infFile = { 'path': path, 'functionLocal': functionLocal && !eng, }; retFile = await fileRelative(infFile); path = retFile.res[0];
                    }; if (eng) { // CHROME
                        if (path.includes('%/')) { path = path.split('%/')[1]; } else if (path.includes(':')) { path = path.split(':/')[1]; }; if (rewrite) {
                            try { infFile = { 'path': path, 'functionLocal': functionLocal && !eng, }; retFile = await fileRead(infFile); text = `${retFile.res || ''}${text} `; }
                            catch (catchErr) { esLintIgnore = catchErr; }
                        }; let blob = new Blob([text,], { type: 'text/plain', });
                        // REMOVER CARACTERES NÃO ACEITOS PELO WINDOWS E DEFINIR O MÁXIMO DE 250
                        path = path.substring(0, 250).replace(/[<>:"\\|?*]/g, ''); let downloadOptions = { // 'overwrite' LIMPA | 'uniquify' (ADICIONA (1), (2), (3)... NO FINAL)
                            url: URL.createObjectURL(blob), filename: path, saveAs: false, conflictAction: 'overwrite',
                        }; chrome.downloads.download(downloadOptions);
                    } else { // NODEJS
                        // REMOVER CARACTERES NÃO ACEITOS PELO WINDOWS E DEFINIR O MÁXIMO DE 250
                        let pathLetter = path.charAt(0); path = path.substring(0, 250).replace(/[<>:"\\|?*]/g, '').replace(pathLetter, `${pathLetter}:`); // DENTRO DE UMA PASTA (CRIAR ELA)
                        if (path.split('/').length > 2) { await _fs.promises.mkdir(_path.dirname(path), { recursive: true, }); }; await _fs.promises.writeFile(path, text, { flag: !rewrite ? 'w' : 'a', });
                    }; let res = path; resNew['ret'] = true; resNew['msg'] = `FILE[WRITE]: OK`; resNew['res'] = res;
                }; return resNew;
            }

            async function fileRead(inf = {}) {
                let { functionLocal, path, } = inf; let resNew = { 'ret': false, }; let retFetch;
                if (!path.includes(':')) { infFile = { 'path': path, 'functionLocal': functionLocal, }; retFile = await fileRelative(infFile); path = retFile.res[0]; }; if (eng) { // CHROME
                    if (!functionLocal) { path = `file:///${path}`; }; path = path.replace('%', '');
                    // ENCODIFICAR PATH *********************
                    let pathParts = path.replace('file:///', '').split(':/'); path = (path.includes('file:///') ? 'file:///' : '') + pathParts[0] + ':/' + pathParts[1].split('/').map(encodeURIComponent).join('/');
                    // *********************
                    retFetch = await fetch(path); retFetch = await retFetch.text();
                    if (!retFetch.includes('Copyright 2012 The Chromium Authors')) { let res = retFetch; resNew['ret'] = true; resNew['msg'] = `FILE [READ]: OK`; resNew['res'] = res; }
                    else { resNew['msg'] = `FILE [READ]: ERRO | ARQUIVO NÃO ENCONTRADO '${path}'`; }
                } else { // NODEJS
                    try {
                        let encoding = path.match(/\.(jpg|jpeg|png|ico)$/) ? undefined : 'utf8'; retFetch = await _fs.promises.readFile(path, encoding); let res = retFetch;
                        resNew['ret'] = true; resNew['msg'] = `FILE [READ]: OK`; resNew['res'] = res;
                    } catch (catchErr) { resNew['msg'] = `FILE [READ]: ERRO | ARQUIVO NÃO ENCONTRADO '${path}'`; esLintIgnore = catchErr; }
                }; return resNew;
            }

            async function fileDel(inf = {}) {
                let { functionLocal, path, } = inf; let resNew = { 'ret': false, };
                if (!path.includes(':')) { infFile = { 'path': path, 'functionLocal': functionLocal, }; retFile = await fileRelative(infFile); path = retFile.res[0]; }; async function delP(txt) {
                    try {
                        let ok = false; try {
                            let s = await _fs.promises.stat(txt);
                            if (s.isDirectory()) { let as = await _fs.promises.readdir(txt); for (let a of as) { let c = _path.join(txt, a); await delP(c); }; await _fs.promises.rmdir(txt); }
                            else { await _fs.promises.unlink(txt); }; ok = true;
                        } catch (catchErr) { esLintIgnore = catchErr; }; if (!ok) { resNew['msg'] = `FILE [DEL]: ERRO | AO DELETAR ARQUIVO '${path}'`; } else { resNew['ret'] = true; resNew['msg'] = `FILE [DEL]: OK`; }
                    } catch (catchErr) { let retRegexE = await regexE({ 'inf': txt, 'e': catchErr, }); resNew['msg'] = retRegexE.res; }
                }; await delP(path); return resNew;
            }

            async function fileList(inf = {}) {
                let { functionLocal, path, max, } = inf;
                // IMPORTAR BIBLIOTECA [NODEJS]
                if (typeof _getFolderSize === 'undefined') { await funLibrary({ 'lib': '_getFolderSize', }); };

                let resNew = { 'ret': false, }; try {
                    if (!max || max === '') { resNew['msg'] = `FILE [LIST]: ERRO | INFORMAR O 'max'`; } else {
                        if (!path.includes(':')) { infFile = { 'path': path, 'functionLocal': functionLocal, }; retFile = await fileRelative(infFile); path = retFile.res[0]; };
                        function getStatus(name) {
                            let status = _fs.statSync(name); status['atime'] = new Date(status.atime.getTime() - (3 * 60 * 60 * 1000)); status['mtime'] = new Date(status.mtime.getTime() - (3 * 60 * 60 * 1000));
                            status['ctime'] = new Date(status.ctime.getTime() - (3 * 60 * 60 * 1000)); status['birthtime'] = new Date(status.birthtime.getTime() - (3 * 60 * 60 * 1000)); return status;
                        }; let entries = await _fs.promises.readdir(path), result = [], count = 0, isFolder, stats, size, entryObject;
                        for (let entry of entries) {
                            if (count >= max) { break; }; let fullPath = _path.join(path, entry); try {
                                let md5 = false; count++; isFolder = _fs.statSync(fullPath).isDirectory(); stats = getStatus(fullPath); size = isFolder ? false : await _getFolderSize.loose(fullPath);
                                if (!isFolder && size !== false && size <= 1 * 1024 * 1024) { let infFile = { 'action': 'md5', 'path': fullPath, }; let retFile = await file(infFile); md5 = retFile.res; }
                                else { md5 = `arquivo muito grande`; }; entryObject = {
                                    'ret': true, 'isFolder': isFolder, 'name': entry, 'path': fullPath.replace(/\\/g, '/'), 'edit': stats.mtime, 'size': size ? formatBytes(size) : false, ...(isFolder ? {} : { 'md5': md5, }),
                                }; result.push(entryObject);
                            } catch (catchErr) { result.push({ 'ret': false, 'name': entry, 'path': fullPath.replace(/\\/g, '/'), }); esLintIgnore = catchErr; }
                        }; let retOrder = result.sort((a, b) => {
                            if (a.isFolder && !b.isFolder) { return -1; } else if (!a.isFolder && b.isFolder) { return 1; } else { return a.name.localeCompare(b.name); }
                        }); let res = retOrder;
                        resNew['ret'] = true; resNew['msg'] = `FILE [LIST]: OK`; resNew['res'] = res;
                    }
                } catch (catchErr) { resNew['msg'] = `FILE [LIST]: ERRO | AO LISTAR '${path}'`; esLintIgnore = catchErr; }; return resNew;
            }

            async function fileChange(inf = {}) {
                let { functionLocal, path, pathNew, } = inf; let resNew = { 'ret': false, }; if (!pathNew || pathNew === '') { resNew['msg'] = `FILE [CHANGE]: ERRO | INFORMAR O 'pathNew'`; } else {
                    pathNew = pathNew.replace(/!letter!/g, letter); if (!path.includes(':')) { infFile = { 'path': path, 'functionLocal': functionLocal, }; retFile = await fileRelative(infFile); path = retFile.res[0]; };
                    if (!pathNew.includes(':')) { infFile = { 'path': pathNew, 'functionLocal': functionLocal, }; retFile = await fileRelative(infFile); pathNew = retFile.res[0]; }; try {
                        await _fs.promises.mkdir(_path.dirname(pathNew), { recursive: true, }); await _fs.promises.rename(path, pathNew); resNew['ret'] = true; resNew['msg'] = `FILE [CHANGE]: OK`; resNew['res'] = pathNew;
                    } catch (catchErr) { resNew['msg'] = `FILE [CHANGE]: ERRO | AO MOVER ARQUIVO '${path}'`; esLintIgnore = catchErr; }
                }; return resNew;
            }

            async function fileMd5(inf = {}) {
                let { functionLocal, path, } = inf;
                // IMPORTAR BIBLIOTECA [NODEJS]
                if (typeof _crypto === 'undefined') { await funLibrary({ 'lib': '_crypto', }); };

                let resNew = { 'ret': false, }; if (!path.includes(':')) { infFile = { 'path': path, 'functionLocal': functionLocal, }; retFile = await fileRelative(infFile); path = retFile.res[0]; }; try {
                    let md5 = _crypto('md5'); let fileContent = await _fs.promises.readFile(path); md5.update(fileContent); md5 = md5.digest('hex'); let res = md5;
                    resNew['ret'] = true; resNew['msg'] = `FILE [MD5]: OK`; resNew['res'] = res;
                } catch (catchErr) { resNew['msg'] = catchErr; }; return resNew;
            }

            async function fileIsFolder(inf = {}) {
                let { functionLocal, path, listRead, max = 200, } = inf; let resNew = { 'ret': false, }; try {
                    if (!path.includes(':')) { infFile = { 'path': path, 'functionLocal': functionLocal, }; retFile = await fileRelative(infFile); path = retFile.res[0]; };
                    let res = _fs.statSync(path).isDirectory(); resNew['ret'] = true; if (!listRead) { resNew['msg'] = `FILE [IS FOLDER]: OK`; resNew['res'] = res; } else if (res) {
                        // USADO SOMENTE NO 'ARQUIVOS WEB' DO SEVIDOR | É PASTA [LISTAR] | É ARQUIVO [LER]
                        infFile = { e, 'action': 'list', 'functionLocal': false, 'path': path, 'max': max, }; retFile = await fileList(infFile); resNew = retFile;
                    } else { resNew['msg'] = `FILE [IS FOLDER]: OK`; infFile = { 'path': path, 'functionLocal': functionLocal && !eng, }; retFile = await fileRead(infFile); resNew = retFile; }
                } catch (catchErr) { resNew['msg'] = `FILE [IS FOLDER]: ERRO | AO CHECAR '${path}'`; esLintIgnore = catchErr; }; return resNew;
            }

            async function fileStorage(inf = {}) {
                let { path, } = inf; let resNew = { 'ret': false, }; try {
                    let retCommandLine = await commandLine({ e, 'awaitFinish': true, 'command': `fsutil volume diskfree ${path.replace(':', '')}:`, }); if (!retCommandLine.ret) { return retCommandLine; }
                    resNew['res'] = {}; for (let [index, value,] of retCommandLine.res.split('\n').entries()) {
                        if (value.includes('Total de bytes da cota dispon') || value.includes('Total de bytes     ') || value.includes('Bytes usados     ') || value.includes('Total de bytes reservados')) {
                            let valueNew = Number(value.replace(/:  /g, ': ').trim().split(': ')[1].split(' ')[0].replace(/\./g, ''));
                            if (value.includes('Total de bytes da cota dispon')) { resNew.res['free'] = valueNew; resNew.res['freeFormated'] = formatBytes(valueNew); }
                            else if (value.includes('Total de bytes     ')) { resNew.res['total'] = valueNew; resNew.res['totalFormated'] = formatBytes(valueNew); }
                            else if (value.includes('Bytes usados     ')) { resNew.res['used'] = valueNew; resNew.res['usedFormated'] = formatBytes(valueNew); }
                            else if (value.includes('Total de bytes reservados') && resNew.res['used']) {
                                resNew.res['used'] = resNew.res['used'] + valueNew; resNew.res['usedFormated'] = formatBytes(resNew.res['used']);
                            }
                        }
                    }; resNew['ret'] = true; resNew['msg'] = `FILE [STORAGE]: OK`;
                } catch (catchErr) { resNew['msg'] = `FILE [STORAGE]: ERRO | AO OBTER INFORMAÇÕES DO DISCO '${path}'`; esLintIgnore = catchErr; }; return resNew;
            }

            // ****************************************************************************************************************************************

            if (action === 'write') { return await fileWrite(inf); } else if (action === 'read') { return await fileRead(inf); } else if (action === 'del' && !eng) { return await fileDel(inf); }
            else if (action === 'relative') { return await fileRelative(inf); } else if (action === 'list' && !eng) { return await fileList(inf); }
            else if (action === 'change' && !eng) { return await fileChange(inf); } else if (action === 'md5' && !eng) { return await fileMd5(inf); }
            else if (action === 'isFolder' && !eng) { return await fileIsFolder(inf); } else if (action === 'storage' && !eng) { return await fileStorage(inf); }
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['file'] = file;