// const infCommandLine = { 'command': 'notepad' }
// const retCommandLine = await commandLine(infCommandLine)
// console.log(retCommandLine)

let run
if (typeof window == 'undefined') { const { exec } = await import('child_process'); run = exec }

async function commandLine(inf) {
    let ret = { 'ret': false };
    let command = `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/1_BACKGROUND.exe" ${inf.command}`;
    const retorno = new Promise((resolve, reject) => {
        run(command, { maxBuffer: 1024 * 5000 }, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve('COMMAND LINE: OK')
            }
        });
    });
    return retorno
        .then((result) => {
            ret['ret'] = true;
            ret['msg'] = `${result}`;
            return ret;
        })
        .catch((e) => {
            (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res })()
            console.log(ret.msg);
            return ret;
        });
}

if (typeof window !== 'undefined') { // CHROME
    window['commandLine'] = commandLine;
} else { // NODEJS
    global['commandLine'] = commandLine;
}

