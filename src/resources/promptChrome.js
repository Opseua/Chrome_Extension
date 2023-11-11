// const retPromptChrome = await promptChrome({ 'title': `NOME DO COMANDO` })
// console.log(retPromptChrome)

async function promptChrome(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        const title = (inf.title) ? `${inf.title} | Digite o comando:` : `Digite o comando:`;
        if (!dev) { // [ENCAMINHAR PARA DEVICE → CHROME]
            const infDevAndFun = { 'name': 'promptChrome', 'retInf': inf.retInf, 'par': { 'title': inf.title } }
            const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
        };
        let retPrompt = prompt(`${title}`); if (!retPrompt) { ret['msg'] = `\n #### ERRO #### PROMPT CHROME \n EM BRANCO \n\n` } else {

            const send = {
                "other": "TryRating_QueryImageDeservingClassification",
                "inf": [retPrompt.split(',').map(Number)], "query": "#####"
            }
            acionarListener(devChrome, send)

            ret['res'] = retPrompt; ret['ret'] = true; ret['msg'] = 'PROMPT CHROME: OK'
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (dev) { // CHROME
    window['promptChrome'] = promptChrome;
} else { // NODEJS
    global['promptChrome'] = promptChrome;
}
