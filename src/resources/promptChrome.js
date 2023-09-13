// const retPromptChrome = await promptChrome(`NOME DO COMANDO`);
// console.log(retPromptChrome)

async function promptChrome(inf) {
    let ret = { 'ret': false }
    try {
        const text = (inf) ? `${inf} | Digite o comando:` : `Digite o comando:`;
        let retPrompt = prompt(`${text}`);
        if (!retPrompt) {
            ret['msg'] = `\n #### ERRO #### PROMPT CHROME \n EM BRANCO \n\n`;
        } else {
            ret['ret'] = true;
            ret['msg'] = 'PROMPT CHROME: OK';
            ret['res'] = retPrompt;
        }
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res })() }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['promptChrome'] = promptChrome;
} else { // NODEJS
    global['promptChrome'] = promptChrome;
}