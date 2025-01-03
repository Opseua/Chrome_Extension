// let infCommandLine, retCommandLine;
// infCommandLine = { e, 'notBackground': false, 'awaitFinish': false, 'notAdm': false, 'newBackground': true, 'view': false, 'delay': 0, 'terminalPathAAA': `!letter!:/PASTA 1`, 'withCmd': false, 'command': `notepad`, };
// retCommandLine = await commandLine(infCommandLine); console.log(retCommandLine);

let e = import.meta.url, ee = e;
async function commandLine(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { command = false, awaitFinish = false, notAdm = false, notBackground = false, newBackground = false, view = false, delay = 0, terminalPath = false, withCmd = false, } = inf;

        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _exec === 'undefined') { await funLibrary({ 'lib': '_exec', }); };

        if (!command) { ret['msg'] = `COMMAND LINE: ERRO | INFORMAR O 'command'`; return ret; }

        if (!notBackground) {
            if (!newBackground) {
                // 2_BACKGROUND
                command = awaitFinish ? `${command}` : `${notAdm ? '%2_BACKGROUND_NOT_ADM%' : '%2_BACKGROUND%'} ${command}`;
            } else {
                // 3_BACKGROUND
                if (!command.startsWith(`"`) || !command.endsWith(`"`)) { command = `"${command}"`; }

                // PARAMETROS
                let pars = [];
                if (!view) { pars.push(`/NOCONSOLE`); };
                if (notAdm) { pars.push(`/NONELEVATED`); } else { pars.push(`/RUNAS`); }
                if (delay) { pars.push(`/DELAY=${delay}`); };
                if (terminalPath) { let ter = terminalPath; if (!ter.startsWith(`"`) || !ter.endsWith(`"`)) { ter = `"${ter}"`; }; ter = ter.replace(/\//g, `\\`); pars.push(`/D=${ter}`); };
                if (awaitFinish) { pars.push(`/WAIT`); };

                // COMANDO FINAL
                command = `"D:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\hstart64.exe"${pars.length > 0 ? ' ' + pars.join(' ') : ''} ${withCmd ? `"cmd.exe /c ${command}"` : `${command}`}`;
            }
        }

        // SUBSTITUIR VARIÁVEIS DE AMBIENTE
        command = command.replace(/[!%](letter|letra)[!%]/g, letter).replace(/[!%](fileProjetos)[!%]/g, fileProjetos).replace(/[!%](fileWindows)[!%]/g, fileWindows);

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