// let infFile, retFile // 'logFun': true, 'raw': true,
// infFile = { 'e': e, 'action': 'relative', 'functionLocal': false, 'path': './PASTA/arquivo.txt' }
// infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'path': './PASTA/arquivo.txt', 'rewrite': true, 'text': '1234\n' }
// infFile = { 'e': e, 'action': 'read', 'functionLocal': false, 'path': './PASTA/arquivo.txt' }
// infFile = { 'e': e, 'action': 'md5', 'functionLocal': false, 'path': './PASTA/arquivo.txt' }
// infFile = { 'e': e, 'action': 'change', 'functionLocal': false, 'path': './PASTA/arquivo.txt', 'pathNew': './PASTA/arquivo2.txt' }
// infFile = { 'e': e, 'action': 'list', 'functionLocal': false, 'path': './PASTA', 'max': 10 }
// infFile = { 'e': e, 'action': 'del', 'functionLocal': false, 'path': './PASTA' }
// retFile = await file(infFile);
// console.log(retFile)

let e = import.meta.url;
async function file(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let confKeep = conf
        if (!eng && inf && inf.e) {
            let regex = e.match(/(file:\/\/\/.*?PROJETOS\/[^\/]+)/)
            if (regex) { confKeep[3] = regex[1].replace('file:///', '').split(':/')[1] }
        }

        // PASSAR NO jsonInterpret
        if (/\$\[[^\]]+\]/.test(JSON.stringify(inf))) { let rji = await jsonInterpret({ 'json': inf }); if (rji.ret) { rji = JSON.parse(rji.res); inf = rji } }
        if (!inf.action || !['write', 'read', 'del', 'inf', 'relative', 'list', 'change', 'md5', 'exist',].includes(inf.action)) {
            ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'action' \n\n`;
        } else if (typeof inf.functionLocal !== 'boolean' && inf.action !== 'inf' && !inf.path.includes(':')) {
            ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'functionLocal' \n\n`
        } else if (inf.action !== 'inf' && (!inf.path || inf.path == '')) {
            ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'path' \n\n`
        } else {
            let infFile, retFile, retFetch = '', text, relative, pathFull, md5, relativeParts, retRelative, infFilesList, retFilesList

            // SUBSTITUIR '!letter!' PELA LETRA DA UNIDADE
            if (inf.path) {
                inf.path = inf.path.replace(/!letter!/g, letter)
            }

            async function fileRelative(inf) {
                let resNew = { 'ret': false }
                relative = inf.path;
                function runPath(pp, par) {
                    if (pp.startsWith('./')) {
                        pp = pp.slice(2)
                    } else if (relative.startsWith('/')) {
                        pp = pp.slice(1)
                    }
                    pathFull = confKeep[par].split('/');
                    relativeParts = pp.split('/');
                    while (pathFull.length > 0 && relativeParts[0] == '..') {
                        pathFull.pop(); relativeParts.shift();
                    }
                    retRelative = pathFull.concat(relativeParts).join('/');
                    if (retRelative.endsWith('/.')) {
                        retRelative = retRelative.slice(0, -2);
                    } else if (retRelative.endsWith('.') || retRelative.endsWith('/')) {
                        retRelative = retRelative.slice(0, -1);
                    };
                    return retRelative
                };
                resNew['ret'] = true;
                resNew['msg'] = `FILE RELATIVE: OK`
                resNew['res'] = [`${eng && inf.functionLocal ? '' : `${letter}:/`}${runPath(inf.path, inf.functionLocal ? 2 : 3)}`]
                return resNew
            }

            async function fileWrite(inf) {
                let resNew = { 'ret': false }, path
                if (typeof inf.rewrite !== 'boolean') {
                    resNew['msg'] = `\n\n #### ERRO #### FILE WRITE NEW \n INFORMAR O 'rewrite' TRUE ou FALSE \n\n`;
                } else if (!inf.text || inf.text == '') {
                    resNew['msg'] = `\n\n #### ERRO #### FILE WRITE NEW \n INFORMAR O 'text' \n\n`;
                } else {
                    if (inf.raw) {
                        let infRawText = { 'obj': inf.text }
                        let retRawText = await rawText(infRawText)
                        text = retRawText
                    } else {
                        text = typeof inf.text === 'object' ? JSON.stringify(inf.text) : inf.text
                    }
                    if (inf.path.includes(':')) {
                        path = inf.path;
                        if (eng) {
                            path = path.split(':/')[1]
                        }
                    } else {
                        if (!inf.logFun) {
                            infFile = { 'path': inf.path, 'functionLocal': inf.functionLocal && !eng ? true : false };
                            retFile = await fileRelative(infFile)
                            path = retFile.res[0]
                        } else {
                            // LOG FUN
                            let funE = inf.logFun; let fun = funE.split('.js'); let logText = inf.text, retFile
                            if (!(fun.length > 1)) {
                                fun = `#_naoIdentificado`;
                                logText['e'] = funE
                            } else {
                                fun = fun[0];
                                fun = fun.substring(fun.lastIndexOf('/') + 1)
                            }
                            let time = dateHour().res, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`
                            let hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
                            path = `##_FILE-FUN_${fun}`;
                            path = `log/${path}/${mon}/${day}/${hou}_INF_RET.txt`
                            inf['path'] = path
                            text = typeof logText === 'object' ? JSON.stringify(logText, null, 2) : logText
                            infFile = { 'path': inf.path, 'functionLocal': inf.functionLocal && !eng ? true : false };
                            retFile = await fileRelative(infFile)
                            path = retFile.res[0]
                        }
                    };
                    if (eng) { // CHROME
                        if (path.includes('%/')) {
                            path = path.split('%/')[1]
                        } else if (path.includes(':')) {
                            path = path.split(':/')[1]
                        }
                        if (inf.rewrite) {
                            try {
                                infFile = { 'path': path, 'functionLocal': inf.functionLocal && !eng ? true : false };
                                retFile = await fileRead(infFile)
                                if (retFile.ret) {
                                    retFetch = retFile.res
                                };
                                text = `${retFetch}${text}`
                            } catch (e) { }
                        };
                        let blob = new Blob([text], { type: 'text/plain' });
                        // REMOVER CARACTERES NÃO ACEITOS PELO WINDOWS E DEFINIR O MÁXIMO DE 250
                        path = path.substring(0, 250).replace(/[<>:"\\|?*]/g, '')
                        let downloadOptions = { // 'overwrite' LIMPA | 'uniquify' (ADICIONA (1), (2), (3)... NO FINAL)
                            url: URL.createObjectURL(blob), filename: path, saveAs: false, conflictAction: 'overwrite'
                        };
                        chrome.downloads.download(downloadOptions)
                    } else { // NODEJS
                        // REMOVER CARACTERES NÃO ACEITOS PELO WINDOWS E DEFINIR O MÁXIMO DE 250
                        let pathLetter = path.charAt(0)
                        path = path.substring(0, 250).replace(/[<>:"\\|?*]/g, '').replace(pathLetter, `${pathLetter}:`)
                        await _fs.promises.mkdir(_path.dirname(path), { recursive: true });
                        await _fs.promises.writeFile(path, text, { flag: !inf.rewrite ? 'w' : 'a' })
                    };
                    resNew['ret'] = true;
                    resNew['msg'] = `FILE WRITE: OK`
                    resNew['res'] = path
                }
                return resNew
            }

            async function fileRead(inf) {
                let resNew = { 'ret': false }, path
                if (inf.path.includes(':')) {
                    path = inf.path
                } else {
                    infFile = { 'path': inf.path, 'functionLocal': inf.functionLocal };
                    retFile = await fileRelative(infFile)
                    path = retFile.res[0]
                };
                if (eng) { // CHROME
                    if (!inf.functionLocal) {
                        path = `file:///${path}`
                    };
                    path = path.replace('%', '')
                    retFetch = await fetch(path);
                    retFetch = await retFetch.text()
                    if (!retFetch.includes('Copyright 2012 The Chromium Authors')) {
                        resNew['ret'] = true;
                        resNew['msg'] = `FILE READ: OK`;
                        resNew['res'] = retFetch;
                    } else {
                        resNew['msg'] = `FILE READ: ERRO → ARQUIVO NÃO ENCONTRADO '${path}'`;
                    }
                } else { // NODEJS
                    try {
                        let encoding = path.match(/\.(jpg|jpeg|png|ico)$/) ? undefined : 'utf8';
                        retFetch = await _fs.promises.readFile(path, encoding);
                        resNew['ret'] = true;
                        resNew['msg'] = `FILE READ: OK`;
                        resNew['res'] = retFetch;
                    } catch (e) {
                        resNew['msg'] = `FILE READ: ERRO → ARQUIVO NÃO ENCONTRADO '${path}'`;
                    }
                };
                return resNew
            }

            async function fileDel(inf) {
                let resNew = { 'ret': false }, path
                if (inf.path.includes(':')) {
                    path = inf.path
                } else {
                    infFile = { 'path': inf.path, 'functionLocal': inf.functionLocal };
                    retFile = await fileRelative(infFile)
                    path = retFile.res[0]
                };
                async function delP(inf) {
                    try {
                        let ok = false
                        try {
                            let s = await _fs.promises.stat(inf);
                            if (s.isDirectory()) {
                                let as = await _fs.promises.readdir(inf);
                                for (let a of as) {
                                    let c = _path.join(inf, a);
                                    await delP(c)
                                };
                                await _fs.promises.rmdir(inf)
                            } else {
                                await _fs.promises.unlink(inf)
                            };
                            ok = true
                        } catch (e) { }
                        if (!ok) {
                            resNew['msg'] = `FILE DEL: ERRO → AO DELETAR ARQUIVO '${path}'`;
                        } else {
                            resNew['ret'] = true;
                            resNew['msg'] = `FILE DEL: OK`;
                        }
                    } catch (e) {
                        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
                        resNew['msg'] = retRegexE.res
                    }
                };
                await delP(path)
                return resNew
            }

            async function fileList(inf) {
                let resNew = { 'ret': false }, path
                try {
                    if (!inf.max || inf.max == '') {
                        resNew['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'max' \n\n`;
                    } else {
                        if (inf.path.includes(':')) {
                            path = inf.path
                        } else {
                            infFile = { 'path': inf.path, 'functionLocal': inf.functionLocal };
                            retFile = await fileRelative(infFile)
                            path = retFile.res[0]
                        };
                        function getStatus(name) {
                            let status = _fs.statSync(name)
                            status['atime'] = new Date(status.atime.getTime() - (3 * 60 * 60 * 1000));
                            status['mtime'] = new Date(status.mtime.getTime() - (3 * 60 * 60 * 1000));
                            status['ctime'] = new Date(status.ctime.getTime() - (3 * 60 * 60 * 1000));
                            status['birthtime'] = new Date(status.birthtime.getTime() - (3 * 60 * 60 * 1000));
                            return status
                        }
                        function formatBytes(b, d = 2) {
                            if (b == 0) return '0 Bytes'; let i = Math.floor(Math.log(b) / Math.log(1024));
                            return parseFloat((b / Math.pow(1024, i)).toFixed(d < 0 ? 0 : d)) + ' ' + ['bytes', 'KB', 'MB', 'GB'][i];
                        };
                        let entries = await _fs.promises.readdir(path), result = [], count = 0, md5 = false, isFolder, stats, sizeFolder, entryObject
                        for (let entry of entries) {
                            if (count >= inf.max) {
                                break;
                            }
                            let fullPath = _path.join(path, entry);
                            try {
                                count++;
                                isFolder = _fs.statSync(fullPath).isDirectory()
                                stats = getStatus(fullPath)
                                sizeFolder = isFolder ? false : await _getFolderSize.loose(fullPath);
                                if (!isFolder && letter !== 'C') {
                                    let infFile = { 'action': 'md5', 'path': fullPath }
                                    let retFile = await file(infFile);
                                    md5 = retFile.res
                                }
                                entryObject = {
                                    'ret': true,
                                    'isFolder': isFolder,
                                    'name': entry,
                                    'path': fullPath.replace(/\\/g, '/'),
                                    'edit': stats.mtime,
                                    'size': sizeFolder ? formatBytes(sizeFolder) : false,
                                    ...(isFolder ? {} : { 'md5': md5 }),
                                };
                                result.push(entryObject);
                            } catch (e) {
                                result.push({
                                    'ret': false,
                                    'name': entry,
                                    'path': fullPath.replace(/\\/g, '/'),
                                });
                            }
                        }
                        let retOrder = result.sort((a, b) => {
                            if (a.isFolder && !b.isFolder) {
                                return -1;
                            } else if (!a.isFolder && b.isFolder) {
                                return 1;
                            } else {
                                return a.name.localeCompare(b.name);
                            }
                        })
                        resNew['ret'] = true;
                        resNew['msg'] = `FILE LIST: OK`;
                        resNew['res'] = retOrder;
                    }
                } catch (e) {
                    resNew['msg'] = `FILE LIST: ERRO → AO LISTAR '${path}'`;
                }
                return resNew

            }

            async function fileChange(inf) {
                let resNew = { 'ret': false }, pathOld, pathNew
                if (!inf.pathNew || inf.pathNew == '') {
                    resNew['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'pathNew' \n\n`;
                } else {
                    if (inf.path.includes(':')) {
                        pathOld = inf.path
                    } else {
                        infFile = { 'path': inf.path, 'functionLocal': inf.functionLocal };
                        retFile = await fileRelative(infFile)
                        pathOld = retFile.res[0]
                    }; if (inf.pathNew.includes(':')) {
                        pathNew = inf.pathNew
                    } else {
                        infFile = { 'path': inf.pathNew, 'functionLocal': inf.functionLocal };
                        retFile = await fileRelative(infFile)
                        pathNew = retFile.res[0]
                    };
                    try {
                        await _fs.promises.mkdir(_path.dirname(pathNew), { recursive: true });
                        await _fs.promises.rename(pathOld, pathNew);
                        resNew['ret'] = true;
                        resNew['msg'] = `FILE CHANGE: OK`
                    } catch (e) {
                        resNew['msg'] = `FILE CHANGE: ERRO → AO MOVER ARQUIVO '${pathOld}'`;
                    }
                }
                return resNew
            }

            async function fileMd5(inf) {
                let resNew = { 'ret': false }, path
                if (inf.path.includes(':')) {
                    path = inf.path
                } else {
                    infFile = { 'path': inf.path, 'functionLocal': inf.functionLocal };
                    retFile = await fileRelative(infFile)
                    path = retFile.res[0]
                };
                try {
                    md5 = _crypto('md5');
                    let fileContent = await _fs.promises.readFile(path);
                    md5.update(fileContent);
                    md5 = md5.digest('hex')
                    resNew['ret'] = true;
                    resNew['msg'] = `FILE MD5: OK`;
                    resNew['res'] = md5;
                } catch (e) {
                    resNew['msg'] = e;
                }
                return resNew
            }

            if (inf.action == 'write') { // ########################## WRITE
                // *
                return await fileWrite(inf)
                // *
            } else if (inf.action == 'read') { // ########################## READ
                // *
                return await fileRead(inf)
                // *
            } else if (inf.action == 'del' && !eng) { // ########################## DEL
                // *
                return await fileDel(inf)
                // *
            } else if (inf.action == 'relative') { // ########################## RELATIVE
                // *
                return await fileRelative(inf)
                // *
            } else if (inf.action == 'list' && !eng) { // ########################## LIST
                // *
                return await fileList(inf)
                // *
            } else if (inf.action == 'change' && !eng) {
                // *
                return await fileChange(inf)
                // *
            } else if (inf.action == 'md5' && !eng) { // ########################## READ
                // *
                return await fileMd5(inf)
                // *
            }
        }

        // ### LOG FUN ### [AQUI É NECESSÁRIO INSERIR A CHAVE 'stop' PARA NÃO FICAR EM LOOP INFINITO!!!]
        if (inf.logFun && !inf.stop) {
            let infFile = { 'stop': true, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await fileWrite(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['file'] = file;
} else { // NODEJS
    global['file'] = file;
}
