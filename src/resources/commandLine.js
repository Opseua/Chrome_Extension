// let retCommandLine = await commandLine({ 'command': 'notepad' });
// console.log(retCommandLine)

async function commandLine(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        if (!`rodar no → NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'commandLine', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await newDevFun(infDevAndFun); return retDevAndFun
        };
        let command = `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/1_BACKGROUND.exe" ${inf.command}`;
        let retorno = new Promise((resolve, reject) => {
            _run(command, { maxBuffer: 1024 * 5000 }, (err, stdout, stderr) => {
                if (err) {
                    reject(err)
                } else { resolve('COMMAND LINE: OK') }
            })
        }); return retorno
            .then((result) => {
                ret['msg'] = `${result}`;
                ret['ret'] = true;
                return ret;
            }).catch((e) => {
                (async () => {
                    let m = await regexE({ 'e': e });
                    ret['msg'] = m.res;
                    return ret
                })()
            })
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['commandLine'] = commandLine;
    } else { // NODEJS
        global['commandLine'] = commandLine;
    }
}