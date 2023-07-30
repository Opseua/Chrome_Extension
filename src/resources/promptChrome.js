// await import('./promptChrome.js');
// const retPromptChrome = await promptChrome(`NOME DO COMANDO`);
// console.log(retPromptChrome)

await import('./functions.js');

async function promptChrome(inf) {
    let ret = { 'ret': false }
    try {
        const text = (inf) ? `${inf} | Digite o comando:` : `Digite o comando:`;
        let retPrompt = prompt(`${text}`);
        if (!retPrompt) {
           // ret['msg'] = 'PROMPT CHROME: ERRO | EM BRANCO';
            ret['msg'] = `\n #### ERRO ####  PROMPT CHROME \n EM BRANCO \n\n`;
        } else {
            ret['ret'] = true;
            ret['msg'] = 'PROMPT CHROME: OK';
            ret['res'] = retPrompt;
        }

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

// export { promptChrome }

window['promptChrome'] = promptChrome;
