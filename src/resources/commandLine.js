// let infCommandLine, retCommandLine // 'logFun': true, 'awaitFinish': false,
// infCommandLine = { 'e': e, 'awaitFinish': false, 'command': `notepad` }
// infCommandLine = { 'e': e, 'awaitFinish': false, 'command': `!letter!:/PASTA/PROGRAMA.exe` }
// retCommandLine = await commandLine(infCommandLine);
// console.log(retCommandLine)

let e = import.meta.url, ee = e;
async function commandLine(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let command = inf.awaitFinish ? `${inf.command.replace(/!letter!/g, letter)}` : `%2_BACKGROUND% ${inf.command.replace(/!letter!/g, letter)}`
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
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
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
