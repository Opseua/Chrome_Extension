async function regexE(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        const match = inf.e.stack.match(/(\w+\.\w+):(\d+):\d+/)
        if (match && match.length == 3) {
            ret['a'] = `#### ERRO #### ${match[1]} [${match[2]}]`
        } else {
            ret['a'] = `NAO IDENTIFICADO [NAO IDENTIFICADA]`
        };
        ret['b'] = inf.e.toString(); ret['res'] = `\n\n ${ret.a} \n ${ret.b} \n\n`
        ret['c'] = typeof window == 'undefined' ? 'ALERTA: NODEJS' : 'ALERTA: CHROME';
        ret['d'] = `${ret.a}\n${ret.b.substring(0, 128).replace('\n\n ', '')}`
        if (typeof window == 'undefined' && conf[3]) { // NODEJS
            const dt1 = new Date(); dt1.setSeconds(new Date().getSeconds()).setSeconds; const dt2 = Date.now() + (1000);
            const dtRes = {
                'day': String(dt1.getDate()).padStart(2, '0'), 'mon': String(dt1.getMonth() + 1).padStart(2, '0'),
                'yea': String(dt1.getFullYear()), 'hou': String(dt1.getHours()).padStart(2, '0'),
                'min': String(dt1.getMinutes()).padStart(2, '0'), 'sec': String(dt1.getSeconds()).padStart(2, '0'),
                'mil': String(dt2.toString().slice(-3)), 'tim': String(dt2.toString().slice(0, -3)), 'timMil': String(dt2.toString()),
                'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][dt1.getMonth()]
            };
            let time = dtRes, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`
            let hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, text = ret
            let path = `${conf[1]}:/${conf[3]}/log/JavaScript/${mon}/${day}_err1.txt`
            text = text = typeof text === 'object' ? `${hou}\n${JSON.stringify(text)}\n\n` : `${hou}\n${text}\n\n`
            await _fs.promises.mkdir(_path.dirname(path), { recursive: true });
            await _fs.promises.writeFile(path, text, { flag: 'a' })
        }
        let par = {
            'method': 'POST', 'body': JSON.stringify({
                'fun': [{
                    'securityPass': securityPass,
                    'funRet': { 'retUrl': false, 'retInf': false },
                    'funRun': {
                        'name': 'notification',
                        'par': {
                            'duration': 5, 'icon': './src/media/notification_3.png',
                            'title': ret.c, 'text': ret.d
                        }
                    }
                }]
            })
        }; fetch(`http://${devChrome.split('://')[1]}`, par)
        ret['msg'] = `REGEX E: OK`; ret['ret'] = true;
    } catch (e) { console.log(`\n\n #### ERRO REGEXe #### ${e} \n\n`) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['regexE'] = regexE;
} else { // NODEJS
    global['regexE'] = regexE;
}