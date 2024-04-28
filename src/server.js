await import('./resources/@export.js');

let e = import.meta.url, ee = e;
async function serverRun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `**************** SERVER ****************` })

        // LIMPAR O BADGE
        chromeActions({ 'e': e, 'action': 'badge', 'text': '' });

        // EXCLUIR DOWNLOAD SE TIVER '[KEEP]' NO TITULO DO ARQUIVO
        chrome.downloads.onChanged.addListener(async function (...inf) {
            if (inf[0].state && inf[0].state.current === 'complete') {
                chrome.downloads.search({ id: inf.id }, async function (inf) {
                    if (inf.length > 0) {
                        let d = inf[0]; if (d.byExtensionName.includes('BOT') && !d.filename.includes('[KEEP]')) {
                            setTimeout(function () {
                                chrome.downloads.erase({ id: d.id });
                                // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `DOWNLOAD REMOVIDO DA LISTA` }); URL.revokeObjectURL(d.url)
                            }, 5000);
                        }
                    }
                });
            }
        });

        // ATALHO PRESSIONADO
        chrome.commands.onCommand.addListener(async function (...inf) {
            try {
                let infShortcutPressed = { 'shortcut': inf[0] }; // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `ON START: ATALHO PRESSIONADO` })
                if (infShortcutPressed.shortcut == 'atalho_1') { command1(); }
                else if (infShortcutPressed.shortcut == 'atalho_2') { command2(); }
                else { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `ACAO DO ATALHO NAO DEFINIDA` }) }
            } catch (catchErr) {
                await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
            };
        });

        // *************************

        // MANTER NO FINAL PARA GARANTIR QUE O ATALHO VAI FUNCIONAR ANTES DO WEBSOCKET SER CONECTADO
        // CLIENT (NÃO POR COMO 'await'!!!)
        client({ 'e': e })

        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

        // let retCompleteJudge = await completeJudge({ 'e': e, 'hitApp': 'POI_Evaluation' })
        // console.log(retCompleteJudge.res)

        // let infChromeActions, retChromeActions // 'logFun': true,
        // infChromeActions = { 'e': e, 'action': 'getBody', 'tabTarget': `*tryrating*` }
        // retChromeActions = await chromeActions(infChromeActions); let body = retChromeActions.res

        // let infRegex, retRegex
        // retRegex = regex({ 'e': e, 'pattern': `textarea name="(.*?)" type="text" rows="`, 'text': body });
        // console.log(retRegex)
        // // field-sJ5TlHZLBX

        // // PEGAR O ID DO CAMPO // →→→   <label for="field-oiaYE9zikt" class="field-label">Name Correction *</label>        
        // infChromeActions = { 'e': e, 'action': 'elementGetId', 'body': body, 'nameClass': 'field-label', 'nameLabel': 'Comments' }
        // // infChromeActions = { 'e': e, 'action': 'elementGetValue1', 'body': body, 'method': 'xpath', 'element': `//*[@id="endereco"]` }
        // // infChromeActions = { 'e': e, 'action': 'elementGetValue2', 'tabTarget': `*buscacepinter*`, 'method': 'xpath', 'element': `//*[@id="endereco"]` }
        // infChromeActions = { 'e': e, 'action': 'elementSet', 'tabTarget': `*tryrating*`, 'method': 'xpath', 'element': `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div/div/div/div/div[3]/div[1]/div[1]/div[2]/div/div/div/div/div/div/div/div[19]/div/div/div/div/div/div/div/div/div/div/div/form/div/div/textarea`, 'value': `22021-001` }
        // // infChromeActions = { 'e': e, 'action': 'elementClick', 'tabTarget': `*buscacepinter*`, 'method': 'xpath', 'element': `//*[@id="btn_pesquisar"]` }
        // retChromeActions = await chromeActions(infChromeActions);
        // console.log(retChromeActions)

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun()


