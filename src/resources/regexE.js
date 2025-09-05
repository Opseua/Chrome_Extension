// 'ignoreAlert': true,
// try {
//     // ***
//     // CÓDIGO AQUI
//     aaa;
//     // ***
// } catch (catchErr) {
//     let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
//     (async () => { let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res']; })();
// };

let rate = rateLimiter({ 'max': 5, 'sec': 5, });
async function regexE(inf = {}) {
    let ret = { 'ret': false, }; if (!rate.check().ret) { crashCode('REGEXe: ERRO | EM LOOP!!!'); }
    try {
        let { e, ignoreAlert = false, concat = `\n\n#######\n\n`, } = inf;

        // IDENTIFICAR ENGINE
        let cng = (typeof globalThis.alert !== 'undefined') ? 1 : (typeof globalThis.doGet !== 'undefined') ? 3 : 2;

        // PEGAR O PROJETO, ARQUIVO E LINHA DO ERRO
        let retGetPath = await getPath({ e, }), { root, project, line, } = retGetPath.res; let fileOk = retGetPath.res.file;

        // NOME E LINHA DO ARQUIVO | IDENTIFICAR HOST, PORT, SECURITYPASS E DEVMASTER
        let errorOk = {
            cng, 'cngName': cng === 1 ? 'CHROME' : cng === 2 ? 'NODE' : 'GOOGLE', 'devMaster': gW.devMaster,
            'projectFile': `🟢 ${!project.includes('/') ? project : 'Chrome_Extension'}`, 'file': `🔵 ${fileOk}`, 'line': Number(line), 'inf': inf.inf ? inf.inf.toString() : '___VAZIO___', 'e': e.stack,
        };

        if (!ignoreAlert) {
            console.log('\x1b[31m%s\x1b[0m', `\n-----------------------------------\n\n### ERRO ###\n${errorOk.projectFile}\n${errorOk.file} [${errorOk.line}]\n\n${errorOk.e}\n\n-----------------------------------\n`);
        }

        // LOG DE ERROS [NODE]
        if (errorOk.cng === 2) {
            let dt1 = new Date(), dt2 = Date.now(); dt1.setSeconds(new Date().getSeconds()).setSeconds; let dtRes = {
                'day': String(dt1.getDate()).padStart(2, '0'), 'mon': String(dt1.getMonth() + 1).padStart(2, '0'), 'yea': String(dt1.getFullYear()), 'hou': String(dt1.getHours()).padStart(2, '0'),
                'min': String(dt1.getMinutes()).padStart(2, '0'), 'sec': String(dt1.getSeconds()).padStart(2, '0'), 'mil': String(dt2.toString().slice(-3)), 'tim': String(dt2.toString().slice(0, -3)),
                'timMil': String(dt2.toString()), 'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',][dt1.getMonth()],
            }; let time = dtRes, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`, hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, text = errorOk;
            try { text = text = typeof text === 'object' ? `${JSON.stringify(text)}\n\n` : `${text}\n\n`; } catch { text = `ERRO_AO_CONVERTER_PARA_JSON\n\n`; }

            let path = errorOk.file; if (path.includes('/')) { path = path.substring(path.lastIndexOf('/') + 1); }
            path = `${letter}:/${root}/${project}/logs/JavaScript/${mon}/${day}/${hou}_ERR_${path.replace(/[<>:"\\|?*]/g, '').replace('.js', '')}.txt`;

            if (typeof errorOk === 'object') {
                let raw = '', obj = errorOk; for (let k in obj) { if (typeof obj[k] === 'object') { for (let subChave in obj[k]) { raw += obj[k][subChave] + concat; } } else { raw += obj[k] + concat; } }
                text = `${hou}\n${raw}\n\n${text}`;
            } await _fs.promises.mkdir(_path.dirname(path), { recursive: true, }); await _fs.promises.writeFile(path, text, { flag: 'a', });
        }

        if (!ignoreAlert) {
            // ENVIAR NOTIFICAÇÃO COM O ERRO
            let retNotification = await notification({
                'ignoreErr': true,
                'legacy': true,
                'keepOld': true,
                'title': `### ERRO (${errorOk.devMaster}) [${errorOk.cngName}]`,
                'text': `${errorOk.projectFile}\n${errorOk.file} [${errorOk.line}]\n\n${errorOk.e}`,
            });

            if (!retNotification.ret) {
                console.log('\x1b[31m%s\x1b[0m', `-----------------------------------\n\n### ERRO REGEXe (NOTIFICATION [LEGACY]) ###\n\n${retNotification.msg}\n\n-----------------------------------`);
            }
        }

        ret['res'] = { 'projectFile': errorOk.projectFile, 'file': errorOk.file, 'line': errorOk.line, 'e': errorOk.e, };
        ret['msg'] = `### ERRO ###\n\n→ ${errorOk.projectFile} [${errorOk.line}]\n${errorOk.e}`;

    } catch (catchErr) {
        if (!inf.ignoreAlert) {
            console.log('\x1b[31m%s\x1b[0m', `\n-----------------------------------\n\n### ERRO REGEXe ###\n\n${catchErr.stack}\n\n-----------------------------------`);
        }
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['regexE'] = regexE;


