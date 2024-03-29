// } catch (catchErr) {
//     let retRegexE = await regexE({ 'e': catchErr });
//     ret['msg'] = retRegexE.res;
// };

async function regexE(inf) {
    let ret = { 'ret': false };
    console.log('\n--------------------------------------')
    try {
        let retGetPathNew = await getPathNew({ 'e': inf.e, }); let { conf, root, functions, project, line } = retGetPathNew.res; let fileOk = retGetPathNew.res.file

        // IDENTIFICAR ENGINE
        let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2

        // NOME E LINHA DO ARQUIVO
        let projectFile = `[${project}]\n→ ${fileOk}`

        // IDENTIFICAR O 'devMaster'
        let retFetch, devMaster
        if (cng == 1) { // CHROME
            try {
                retFetch = await fetch(chrome.runtime.getURL(conf)); retFetch = await retFetch.text(); retFetch = JSON.parse(retFetch); devMaster = retFetch.webSocket.devices[0].master
            } catch (catchErr) {
                devMaster = `???`
            }
        } else if (cng == 2) { // NODEJS
            try {
                retFetch = await _fs.promises.readFile(`${letter}:/${root}/${functions}/${conf}`, 'utf8'); retFetch = JSON.parse(retFetch); devMaster = retFetch.webSocket.devices[0].master
            } catch (catchErr) {
                devMaster = `???`
            }
        };

        let errorOk = {
            'cng': cng, 'cngName': cng == 1 ? 'CHROME' : cng == 2 ? 'NODEJS' : 'GOOGLE', 'devMaster': devMaster,
            'file': fileOk, 'projectFile': projectFile, 'line': line, 'inf': inf.inf, 'catchGlobal': inf.catchGlobal, 'e': inf.e.stack,
        };

        console.log(`\n### ERRO ### [catchGlobal ${inf.catchGlobal}]\n→ ${projectFile} [${errorOk.line}]\n\n${errorOk.e}\n`)

        // LOG DE ERROS [NODEJS]
        if (errorOk.cng == 2) {
            let dt1 = new Date(); dt1.setSeconds(new Date().getSeconds()).setSeconds; let dt2 = Date.now();
            let dtRes = {
                'day': String(dt1.getDate()).padStart(2, '0'), 'mon': String(dt1.getMonth() + 1).padStart(2, '0'), 'yea': String(dt1.getFullYear()),
                'hou': String(dt1.getHours()).padStart(2, '0'), 'min': String(dt1.getMinutes()).padStart(2, '0'),
                'sec': String(dt1.getSeconds()).padStart(2, '0'), 'mil': String(dt2.toString().slice(-3)),
                'tim': String(dt2.toString().slice(0, -3)), 'timMil': String(dt2.toString()),
                'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][dt1.getMonth()]
            };
            let time = dtRes, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`
            let hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, text = errorOk
            text = text = typeof text === 'object' ? `${hou}\n${JSON.stringify(text)}\n\n` : `${hou}\n${text}\n\n`

            let path = errorOk.file; if (path.includes('/')) { path = path.substring(path.lastIndexOf('/') + 1); }
            path = `${letter}:/${root}/${project}/log/JavaScript/${mon}/${day}/${hou}_ERR_${path.replace(/[<>:"\\|?*]/g, '').replace('.js', '')}.txt`

            if (typeof errorOk === 'object') {
                let raw = ''; let obj = errorOk; let concat = inf.concat ? inf.concat : `\n\n#######\n\n`
                for (let chave in obj) {
                    if (typeof obj[chave] === 'object') { for (let subChave in obj[chave]) { raw += obj[chave][subChave] + concat; } }
                    else { raw += obj[chave] + concat; }
                }; text = `${text}\n\n${raw}`
            }

            await _fs.promises.mkdir(_path.dirname(path), { recursive: true }); await _fs.promises.writeFile(path, text, { flag: 'a' })
        }

        // ENVIAR NOTIFICAÇÃO COM O ERRO
        let reqOpt = { 'method': 'POST', };
        let body = JSON.stringify({
            'fun': [{
                'securityPass': errorOk.cng == 3 ? 'AAAAAAAA' : globalWindow.securityPass,
                'retInf': false,
                'name': 'notification',
                'par': {
                    'duration': 5, 'icon': './src/scripts/media/notification_3.png',
                    'title': `### ERRO ${errorOk.cngName} [${errorOk.devMaster}] ###`,
                    'text': `→ ${errorOk.projectFile} [${errorOk.line}]\n\n${errorOk.e.substring(0, 128)}`
                }
            }]
        })
        try {
            let url = errorOk.cng == 3 ? 'http://AAAAAAAA.20:1234/AAAAAAAA' : `http://18.191.205.200:8888/OPSEUA_CHROME`//`http://${globalWindow.devSend}`
            // GOOGLE
            if (errorOk.cng == 3) {
                reqOpt['payload'] = body; UrlFetchApp.fetch(url, reqOpt)
                Browser.msgBox(`### ERRO ### → ${errorOk.projectFile}[${errorOk.line}]`, `${errorOk.e.substring(0, 128)}`, Browser.Buttons.OK);
            } else {
                // CHROME | NODE
                reqOpt['body'] = body; await fetch(url, reqOpt)
            }
        } catch (catchErr) {
            console.log(`\n\n### ERRO REGEXe [FETCH] ###\n\n${catchErr}\n`)
        }
        ret['res'] = { 'file': errorOk.file, 'line': errorOk.line, 'projectFile': errorOk.projectFile, 'e': errorOk.e, }
        ret['msg'] = `\n\n### ERRO ### [catchGlobal ${inf.catchGlobal}]\n\n→ ${errorOk.projectFile} [${errorOk.line}]\n${errorOk.e}`;
    } catch (catchErr) {
        console.log(`\n\n### ERRO REGEXe ###\n\n${catchErr.stack}\n`)
    };
    console.log('--------------------------------------\n')
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['regexE'] = regexE;
} else { // NODEJS
    global['regexE'] = regexE;
}


