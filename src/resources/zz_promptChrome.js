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

            const infApi = {
                'method': 'POST', 'url': `http://18.119.140.20:8888/OPSEUA_CHROME/`,
                'headers': { 'accept-language': 'application/json' },
                'body': { "other": "peroptyx_QueryImageDeservingClassification", "inf": [retPrompt.split(',').map(Number)], "query": "#####" }
            }; const retApi = await api(infApi);

        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['promptChrome'] = promptChrome;
} else { // NODEJS
    // global['promptChrome'] = promptChrome;
}