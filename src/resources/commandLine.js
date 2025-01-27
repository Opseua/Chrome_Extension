/* eslint-disable camelcase */

// let infCommandLine, retCommandLine;
// infCommandLine = {
//     e, 'notBackground': false, 'awaitFinish': false,
//     'notAdm': false,
//     // 'oldBackground': false, 'view': false, 'delay': 0, 'terminalPathAAA': `!letter!:/PASTA 1`,
//     'withCmd': false,
//     // ****************** NORMAL
//     'command': `notepad`,
//     // ****************** CMD {withCmd → true}
//     // 'command': `notepad & explorer`,
//     // ****************** (SEM ESPAÇO)
//     // 'command': `D:/ARQUIVOS/BAT.bat AAA`,
//     // 'command': `%fileChrome_Extension%/src/scripts/BAT/z_AllOff.lnk`,
//     // 'command': `%fileWindows%/PORTABLE_Notepad++/notepad++.exe D:/AAA.txt`,
//     // 'command': `!fileProjetos!/WebSocket/src/z_OUTROS_server/OFF.vbs FORCE_STOP`,
//     // ****************** (COM ESPAÇO)
//     // 'command': `"D:/ARQUIVOS/BAT.bat" "AAA BBB"`,
//     // 'command': `"%fileWindows%/PORTABLE_Notepad++/notepad++.exe" "D:/AAA BBB.txt"`,
//     // 'command': `"!fileProjetos!/WebSocket/src/z_OUTROS_server/OFF.vbs" "FORCE_STOP" "AAA BBB"`,
// };
// retCommandLine = await commandLine(infCommandLine); console.log(retCommandLine);

let e = import.meta.url, ee = e;
async function commandLine(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { command = false, awaitFinish = false, notAdm = false, notBackground = false, oldBackground = false, view = false, delay = 0, terminalPath = false, withCmd = false, } = inf;

        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _exec === 'undefined') { await funLibrary({ 'lib': '_exec', }); };

        if (!command) { ret['msg'] = `COMMAND LINE: ERRO | INFORMAR O 'command'`; return ret; }

        if (!notBackground) {
            if (oldBackground) {
                // →→→ 2_BACKGROUND
                command = awaitFinish ? `${command}` : `${notAdm ? '%2_BACKGROUND_NOT_ADM%' : '%2_BACKGROUND%'} ${command}`;
            } else {
                // →→→ 3_BACKGROUND

                // PARAMETROS
                let ps = []; if (!view) { ps.push(`/NOCONSOLE`); }; if (notAdm) { ps.push(`/NONELEVATED`); } else { ps.push(`/RUNAS`); } if (delay) { ps.push(`/DELAY=${delay}`); }; if (awaitFinish) { ps.push(`/WAIT`); };
                if (terminalPath) { let ter = terminalPath; if (!ter.startsWith(`"`) || !ter.endsWith(`"`)) { ter = `"${ter}"`; }; ter = ter.replace(/\//g, `\\`); ps.push(`/D=${ter}`); };

                // EXECUTAR COM CMD (EM CASOS ESPECÍFICOS)
                let includesDoubleQuotes = false; if (command.includes(`.vbs`) || command.includes(`.bat`) || command.includes(`.lnk`)) { includesDoubleQuotes = true; withCmd = true; }

                // ADICIONAR ASPAS EM VOLTA (EM CASOS ESPECÍFICOS)
                if (!withCmd || includesDoubleQuotes) { command = `"${command}"`; }

                // COMANDO FINAL
                command = `"%3_BACKGROUND%"${ps.length > 0 ? ' ' + ps.join(' ') : ''} ${withCmd ? `"cmd.exe /c ${command}"` : `${command}`}`;
            }
        }

        // SUBSTITUIR VARIÁVEIS DE AMBIENTE
        let a = letter; let b = fileProjetos; let c = fileChrome_Extension; let d = fileWindows;
        command = command.replace(/[!%](letter|letra)[!%]/g, a).replace(/[!%](fileProjetos)[!%]/g, b).replace(/[!%](fileChrome_Extension)[!%]/g, c).replace(/[!%](fileWindows)[!%]/g, d);

        await new Promise((resolve) => {
            let child = _exec(command, (error, stdout, stderr) => {
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
            child.stdout.on('data', () => { }); child.stderr.on('data', () => { });
        });

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['commandLine'] = commandLine;


