// const infCommandLine = { 'background': true, 'command': 'notepad' } // 'background' 'false' → CODIGO FICA PRESO ATE TERMINAR O PROCESSO 
// const retCommandLine = await commandLine(infCommandLine)
// console.log(retCommandLine)

let run
if (typeof window == 'undefined') {
    const { exec } = await import('child_process');
    run = exec;
}

async function commandLine(inf) {
    let ret = { 'ret': false };

    let command;
    if (inf.background) {
        command = `"${letter}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/4_BACKGROUND.exe" ${inf.command}`;
    } else {
        command = `${inf.command}`;
    }
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
            ret['msg'] = `\n #### ERRO #### COMMAND LINE \n ${e} \n\n`;
            console.log(ret.msg);
            return ret;
        });
}

if (typeof window !== 'undefined') { // CHROME
    window['commandLine'] = commandLine;
} else { // NODEJS
    global['commandLine'] = commandLine;
}

