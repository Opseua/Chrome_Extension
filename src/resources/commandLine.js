// const retCommandLine = await commandLine({ 'command': 'notepad' });
// console.log(retCommandLine)

async function commandLine(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {

        if (dev) { // [ENCAMINHAR PARA DEVICE → NODEJS]
            const retInf = typeof inf.retInf === 'boolean' ? inf.retInf ? JSON.stringify(Date.now()) : false : inf.retInf ? inf.retInf : JSON.stringify(Date.now())
            const infDevAndFun = { 'name': 'commandLine', 'retInf': retInf, 'par': inf };
            const retDevAndFun = await newDevFun(infDevAndFun) // await devAndFun(infDevAndFun);
            return retDevAndFun
        };

        let command = `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/1_BACKGROUND.exe" ${inf.command}`; const retorno = new Promise((resolve, reject) => {
            _run(command, { maxBuffer: 1024 * 5000 }, (err, stdout, stderr) => {
                if (err) {
                    reject(err)
                } else { resolve('COMMAND LINE: OK') }
            })
        }); return retorno
            .then((result) => {
                ret['ret'] = true;
                ret['msg'] = `${result}`;
                return ret;
            }).catch((e) => {
                (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; return ret })()
            })




    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (dev) { // CHROME
    window['commandLine'] = commandLine;
} else { // NODEJS
    global['commandLine'] = commandLine;
}
