// let infLog = { 'folder': '#_TESTE_#', 'path': `TESTE.txt`, 'text': 'INF AQUI' }
// let retLog = await log(infLog);
// console.log(retLog)

async function log(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        if (!`rodar no → NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'log', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };
        let time = dateHour().res, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`
        let hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, pathOk, rewrite = false
        let text = inf.text; pathOk = `log/${inf.folder}`;
        if (['reg.txt', 'reg1.txt', 'reg2.txt', 'reset.js'].includes(inf.path)) {
            pathOk = `${pathOk}/${inf.path}`
        } else if (['log.txt'].includes(inf.path)) {
            pathOk = `${pathOk}/${mon}/${day}_${inf.path}`; rewrite = true
        } else {
            pathOk = `${pathOk}/${mon}/${day}/${hou}_${inf.path}`
        }
        if (rewrite) {
            text = typeof text === 'object' ? `${hou}\n${JSON.stringify(inf.text)}\n\n` : `${hou}\n${inf.text}\n\n`
        }
        let infFile = { 'action': 'write', 'functionLocal': false, 'text': text, 'rewrite': rewrite, 'path': pathOk };
        let retFile = await file(infFile);
        let res = `${conf[1]}:/${conf[3]}/${pathOk}`;
        ret['res'] = res.replace('%', '');
        ret['msg'] = `LOG: OK`;
        ret['ret'] = true
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['log'] = log;
    } else { // NODEJS
        global['log'] = log;
    }
}