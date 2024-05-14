await import('./resources/@export.js');

let e = import.meta.url, ee = e;
async function serverRun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
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
                await regexE({ 'inf': inf, 'e': catchErr, });
            };
        });

        // *************************

        // MANTER NO FINAL PARA GARANTIR QUE O ATALHO VAI FUNCIONAR ANTES DO WEBSOCKET SER CONECTADO | CLIENT (NÃO POR COMO 'await'!!!)
        client({ 'e': e }); await new Promise(resolve => { setTimeout(resolve, 2000) })

        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

        // let infJudgeComplete, retJudgeComplete
        // infJudgeComplete = { 'e': e, 'urlGoogleMaps': 'https://maps.app.goo.gl/' }
        // retJudgeComplete = await judgeComplete(infJudgeComplete); console.log(retJudgeComplete)

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
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


