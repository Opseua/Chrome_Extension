// let infLog, retLog // 'logFun': true, 'functionLocal': true, 'raw': true,
// // → [Chrome_Extension]/log/#_PASTA_#/MES_11_NOV/DIA_27/00.48.10.064_ARQUIVO.txt
// infLog = { 'e': e, 'folder': '#_PASTA_#', 'functionLocal': false, 'path': `ARQUIVO.txt`, 'text': `INF AQUI` }
// // (ESCREVE NO MESMO ARQUIVO) → [Chrome_Extension]/log/#_PASTA_#/log.txt
// infLog = { 'e': e, 'folder': '#_PASTA_#', 'functionLocal': false, 'path': `log.txt`, 'text': `INF AQUI` }
// retLog = await log(infLog);
// console.log(retLog)

let e = import.meta.url, ee = e
async function log(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        if (!`rodar no → NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'e': e, 'enc': true, 'data': { 'name': 'log', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let { text, folder, path, raw, functionLocal, fileProject, fileCall } = inf
        let infFile, retFile
        let time = dateHour().res, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`
        let hou = `${time.hou}:${time.min}:${time.sec}.${time.mil}`, pathOk, rewrite = false
        // NOME DA PASTA + ARQUIVO
        pathOk = `log/${folder}`;
        if (['reg.txt', 'reg1.txt', 'reg2.txt', 'reset.js'].includes(path)) {
            pathOk = `${pathOk}/${path}`
        } else if (['log.txt', 'err.txt'].includes(path)) {
            pathOk = `${pathOk}/${mon}/${day}_${path}`; rewrite = true
        } else {
            pathOk = `${pathOk}/${mon}/${day}/${hou.replace(/:/g, '.')}_${path}`
        }
        if (rewrite) {
            text = `→ ${hou}${fileProject ? ` ${fileProject}` : ''}${fileCall ? ` ${fileCall}` : ''}\n${typeof text === 'object' ? JSON.stringify(text) : text}\n\n`
        }
        infFile = {
            'e': e, 'action': 'write', 'raw': raw ? true : false, 'functionLocal': functionLocal ? true : false,
            'text': text, 'rewrite': rewrite, 'path': pathOk.replace(/:/g, '')
        };
        await file(infFile);
        let res = `${letter}:/${globalWindow.root}/${functionLocal ? globalWindow.functions : globalWindow.project}/${pathOk}`;
        ret['res'] = res.replace('%', '');
        ret['msg'] = `LOG: OK`;
        ret['ret'] = true

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'raw': raw ? true : false, 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['log'] = log;
} else { // NODEJS
    global['log'] = log;
}
