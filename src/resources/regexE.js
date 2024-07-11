// } catch (catchErr) {
//     let retRegexE = await regexE({ 'e': catchErr });
//     ret['msg'] = retRegexE.res;
// };

async function regexE(inf) {
    let ret = { 'ret': false };
    try {
        // IDENTIFICAR ENGINE
        let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2;

        // PEGAR O PROJETO, ARQUIVO E LINHA DO ERRO
        let retGetPath = await getPath({ 'e': inf.e, }); let { root, project, line } = retGetPath.res; let fileOk = retGetPath.res.file

        // NOME E LINHA DO ARQUIVO | IDENTIFICAR HOST, PORT, SECURITYPASS E DEVMASTER
        let projectFile = `[${project}]\n→ ${fileOk}`;
        let errorOk = {
            'cng': cng, 'cngName': cng == 1 ? 'CHROME' : cng == 2 ? 'NODEJS' : 'GOOGLE', 'devMaster': globalWindow.devMaster,
            'file': fileOk, 'projectFile': projectFile, 'line': line, 'inf': inf.inf, 'e': inf.e.stack,
        };

        console.error(`\n------------------------------------------------\n\n### ERRO ###\n→ ${projectFile} [${errorOk.line}]\n\n${errorOk.e}\n\n------------------------------------------------`)

        // LOG DE ERROS [NODEJS]
        if (errorOk.cng == 2) {
            let dt1 = new Date(); dt1.setSeconds(new Date().getSeconds()).setSeconds; let dt2 = Date.now(); let dtRes = {
                'day': String(dt1.getDate()).padStart(2, '0'), 'mon': String(dt1.getMonth() + 1).padStart(2, '0'), 'yea': String(dt1.getFullYear()), 'hou': String(dt1.getHours()).padStart(2, '0'),
                'min': String(dt1.getMinutes()).padStart(2, '0'), 'sec': String(dt1.getSeconds()).padStart(2, '0'), 'mil': String(dt2.toString().slice(-3)), 'tim': String(dt2.toString().slice(0, -3)),
                'timMil': String(dt2.toString()), 'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][dt1.getMonth()]
            }; let time = dtRes, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`; let hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, text = errorOk
            text = text = typeof text === 'object' ? `${hou}\n${JSON.stringify(text)}\n\n` : `${hou}\n${text}\n\n`

            let path = errorOk.file; if (path.includes('/')) { path = path.substring(path.lastIndexOf('/') + 1); }
            path = `${letter}:/${root}/${project}/log/JavaScript/${mon}/${day}/${hou}_ERR_${path.replace(/[<>:"\\|?*]/g, '').replace('.js', '')}.txt`

            if (typeof errorOk === 'object') {
                let raw = ''; let obj = errorOk; let concat = inf.concat ? inf.concat : `\n\n#######\n\n`
                for (let chave in obj) { if (typeof obj[chave] === 'object') { for (let subChave in obj[chave]) { raw += obj[chave][subChave] + concat; } } else { raw += obj[chave] + concat; } }; text = `${text}\n\n${raw}`
            }; await _fs.promises.mkdir(_path.dirname(path), { recursive: true }); await _fs.promises.writeFile(path, text, { flag: 'a' })
        }

        // ENVIAR NOTIFICAÇÃO COM O ERRO
        try {
            function notificationLegacy(inf) {
                let { title, text } = inf; let cng = typeof UrlFetchApp !== 'undefined'; (async () => {
                    let url = `http://${globalWindow.devSend}`; let reqOpt = { 'method': 'POST', }; let body = JSON.stringify({
                        "fun": [{ "securityPass": globalWindow.securityPass, 'name': 'notification', 'par': { 'duration': 5, 'icon': './src/scripts/media/notification_3.png', 'title': inf.title, 'text': inf.text, 'ntfy': true } }]
                    }); reqOpt[cng ? 'payload' : 'body'] = body; if (cng) { UrlFetchApp.fetch(url, reqOpt); Browser.msgBox(title, text, Browser.Buttons.OK) } else { await fetch(url, reqOpt) } // GOOGLE | Chrome/NodeJS
                })()
            }; notificationLegacy({ 'title': `### ERRO ${errorOk.cngName} [${errorOk.devMaster}] ###`, 'text': `→ ${errorOk.projectFile} [${errorOk.line}]\n\n${errorOk.e}` })
        } catch (catchErr) {
            console.error(`\n------------------------------------------------\n\n### ERRO REGEXe [FETCH] ###\n\n${catchErr}\n\n------------------------------------------------`)
        }
        ret['res'] = { 'file': errorOk.file, 'line': errorOk.line, 'projectFile': errorOk.projectFile, 'e': errorOk.e, }
        ret['msg'] = `### ERRO ###\n\n→ ${errorOk.projectFile} [${errorOk.line}]\n${errorOk.e}`;

    } catch (catchErr) {
        console.error(`\n------------------------------------------------\n\n### ERRO REGEXe ###\n\n${catchErr.stack}\n\n------------------------------------------------`)
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['regexE'] = regexE;