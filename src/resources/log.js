// let infLog, retLog // 'logFun': true, 'functionLocal': true, 'raw': true,
// // → [Chrome_Extension]/log/#_PASTA_#/MES_11_NOV/DIA_27/00.48.10.064_ARQUIVO.txt
// infLog = { 'folder': '#_PASTA_#', 'path': `ARQUIVO.txt`, 'text': `INF AQUI` }
// // (ESCREVE NO MESMO ARQUIVO) → [Chrome_Extension]/log/#_PASTA_#/log.txt
// infLog = { 'folder': '#_PASTA_#', 'path': `log.txt`, 'text': `INF AQUI` }
// retLog = await log(infLog);
// console.log(retLog)

async function log(inf) {
    let ret = { 'ret': false };
    try {
        if (!`rodar no → NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'log', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

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
        infFile = { 'action': 'write', 'raw': inf.raw ? true : false, 'functionLocal': inf.functionLocal ? true : false, 'text': text, 'rewrite': rewrite, 'path': pathOk.replace(/:/g, '') };
        retFile = await file(infFile);
        let res = `${letter}:/${inf.functionLocal ? conf[2] : conf[3]}/${pathOk}`;
        ret['res'] = res.replace('%', '');
        ret['msg'] = `LOG: OK`;
        ret['ret'] = true

        // ### LOG FUN ###
        if (inf.logFun) {
            let infFile = { 'action': 'write', 'raw': inf.raw ? true : false, 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e });
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
