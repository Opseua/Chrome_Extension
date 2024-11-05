// let infLog, retLog // 'raw': true,
// // (ESCREVE NO MESMO ARQUIVO: NÃO) | (CRIA UM NOVO POR HORA: NAO) → [Chrome_Extension]/log/#_PASTA_#/MES_11_NOV/DIA_27/00.48.10.064_ARQUIVO.txt
// infLog = { e, 'folder': '#_PASTA_#', 'functionLocal': false, 'path': `ARQUIVO.txt`, 'text': `INF AQUI`, };
// // (ESCREVE NO MESMO ARQUIVO: SIM) | (CRIA UM NOVO POR HORA: NAO) → [Chrome_Extension]/log/JavaScript/MES_11_NOV/DIA_27_log.txt
// infLog = { e, 'folder': 'JavaScript', 'functionLocal': false, 'path': `log.txt`, 'text': `INF AQUI`, 'unique': true, };
// // (ESCREVE NO MESMO ARQUIVO: SIM) | (CRIA UM NOVO POR HORA: SIM) → [Chrome_Extension]/log/JavaScript/MES_11_NOV/DIA_27/00.48.10.064_log.txt
// infLog = { e, 'folder': 'JavaScript', 'functionLocal': false, 'path': `log.txt`, 'text': `INF AQUI`, 'unique': false, };
// retLog = await log(infLog); console.log(retLog);

let e = import.meta.url, ee = e;
async function log(inf = {}) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let { folder, path, text, raw, functionLocal, fileProject, fileCall, unique, } = inf;

        if (!folder) {
            ret['msg'] = `LOG: ERRO | INFORMAR O 'folder'`;
        } else if (!path) {
            ret['msg'] = `LOG: ERRO | INFORMAR O 'path'`;
        } else if (!text) {
            ret['msg'] = `LOG: ERRO | INFORMAR O 'text'`;
        } else {
            let infFile, houTxt, houFile, minSecMil, pathOk, rewrite = false
            let time = dateHour().res, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`
            minSecMil = `${time.min}:${time.sec}.${time.mil}`
            houFile = `${time.hou}:${minSecMil}`

            // FORMATO: 24 HORAS (11h, 12h, 13h, 14h...)
            houTxt = `${time.hou}:${minSecMil}`
            // FORMATO: 12 HORAS (11h, 12h, 01h, 02h...)
            // houTxt = `${time.hou12}:${minSecMil} ${time.houAmPm}`

            // NOME DA PASTA + ARQUIVO
            pathOk = `log/${folder}`;
            if (['reg.txt', 'reg1.txt', 'reg2.txt', 'reset.js'].includes(path)) {
                pathOk = `${pathOk}/${path}`
            } else if (['log.txt', 'err.txt'].includes(path)) {
                let pathEnd = unique ? '' : `/${time.hou}.00-${time.hou}.59`
                pathOk = `${pathOk}/${mon}/${day}${pathEnd}_${path}`; rewrite = true
            } else {
                // NÃO ALTERAR PARA O PADRÃO DE 12 HORAS!!! (PORQUE OS ARQUIVOS NÃO FICARIAM EM ORDEM NUMÉRICA)
                pathOk = `${pathOk}/${mon}/${day}/${houFile.replace(/:/g, '.')}_${path}`
            }
            if (rewrite) {
                text = `→ ${houTxt}${fileProject ? ` ${fileProject}` : ''}${fileCall ? ` ${fileCall}` : ''}\n${typeof text === 'object' ? JSON.stringify(text) : text}\n\n`
            }
            infFile = {
                e, 'action': 'write', 'raw': raw ? true : false, 'functionLocal': functionLocal ? true : false,
                'text': text, 'rewrite': rewrite, 'path': pathOk.replace(/:/g, '')
            };
            await file(infFile);
            let res = `${letter}:/${globalWindow.root}/${functionLocal ? globalWindow.functions : globalWindow.project}/${pathOk}`;

            ret['res'] = res.replace('%', '');
            ret['msg'] = `LOG: OK`;
            ret['ret'] = true
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['log'] = log;