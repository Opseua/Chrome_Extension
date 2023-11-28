// let infCommandLine, retCommandLine // 'logFun': true, 'awaitFinish': false,
// infCommandLine = { 'command': `notepad` }
// infCommandLine = { 'command': `"!letter!:/ARQUIVOS/PROJETOS/WebScraper/src/1_BACKGROUND.exe"` }
// retCommandLine = await commandLine(infCommandLine);
// console.log(retCommandLine)

async function commandLine(inf) {
    let ret = { 'ret': false };
    try {
        if (!`rodar no →  NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'commandLine', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let command = inf.awaitFinish ? `${inf.command.replaceAll('!letter!', letter)}` : `"${letter}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/1_BACKGROUND.exe" ${inf.command.replaceAll('!letter!', letter)}`
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

                // ### LOG FUN ###
                if (inf.logFun) {
                    let infFile = { 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
                    infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
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
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['commandLine'] = commandLine;
} else { // NODEJS
    global['commandLine'] = commandLine;
}
