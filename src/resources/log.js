// let infLog, retLog; // 'raw': true,
// // (ESCREVE NO MESMO ARQUIVO: NÃO) | CRIA UM NOVO POR HORA: [NAO] → [project]/logs/#_PASTA_#/MES_11_NOV/DIA_27/00.48.10.064_ARQUIVO.txt
// infLog = { e, 'folder': '#_PASTA_#', 'path': `ARQUIVO.txt`, 'text': `INF AQUI`, };
// // (ESCREVE NO MESMO ARQUIVO: SIM) | CRIA UM NOVO POR HORA: [NAO] → [project]/logs/JavaScript/MES_11_NOV/DIA_27_log.txt
// infLog = { e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `INF AQUI`, 'byHour': false, };
// // (ESCREVE NO MESMO ARQUIVO: SIM) | CRIA UM NOVO POR HORA: [SIM] → [project]/logs/JavaScript/MES_11_NOV/DIA_27/00.48.10.064_log.txt
// infLog = { e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `INF AQUI`, 'byHour': true, };
// retLog = await log(infLog); console.log(retLog);

let e = import.meta.url, ee = e;
async function log(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { folder, path, text, raw, functionLocal = false, projectConsole, fileCall, byHour, currentDateHour, } = inf;

        if (!folder) {
            ret['msg'] = `LOG: ERRO | INFORMAR O 'folder'`;
        } else if (!path) {
            ret['msg'] = `LOG: ERRO | INFORMAR O 'path'`;
        } else if (!text) {
            ret['msg'] = `LOG: ERRO | INFORMAR O 'text'`;
        } else {
            let houTxt, pathOk, add = false;

            let time = dateHour().res;
            let mon = `MES_${time.mon}_${time.monNam}`;
            let day = `DIA_${time.day}`;
            let minSecMil = `${time.min}:${time.sec}.${time.mil}`;
            let houFile = `${time.hou}:${minSecMil}`;

            // →→→ FORMATO: 24 HORAS (11h, 12h, 13h, 14h...)
            houTxt = `${time.hou}:${minSecMil}`;
            // →→→ FORMATO: 12 HORAS (11h, 12h, 01h, 02h...)
            // houTxt = `${time.hou12}:${minSecMil} ${time.houAmPm}`

            // NOME DA PASTA + ARQUIVO
            pathOk = `logs/${folder}`;
            if (['reg.txt', 'reg1.txt', 'reg2.txt', 'reset.js',].includes(path)) {
                pathOk = `${pathOk}/${path}`;
            } else if (['log.txt', 'err.txt',].includes(path) || (path.includes('log') && path.includes('.txt'))) {
                let pathEnd = !byHour ? '' : `/${time.hou}.00-${time.hou}.59`;
                pathOk = `${pathOk}/${mon}/${day}${pathEnd}_${path}`; add = true;
            } else {
                // NÃO ALTERAR PARA O PADRÃO DE 12 HORAS!!! (PORQUE OS ARQUIVOS NÃO FICARIAM EM ORDEM NUMÉRICA)
                pathOk = `${pathOk}/${mon}/${day}/${houFile.replace(/:/g, '.')}_${path}`;
            }
            if (add) {
                text = `→ ${currentDateHour || houTxt} ${projectConsole || ''}${fileCall ? ` ${fileCall}` : ''}\n${typeof text === 'object' ? JSON.stringify(text) : text}\n\n`;
            }

            let retFile = await file({ e, 'action': 'write', 'raw': !!raw, functionLocal, text, add, 'path': pathOk.replace(/:/g, ''), });
            if (!retFile.ret) { return retFile; }

            ret['res'] = retFile.res;
            ret['msg'] = `LOG: OK`;
            ret['ret'] = true;
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODEJS
globalThis['log'] = log;


