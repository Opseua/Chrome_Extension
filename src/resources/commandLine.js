// let infCommandLine, retCommandLine // 'logFun': true, 'awaitFinish': false,
// infCommandLine = { 'e': e, 'awaitFinish': false, 'command': `notepad` }
// infCommandLine = { 'e': e, 'awaitFinish': false, 'command': `"!letter!:/ARQUIVOS/PROJETOS/WebScraper/src/2_BACKGROUND.exe"` }
// retCommandLine = await commandLine(infCommandLine);
// console.log(retCommandLine)

let e = import.meta.url, ee = e;
async function commandLine(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let command = inf.awaitFinish ? `${inf.command.replace(/!letter!/g, letter)}` : `"${letter}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/2_BACKGROUND.exe" ${inf.command.replace(/!letter!/g, letter)}`
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
            child.stdout.on('data', () => { });
            child.stderr.on('data', () => { });
        });
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
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
