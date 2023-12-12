// let infLog, retLog // 'logFun': true, 'functionLocal': true, 'raw': true,
// // → [Chrome_Extension]/log/#_PASTA_#/MES_11_NOV/DIA_27/00.48.10.064_ARQUIVO.txt
// infLog = { 'e': e, 'folder': '#_PASTA_#', 'functionLocal': false, 'path': `ARQUIVO.txt`, 'text': `INF AQUI` }
// // (ESCREVE NO MESMO ARQUIVO) → [Chrome_Extension]/log/#_PASTA_#/log.txt
// infLog = { 'e': e, 'folder': '#_PASTA_#', 'functionLocal': false, 'path': `log.txt`, 'text': `INF AQUI` }
// retLog = await log(infLog);
// console.log(retLog)

let e = import.meta.url;
async function log(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    // if (catchGlobal) {
    //     const errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
    //     if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
    //     else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    // }
    try {
        if (!`rodar no → NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'log', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let confKeep = conf
        if (!eng && inf && inf.e) {
            let regex = e.match(/(file:\/\/\/.*?PROJETOS\/[^\/]+)/)
            if (regex) { confKeep[3] = regex[1].replace('file:///', '').split(':/')[1] }
        }

        let infFile, retFile
        let time = dateHour().res, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`
        let hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, pathOk, rewrite = false
        let text = inf.text;
        // NOME DA PASTA + ARQUIVO
        pathOk = `log/${inf.folder}`;
        if (['reg.txt', 'reg1.txt', 'reg2.txt', 'reset.js'].includes(inf.path)) {
            pathOk = `${pathOk}/${inf.path}`
        } else if (['log.txt', 'err.txt'].includes(inf.path)) {
            pathOk = `${pathOk}/${mon}/${day}_${inf.path}`; rewrite = true
        } else {
            pathOk = `${pathOk}/${mon}/${day}/${hou}_${inf.path}`
        }
        if (rewrite) {
            text = typeof text === 'object' ? `${hou}\n${JSON.stringify(inf.text)}\n\n` : `${hou}\n${inf.text}\n\n`
        }
        infFile = { 'e': e, 'action': 'write', 'raw': inf.raw ? true : false, 'functionLocal': inf.functionLocal ? true : false, 'text': text, 'rewrite': rewrite, 'path': pathOk.replace(/:/g, '') };
        retFile = await file(infFile);
        let res = `${letter}:/${inf.functionLocal ? confKeep[2] : confKeep[3]}/${pathOk}`;
        ret['res'] = res.replace('%', '');
        ret['msg'] = `LOG: OK`;
        ret['ret'] = true

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'raw': inf.raw ? true : false, 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
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
    window['log'] = log;
} else { // NODEJS
    global['log'] = log;
}
