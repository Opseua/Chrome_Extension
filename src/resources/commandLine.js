// let infCommandLine, retCommandLine
// infCommandLine = { 'awaitFinish': false, 'command': `notepad` }
// infCommandLine = { 'awaitFinish': false, 'command': `"!letra!:/ARQUIVOS/PROJETOS/WebScraper/src/1_BACKGROUND.exe"` }
// retCommandLine = await commandLine(infCommandLine);
// console.log(retCommandLine)

async function commandLine(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        if (!`rodar no →  NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'commandLine', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let command = inf.awaitFinish ? `${inf.command.replaceAll('!letra!', conf[1])}` : `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/1_BACKGROUND.exe" ${inf.command.replaceAll('!letra!', conf[1])}`
        await new Promise((resolve) => {
            let child = _exec(command, async (error, stdout, stderr) => {
                if (error) {
                    ret['msg'] = 'COMMAND LINE: ERRO';
                    if (stderr) {
                        ret['res'] = stderr;
                    }
                } else {
                    ret['msg'] = 'COMMAND LINE: OK';
                    if (stdout) {
                        ret['res'] = stdout;
                    }
                    ret['ret'] = true;
                }
                resolve();
                return;
            });
            child.stdout.on('data', (data) => { });
            child.stderr.on('data', (data) => { });
        });
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return {
        ...(ret.ret && { ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['commandLine'] = commandLine;
    } else { // NODEJS
        global['commandLine'] = commandLine;
    }
}