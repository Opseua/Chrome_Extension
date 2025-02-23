/* eslint-disable camelcase */

// let infFile, retFile; // 'add': true, 'functionLocal': true
// infFile = { e, 'action': 'relative', 'path': './PASTA/arquivo.txt', };
// infFile = { e, 'action': 'write', 'path': './PASTA/arquivo.txt', 'add': true, 'text': '1234\n', };
// infFile = { e, 'action': 'isFolder', 'path': './PASTA/', };
// infFile = { e, 'action': 'read', 'path': './PASTA/arquivo.txt', };
// infFile = { e, 'action': 'md5', 'path': './PASTA/arquivo.txt', };
// infFile = { e, 'action': 'change', 'path': './PASTA/arquivo.txt', 'pathNew': './PASTA/arquivo2.txt', };
// infFile = { e, 'action': 'list', 'path': './PASTA', 'max': 10, };
// infFile = { e, 'action': 'del', 'path': './PASTA', };
// infFile = { e, 'action': 'storage', 'path': 'C:', }; // SEMPRE COMO 'ADM'!!!
// retFile = await file(infFile); console.log(retFile);

let e = import.meta.url, ee = e;
async function file(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { action = false, functionLocal = false, path = false, pathNew = false, } = inf; let retFile;

        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _path === 'undefined') { await funLibrary({ 'lib': '_path', }); };

        // SUBSTITUIR VARIÁVEIS DE AMBIENTE
        let a = letter; let b = fileProjetos; let c = fileChrome_Extension; let d = fileWindows; let pathAndPathNew = `${path || 'NADA'}#_SPLIT_#${pathNew || 'NADA'}`;
        pathAndPathNew = pathAndPathNew.replace(/[!%](letter|letra)[!%]/g, a).replace(/[!%](fileProjetos)[!%]/g, b).replace(/[!%](fileChrome_Extension)[!%]/g, c).replace(/[!%](fileWindows)[!%]/g, d).split('#_SPLIT_#');
        path = pathAndPathNew[0] === 'NADA' ? false : pathAndPathNew[0]; inf.path = path; pathNew = pathAndPathNew[1] === 'NADA' ? false : pathAndPathNew[1]; inf.pathNew = pathNew;

        if (!action || !['write', 'read', 'del', 'inf', 'relative', 'list', 'change', 'md5', 'isFolder', 'storage',].includes(action)) { ret['msg'] = `FILE: ERRO | INFORMAR O 'action'`; }
        else if (typeof functionLocal !== 'boolean' && action !== 'inf' && !path.includes(':')) { ret['msg'] = `FILE: ERRO | INFORMAR O 'functionLocal'`; }
        else if (action !== 'inf' && (!path || path === '')) { ret['msg'] = `FILE: ERRO | INFORMAR O 'path'`; } else {
            function formatBytes(b, d = 2) {
                if (b === 0) { return '0 Bytes'; }; let i = Math.floor(Math.log(b) / Math.log(1024)); return parseFloat((b / Math.pow(1024, i)).toFixed(d < 0 ? 0 : d)) + ' ' + ['bytes', 'KB', 'MB', 'GB',][i];
            }; function rawText(inf = {}) {
                let { obj, concat, } = inf; let ret = ''; try {
                    if ((/<!.* html>.*<\/html>/s.test(obj) || !(typeof obj === 'object'))) { return obj; } else {
                        let raw = ''; concat = concat || `\n\n######################################################################\n\n`;
                        for (let c in obj) { if (typeof obj[c] === 'object') { for (let sC in obj[c]) { raw += obj[c][sC] + concat; } } else { raw += obj[c] + concat; } }; ret = `${JSON.stringify(obj)}\n\n\n\n${raw}`;
                    }
                } catch (catchErr) { esLintIgnore = catchErr; }; return ret;
            };

            // ****************************************************************************************************************************************

            async function fileRelative(inf = {}) {
                let { path, functionLocal, } = inf; let resNew = { 'ret': false, }; try {
                    let relative = path; let relativeParts; function runPath(pp, par) {
                        if (pp.startsWith('./')) { pp = pp.slice(2); } else if (relative.startsWith('/')) { pp = pp.slice(1); }
                        par = par ? `${gW.root}${eng ? ':/' : ''}/${gW.functions}` : `${eng ? `` : `${gW.root}/`}${gW.project}`; let pathFull = par.split('/'); relativeParts = pp.split('/');
                        while (pathFull.length > 0 && relativeParts[0] === '..') { pathFull.pop(); relativeParts.shift(); }; let retRel = pathFull.concat(relativeParts).join('/');
                        if (retRel.endsWith('/.')) { retRel = retRel.slice(0, -2); } else if (retRel.endsWith('.') || retRel.endsWith('/')) { retRel = retRel.slice(0, -1); }; return retRel;
                    }; let res = [`${eng && functionLocal ? '' : `${letter}:/`}${runPath(path, !!functionLocal)}`,]; resNew['ret'] = true; resNew['msg'] = `FILE [RELATIVE]: OK`; resNew['res'] = res; return resNew;
                } catch (catchErr) { esLintIgnore = catchErr; delete resNew['res']; resNew['msg'] = `FILE [RELATIVE]: ERRO | AO CRIAR PATH RELATIVO '${path}'`; }; return resNew;
            }

            async function fileWrite(inf = {}) {
                let { functionLocal, path, add = false, text, raw, } = inf; let resNew = { 'ret': false, }; try {
                    if (!text || text === '') { resNew['msg'] = `FILE [WRITE]: ERRO | INFORMAR O 'text'`; } else {
                        if (raw) { let retRawText = rawText({ e, 'obj': text, }); text = retRawText; }
                        else if (typeof text === 'object') { text = JSON.stringify(text); /* STRING / OBJETO / BUFFER */ }; if (path.includes(':')) { if (eng) { path = path.split(':/')[1]; } } else {
                            retFile = await fileRelative({ path, 'functionLocal': functionLocal && !eng, }); path = retFile.res[0];
                        }; if (eng) { // CHROME | REMOVER CARACTERES NÃO ACEITOS PELO WINDOWS E DEFINIR O MÁXIMO DE 250
                            if (path.includes('%/')) { path = path.split('%/')[1]; } else if (path.includes(':')) { path = path.split(':/')[1]; }; if (add) {
                                retFile = await fileRead({ path, 'functionLocal': functionLocal && !eng, }); text = `${retFile.res || ''}${text}`;
                            }; let blob = new Blob([text,], { type: 'text/plain', }); path = path.substring(0, 250).replace(/[<>:"\\|?*]/g, ''); // 'overwrite' LIMPA | 'uniquify' ADD (1), (2)... NO FINAL
                            let downloadOptions = { url: URL.createObjectURL(blob), filename: path, saveAs: false, conflictAction: 'overwrite', }; chrome.downloads.download(downloadOptions);
                        } else { // NODEJS | REMOVER CARACTERES NÃO ACEITOS PELO WINDOWS E DEFINIR O MÁXIMO DE 250
                            let pathLetter = path.charAt(0); path = path.substring(0, 250).replace(/[<>:"\\|?*]/g, '').replace(pathLetter, `${pathLetter}:`); // DENTRO DE UMA PASTA (CRIAR ELA)
                            if (path.split('/').length > 2) { await _fs.promises.mkdir(_path.dirname(path), { recursive: true, }); }; await _fs.promises.writeFile(path, text, { flag: add ? 'a' : 'w', });
                        }; resNew['ret'] = true; resNew['msg'] = `FILE [WRITE]: OK`; resNew['res'] = path;
                    };
                } catch (catchErr) { esLintIgnore = catchErr; delete resNew['res']; resNew['msg'] = `FILE [WRITE]: ERRO | AO ESCREVER ARQUIVO '${path}'`; }; return resNew;
            }

            async function fileRead(inf = {}) {
                let { functionLocal, path, } = inf; let resNew = { 'ret': false, }; try {
                    let retFetch; if (!path.includes(':')) { retFile = await fileRelative({ path, functionLocal, }); path = retFile.res[0]; }; if (eng) { // CHROME
                        if (!functionLocal) { path = `file:///${path}`; }; path = path.replace('%', ''); // ENCODIFICAR PATH *********************
                        let pathParts = path.replace('file:///', '').split(':/'); path = (path.includes('file:///') ? 'file:///' : '') + pathParts[0] + ':/' + pathParts[1].split('/').map(encodeURIComponent).join('/');
                        retFetch = await fetch(path); retFetch = await retFetch.text(); if (retFetch.includes('The Chromium Authors')) { throw new Error('erro'); } // NODEJS
                    } else { let s = await _fs.promises.stat(path); retFetch = await _fs.promises.readFile(path, path.match(/\.(jpg|jpeg|png|ico)$/) || (s.size >= (gW.kbPartsMessage * 1024)) ? undefined : 'utf8'); };
                    resNew['ret'] = true; resNew['msg'] = `FILE [READ]: OK`; resNew['res'] = retFetch;
                } catch (catchErr) { esLintIgnore = catchErr; delete resNew['res']; resNew['msg'] = `FILE [READ]: ERRO | AO LER ARQUIVO '${path}'`; }; return resNew;
            }

            async function fileDel(inf = {}) {
                let { functionLocal, path, } = inf; let resNew = { 'ret': false, }; try {
                    if (!path.includes(':')) { retFile = await fileRelative({ path, functionLocal, }); path = retFile.res[0]; }; async function delP(t) {
                        try {
                            let s = await _fs.promises.stat(t); if (s.isDirectory()) { let as = await _fs.promises.readdir(t); for (let a of as) { let c = _path.join(t, a); await delP(c); }; await _fs.promises.rmdir(t); }
                            else { await _fs.promises.unlink(t); };
                        } catch (catchErr) { throw new Error(catchErr); };
                    }; await delP(path); resNew['ret'] = true; resNew['msg'] = `FILE [DEL]: OK`; return resNew;
                } catch (catchErr) { esLintIgnore = catchErr; delete resNew['res']; resNew['msg'] = `FILE [DEL]: ERRO | AO DELETAR '${path}'`; }; return resNew;
            }

            async function fileList(inf = {}) {
                let { functionLocal, path, max, } = inf; let resNew = { 'ret': false, }; try {
                    if (!max || max === '') { resNew['msg'] = `FILE [LIST]: ERRO | INFORMAR O 'max'`; } else {
                        if (!path.includes(':')) { retFile = await fileRelative({ path, functionLocal, }); path = retFile.res[0]; }; function getStatus(name) {
                            let status = _fs.statSync(name); status['atime'] = new Date(status.atime.getTime() - (3 * 60 * 60 * 1000)); status['mtime'] = new Date(status.mtime.getTime() - (3 * 60 * 60 * 1000));
                            status['ctime'] = new Date(status.ctime.getTime() - (3 * 60 * 60 * 1000)); status['birthtime'] = new Date(status.birthtime.getTime() - (3 * 60 * 60 * 1000)); return status;
                        }; let entries = await _fs.promises.readdir(path), result = [], count = 0, isFolder, stats, size; for (let entry of entries) {
                            if (count >= max) { break; }; let fullPath = _path.join(path, entry); try {
                                let md5 = false; count++; isFolder = _fs.statSync(fullPath).isDirectory(); stats = getStatus(fullPath); if (!isFolder) { size = await _fs.promises.stat(fullPath); size = size.size; }
                                if (!isFolder && size && size <= (1 * 1024 * 1024)) { retFile = await file({ action: 'md5', path: fullPath, }); md5 = retFile.res; } else if (!isFolder) { md5 = `arquivo muito grande`; };
                                result.push({ 'ret': true, isFolder, 'name': entry, 'path': fullPath.replace(/\\/g, '/'), 'edit': stats.mtime.toISOString(), 'size': size ? formatBytes(size) : false, md5, });
                            } catch (catchErr) { esLintIgnore = catchErr; result.push({ 'ret': false, 'name': entry, 'path': fullPath.replace(/\\/g, '/'), }); }
                        }; let retOrder = result.sort((a, b) => { if (a.isFolder && !b.isFolder) { return -1; } else if (!a.isFolder && b.isFolder) { return 1; } else { return a.name.localeCompare(b.name); } });
                        let res = retOrder; resNew['ret'] = true; resNew['msg'] = `FILE [LIST]: OK`; resNew['res'] = res;
                    }
                } catch (catchErr) { esLintIgnore = catchErr; delete resNew['res']; resNew['msg'] = `FILE [LIST]: ERRO | AO LISTAR '${path}'`; }; return resNew;
            }

            async function fileChange(inf = {}) {
                let { functionLocal, path, pathNew, } = inf; let resNew = { 'ret': false, }; try {
                    if (!pathNew || pathNew === '') { resNew['msg'] = `FILE [CHANGE]: ERRO | INFORMAR O 'pathNew'`; } else {
                        pathNew = pathNew.replace(/!letter!/g, letter); if (!path.includes(':')) { retFile = await fileRelative({ path, functionLocal, }); path = retFile.res[0]; };
                        if (!pathNew.includes(':')) { retFile = await fileRelative({ 'path': pathNew, functionLocal, }); pathNew = retFile.res[0]; };
                        await _fs.promises.mkdir(_path.dirname(pathNew), { recursive: true, }); await _fs.promises.rename(path, pathNew); resNew['ret'] = true; resNew['msg'] = `FILE [CHANGE]: OK`; resNew['res'] = pathNew;
                    };
                } catch (catchErr) { esLintIgnore = catchErr; delete resNew['res']; resNew['msg'] = `FILE [CHANGE]: ERRO | AO MOVER ARQUIVO '${path}'`; }; return resNew;
            }

            async function fileMd5(inf = {}) {
                // IMPORTAR BIBLIOTECA [NODEJS]
                if (typeof _crypto === 'undefined') { await funLibrary({ 'lib': '_crypto', }); };

                let { functionLocal, path, } = inf; let resNew = { 'ret': false, }; try {
                    if (!path.includes(':')) { retFile = await fileRelative({ path, functionLocal, }); path = retFile.res[0]; }; let md5 = _crypto('md5');
                    let fileContent = await _fs.promises.readFile(path); md5.update(fileContent); md5 = md5.digest('hex'); let res = md5; resNew['ret'] = true; resNew['msg'] = `FILE [MD5]: OK`; resNew['res'] = res;
                } catch (catchErr) { esLintIgnore = catchErr; delete resNew['res']; resNew['msg'] = `FILE [MD5]: ERRO | AO CHECAR MD5 '${path}'`; }; return resNew;
            }

            async function fileIsFolder(inf = {}) {
                let { functionLocal, path, listRead, max = 200, } = inf; let resNew = { 'ret': false, }; try {
                    if (!path.includes(':')) { retFile = await fileRelative({ path, functionLocal, }); path = retFile.res[0]; };
                    let res = _fs.statSync(path).isDirectory(); resNew['ret'] = true; if (!listRead) { resNew['ret'] = true; resNew['msg'] = `FILE [IS FOLDER]: OK`; resNew['res'] = res; } else if (res) {
                        retFile = await fileList({ e, 'action': 'list', path, max, }); resNew = retFile; // USADO SOMENTE NO 'ARQUIVOS WEB' DO SEVIDOR | É PASTA [LISTAR] | É ARQUIVO [LER]
                    } else { resNew['ret'] = true; resNew['msg'] = `FILE [IS FOLDER]: OK`; retFile = await fileRead({ path, 'functionLocal': functionLocal && !eng, }); resNew = retFile; }
                } catch (catchErr) { esLintIgnore = catchErr; delete resNew['res']; resNew['msg'] = `FILE [IS FOLDER]: ERRO | AO CHECAR SE É PASTA '${path}'`; }; return resNew;
            }

            async function fileStorage(inf = {}) {
                // IMPORTAR BIBLIOTECA [NODEJS]
                if (typeof _exec === 'undefined') { await funLibrary({ 'lib': '_exec', }); };

                let { path, } = inf; let resNew = { 'ret': false, }; try {
                    let retExec = await new Promise((resolve) => { _exec(`fsutil volume diskfree ${path.replace(':', '')}:`, (err, resOk, errm) => { if (err || errm) { resolve(false); } else { resolve(resOk); } }); });
                    resNew['res'] = {}; for (let [index, value,] of retExec.split('\n').entries()) {
                        if (value.includes('Total de bytes da cota dispon') || value.includes('Total de bytes     ') || value.includes('Bytes usados     ') || value.includes('Total de bytes reservados')) {
                            let valueNew = Number(value.replace(/:  /g, ': ').trim().split(': ')[1].split(' ')[0].replace(/\./g, ''));
                            if (value.includes('Total de bytes da cota dispon')) { resNew.res['free'] = valueNew; resNew.res['freeFormated'] = formatBytes(valueNew); }
                            else if (value.includes('Total de bytes     ')) { resNew.res['total'] = valueNew; resNew.res['totalFormated'] = formatBytes(valueNew); }
                            else if (value.includes('Bytes usados     ')) { resNew.res['used'] = valueNew; resNew.res['usedFormated'] = formatBytes(valueNew); }
                            else if (value.includes('Total de bytes reservados') && resNew.res['used']) { resNew.res['used'] = resNew.res['used'] + valueNew; resNew.res['usedFormated'] = formatBytes(resNew.res['used']); }
                        }
                    }; resNew['ret'] = true; resNew['msg'] = `FILE [STORAGE]: OK`;
                } catch (catchErr) { esLintIgnore = catchErr; delete resNew['res']; resNew['msg'] = `FILE [STORAGE]: ERRO | AO OBTER INFORMAÇÕES DO DISCO '${path}'`; }; return resNew;
            }

            // ****************************************************************************************************************************************

            if (action === 'write') { return await fileWrite(inf); } else if (action === 'read') { return await fileRead(inf); } else if (action === 'del' && !eng) { return await fileDel(inf); }
            else if (action === 'relative') { return await fileRelative(inf); } else if (action === 'list' && !eng) { return await fileList(inf); }
            else if (action === 'change' && !eng) { return await fileChange(inf); } else if (action === 'md5' && !eng) { return await fileMd5(inf); }
            else if (action === 'isFolder' && !eng) { return await fileIsFolder(inf); } else if (action === 'storage' && !eng) { return await fileStorage(inf); }
            ret['msg'] = `FILE: ERRO | ACTION '${action}' NÃO DISPONÍVEL NO AMBIENTE`;
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['file'] = file;


