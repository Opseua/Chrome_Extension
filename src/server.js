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

        // MANTER NO FINAL PARA GARANTIR QUE O ATALHO VAI FUNCIONAR ANTES DO WEBSOCKET SER CONECTADO | CLIENT (NÃO POR COMO 'await'!!!)
        client({ 'e': e }); await new Promise(resolve => { setTimeout(resolve, 2000) })

        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

        // let infCompleteJudge, retCompleteJudge // 'logFun': true,
        // infCompleteJudge = { 'e': e, 'urlGoogleMaps': 'https://maps.app.goo.gl/' }
        // retCompleteJudge = await completeJudge(infCompleteJudge)
        // console.log(JSON.stringify(retCompleteJudge, null, 2))

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


