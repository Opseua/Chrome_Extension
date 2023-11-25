// let infPromptChrome, retPromptChrome
// infPromptChrome = { 'title': `NOME DO COMANDO` }
// retPromptChrome = await promptChrome(infPromptChrome)
// console.log(retPromptChrome)

async function promptChrome(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        let title = (inf.title) ? `${inf.title} | Digite o comando:` : `Digite o comando:`;
        if (!`rodar no → CHROME`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'promptChrome', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };
        let retPrompt = prompt(`${title}`);
        if (!retPrompt) {
            ret['msg'] = `\n #### ERRO #### PROMPT CHROME \n EM BRANCO \n\n`
        } else {
            let send = {
                "other": "TryRating_QueryImageDeservingClassification",
                "inf": [retPrompt.split(',').map(Number)], "query": "#####"
            }
            acionarListener(devChromeWeb, send)
            ret['res'] = retPrompt;
            ret['msg'] = 'PROMPT CHROME: OK'
            ret['ret'] = true;
        }
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return {
        ...(ret.ret && { ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['promptChrome'] = promptChrome;
    } else { // NODEJS
        global['promptChrome'] = promptChrome;
    }
}