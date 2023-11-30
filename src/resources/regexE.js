// } catch (e) {
//     let retRegexE = await regexE({ 'e': e });
//     ret['msg'] = retRegexE.res;
// };

async function regexE(inf) {
    let ret = { 'ret': false };
    try {
        // IDENTIFICAR ENGINE
        let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2

        // NOME E LINHA DO ARQUIVO
        let matches = inf.e.stack.match(/\((.*?)\)/g).map(match => match.slice(1, -1));
        let file = `NÃO IDENTIFICADO`, line = `NÃO IDENTIFICADA`
        if (matches instanceof Array) {
            for (let [index, value] of matches.entries()) {
                if (cng == 1) {
                    file = value.split('/')
                    file = file[file.length - 1]
                    break
                } else if (cng == 2) {
                    console.log(value)
                    if (value.includes('.js')) {
                        file = value.split('/')
                        file = file[file.length - 1]
                        break
                    }
                } else {
                    file = value
                    break
                }
            }
            file = file.split(':')
            line = file[1]
            file = file[0]
        }
        let errorOk = { 'cng': cng, 'cngName': cng == 1 ? 'CHROME' : cng == 2 ? 'NODEJS' : 'GOOGLE', 'file': file, 'line': line, 'inf': inf.inf, 'e': inf.e.stack, };

        console.log(`\n\n### ERRO ###\n→ ${errorOk.file} [${errorOk.line}]\n\n${errorOk.e}\n\n`)

        // LOG DE ERROS [NODEJS]
        if (errorOk.cng == 2 && conf && conf[3]) {
            let dt1 = new Date();
            dt1.setSeconds(new Date().getSeconds()).setSeconds;
            let dt2 = Date.now();
            let dtRes = {
                'day': String(dt1.getDate()).padStart(2, '0'),
                'mon': String(dt1.getMonth() + 1).padStart(2, '0'),
                'yea': String(dt1.getFullYear()),
                'hou': String(dt1.getHours()).padStart(2, '0'),
                'min': String(dt1.getMinutes()).padStart(2, '0'),
                'sec': String(dt1.getSeconds()).padStart(2, '0'),
                'mil': String(dt2.toString().slice(-3)),
                'tim': String(dt2.toString().slice(0, -3)),
                'timMil': String(dt2.toString()),
                'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][dt1.getMonth()]
            };
            let time = dtRes, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`
            let hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, text = errorOk
            text = text = typeof text === 'object' ? `${hou}\n${JSON.stringify(text)}\n\n` : `${hou}\n${text}\n\n`
            // NO MESMO ARQUIVO
            // let path = `${letter}:/${conf[3]}/log/JavaScript/${mon}/${day}_err.txt`
            // ARQUIVO DIFERENTE DENTRO DE OUTRA PASTA
            let path = `${letter}:/${conf[3]}/log/JavaScript/${mon}/${day}/${hou}_ERR_${errorOk.file.replace(/[<>:"\\|?*]/g, '').replace('.js', '')}.txt`

            if (typeof errorOk === 'object') {
                let raw = '';
                let obj = errorOk
                let concat = inf.concat ? inf.concat : `\n\n#######\n\n`
                for (let chave in obj) {
                    if (typeof obj[chave] === 'object') {
                        for (let subChave in obj[chave]) {
                            raw += obj[chave][subChave] + concat;
                        }
                    } else {
                        raw += obj[chave] + concat;
                    }
                }
                text = `${text}\n\n${raw}`
            }

            await _fs.promises.mkdir(_path.dirname(path), { recursive: true });
            await _fs.promises.writeFile(path, text, { flag: 'a' })
        }

        // ENVIAR NOTIFICAÇÃO COM O ERRO
        let reqOpt = { 'method': 'POST', };
        let body = JSON.stringify({
            'fun': [{
                'securityPass': errorOk.cng == 3 ? 'AAAAAAAAAAAAAAAA' : securityPass,
                'retInf': false,
                'name': 'notification',
                'par': {
                    'duration': 5, 'icon': './src/media/notification_3.png',
                    'title': `### ERRO ${errorOk.cngName} ###`,
                    'text': `→ ${errorOk.file} [${errorOk.line}]\n${errorOk.e.substring(0, 128)}`
                }
            }]
        })
        try {
            let url = errorOk.cng == 3 ? 'http://AAAA.20:8888/OAAAAAAAA' : `http://${devChromeWeb.split('://')[1]}`
            // GOGOLE
            if (errorOk.cng == 3) {
                reqOpt['payload'] = body
                UrlFetchApp.fetch(url, reqOpt)
                Browser.msgBox(`### ERRO ### → ${errorOk.file}[${errorOk.line}]`, `${errorOk.e.substring(0, 128)}`, Browser.Buttons.OK);
            } else {
                // CHROME | GOOGLE
                reqOpt['body'] = body
                await fetch(url, reqOpt)
            }
        } catch (e) {
            console.log(`\n\n### ERRO REGEXe [FETCH] ###\n\n${e}\n\n`)
        }
        ret['res'] = { 'file': errorOk.file, 'line': errorOk.line, 'e': errorOk.e, }
        ret['msg'] = `\n\n### ERRO ###\n\n→ ${errorOk.file} [${errorOk.line}]\n${errorOk.e}`;
    } catch (e) {
        console.log(`\n\n### ERRO REGEXe ###\n\n${e.stack}\n\n`)
    };
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
