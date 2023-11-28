async function regexE(inf) {
    let ret = { 'ret': false };
    try {
        let errorOk = { 'file': 'NÃO IDENTIFICADO', 'line': 'NÃO IDENTIFICADA', 'e': inf.e.stack };
        let match = inf.e.stack.match(/(?:at\s.*\()?(.*):(\d+):(\d+)\)?/);
        console.log(inf.e.stack)
        if (match && match.length >= 4) {
            let file = match[1].split('(')[1]
            errorOk['file'] = file.substring(file.lastIndexOf('/') + 1).replace('.js', '') + '.js'
            errorOk['line'] = parseInt(match[2], 10)
        }

        console.log(`\n\n### ERRO ###\n→ ${errorOk.file} [${errorOk.line}]\n\n${errorOk.e}\n\n`)

        // LOG DE ERROS
        if (!eng && conf[3]) { // NODEJS
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
            let path = `${letter}:/${conf[3]}/log/JavaScript/${mon}/${day}_err.txt`
            text = text = typeof text === 'object' ? `${hou}\n${JSON.stringify(text)}\n\n` : `${hou}\n${text}\n\n`
            await _fs.promises.mkdir(_path.dirname(path), { recursive: true });
            await _fs.promises.writeFile(path, text, { flag: 'a' })
        }

        // ENVIAR NOTIFICAÇÃO COM ERRO
        let par = {
            'method': 'POST', 'body': JSON.stringify({
                'fun': [{
                    'securityPass': securityPass,
                    'retInf': false,
                    'name': 'notification',
                    'par': {
                        'duration': 5, 'icon': './src/media/notification_3.png',
                        'title': `${eng ? '### ERRO CHROME ###' : '### ERRO NODEJS ###'}`,
                        'text': `→ ${errorOk.file} [${errorOk.line}]\n${errorOk.e.substring(0, 128)}`
                    }
                }]
            })
        };
        await fetch(`http://${devChromeWeb.split('://')[1]}`, par)
        ret['msg'] = `\n\n### ERRO ###\n\n→ ${errorOk.file} [${errorOk.line}]\n${errorOk.e}`;
    } catch (e) {
        console.log(`\n\n### ERRO REGEXe ###\n\n${e}\n\n`)
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
