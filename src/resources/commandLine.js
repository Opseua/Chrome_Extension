// let infCommandLine, retCommandLine;
// infCommandLine = { e, 'awaitFinish': true, 'notAdm': true, 'command': `notepad`, };
// infCommandLine = { e, 'awaitFinish': true, 'notAdm': true, 'command': `!letter!:/PASTA/PROGRAMA.exe`, };
// retCommandLine = await commandLine(infCommandLine); console.log(retCommandLine);

let e = import.meta.url, ee = e;
async function commandLine(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { awaitFinish, notAdm, command, } = inf;

        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _exec === 'undefined') { await funLibrary({ 'lib': '_exec', }); };

        command = command.replace(/!letter!|%letter%|!letra!|%letra%/g, letter);
        command = awaitFinish ? `${command}` : `${notAdm ? '%2_BACKGROUND_NOT_ADM%' : '%2_BACKGROUND%'} ${command}`;
        await new Promise((resolve) => {
            let child = _exec(command, async (error, stdout, stderr) => {
                if (error) {
                    ret['msg'] = `COMMAND LINE: ERRO | ${error}`;
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
            });
            child.stdout.on('data', () => { });
            child.stderr.on('data', () => { });
        });
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['commandLine'] = commandLine;