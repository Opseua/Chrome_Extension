// let infCommandLine, retCommandLine // 'logFun': true, 'awaitFinish': false,
// infCommandLine = { 'command': `notepad` }
// infCommandLine = { 'command': `"!letter!:/ARQUIVOS/PROJETOS/WebScraper/src/1_BACKGROUND.exe"` }
// retCommandLine = await commandLine(infCommandLine);
// console.log(retCommandLine)

let e = import.meta.url;
async function commandLine(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        if (!`rodar no →  NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'commandLine', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let command = inf.awaitFinish ? `${inf.command.replace(/!letter!/g, letter)}` : `"${letter}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/1_BACKGROUND.exe" ${inf.command.replace(/!letter!/g, letter)}`
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
                if (inf && inf.logFun) {
                    let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
                    infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
                }
                resolve();
                return;
            });
            child.stdout.on('data', () => { });
            child.stderr.on('data', () => { });
        });
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
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
