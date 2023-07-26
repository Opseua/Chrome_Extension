// await import('./promptChrome.js');
// const retPromptChrome = await promptChrome(`GALAXY`);
// console.log(retPromptChrome)

async function promptChrome(inf) {
    let ret = { 'ret': false }
    try {
        const text = (inf) ? `${inf} | Digite o comando:` : `Digite o comando:`;
        let retPrompt = prompt(`${text}`);
        if (!retPrompt) { return ret }

        ret['ret'] = true;
        ret['msg'] = 'PROMPT CHROME: OK';
        ret['res'] = retPrompt;
    } catch (e) {
        ret['msg'] = `PROMPT CHROME: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { promptChrome }

window['promptChrome'] = promptChrome;
