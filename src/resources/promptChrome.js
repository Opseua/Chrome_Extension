// let infPromptChrome, retPromptChrome // 'logFun': true,
// infPromptChrome = { 'e': e, 'title': `NOME DO COMANDO` }
// retPromptChrome = await promptChrome(infPromptChrome)
// console.log(retPromptChrome)

let e = import.meta.url, ee = e
async function promptChrome(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let title = (inf.title) ? `${inf.title} | Digite o comando:` : `Digite o comando:`;
        if (!`rodar no → CHROME`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'e': e, 'enc': true, 'data': { 'name': 'promptChrome', 'par': inf, 'retInf': inf.retInf } };
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
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `ADICIONAR AÇÃO\n${send}` })
            ret['res'] = retPrompt;
            ret['msg'] = 'PROMPT CHROME: OK'
            ret['ret'] = true;
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (err) {
        let retRegexE = await regexE({ 'inf': inf, 'e': err, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['promptChrome'] = promptChrome;
} else { // NODEJS
    global['promptChrome'] = promptChrome;
}
