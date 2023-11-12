// let retPromptChrome = await promptChrome({ 'title': `NOME DO COMANDO` })
// console.log(retPromptChrome)

async function promptChrome(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        let title = (inf.title) ? `${inf.title} | Digite o comando:` : `Digite o comando:`;
        if (!`rodar no → NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'notification', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await newDevFun(infDevAndFun); return retDevAndFun
        };
        let retPrompt = prompt(`${title}`);
        if (!retPrompt) {
            ret['msg'] = `\n #### ERRO #### PROMPT CHROME \n EM BRANCO \n\n`
        } else {
            let send = {
                "other": "TryRating_QueryImageDeservingClassification",
                "inf": [retPrompt.split(',').map(Number)], "query": "#####"
            }
            acionarListener(devChrome, send)
            ret['res'] = retPrompt;
            ret['msg'] = 'PROMPT CHROME: OK'
            ret['ret'] = true;
        }
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['promptChrome'] = promptChrome;
    } else { // NODEJS
        global['promptChrome'] = promptChrome;
    }
}