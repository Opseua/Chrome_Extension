function startupFun(b, c) { let a = c - b; let s = Math.floor(a / 1000); let m = a % 1000; let f = m.toString().padStart(3, '0'); return `${s}.${f}` }; let startup = new Date();
await import('./resources/@export.js');

let e = import.meta.url, ee = e;
async function serverRun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `**************** SERVER **************** [${startupFun(startup, new Date())}]` })

        // LIMPAR O BADGE
        chromeActions({ 'e': e, 'action': 'badge', 'text': '' });

        // EXCLUIR DOWNLOAD SE TIVER '[KEEP]' NO TITULO DO ARQUIVO
        chrome.downloads.onChanged.addListener(async function (...inf) {
            if (inf[0].state && inf[0].state.current === 'complete') {
                chrome.downloads.search({ id: inf.id }, async function (inf) {
                    if (inf.length > 0) {
                        let d = inf[0]; if (d.byExtensionName && d.byExtensionName.includes('BOT') && !d.filename.includes('[KEEP]')) {
                            setTimeout(function () {
                                chrome.downloads.erase({ id: d.id });
                                // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `DOWNLOAD REMOVIDO DA LISTA` }); URL.revokeObjectURL(d.url)
                            }, 5000);
                        }
                    }
                });
            }
        });

        // ATALHO PRESSIONADO
        chrome.commands.onCommand.addListener(async function (...inf) {
            try {
                let infShortcutPressed = { 'shortcut': inf[0] }; // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ON START: ATALHO PRESSIONADO` })
                if (infShortcutPressed.shortcut == 'atalho_1') { command1(); }
                else if (infShortcutPressed.shortcut == 'atalho_2') { command2(); }
                else { logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ACAO DO ATALHO NAO DEFINIDA` }) }
            } catch (catchErr) {
                await regexE({ 'inf': inf, 'e': catchErr, });
            };
        });

        // *************************

        // CLIENT (NÃO POR COMO 'await'!!!) | MANTER NO FINAL
        client({ 'e': e });

        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

        // let infTryRatingComplete, retTryRatingComplete
        // infTryRatingComplete = { 'e': e, 'urlGoogleMaps': 'https://maps.app.goo.gl/' }
        // retTryRatingComplete = await tryRatingComplete(infTryRatingComplete); console.log(retTryRatingComplete)


        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': 'INICIO' })
        let infChat, retChat
        infChat = { 'e': e, 'provider': 'gitHub', 'input': `Qual a idade de Júpiter?` };
        retChat = await chat(infChat); logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': JSON.stringify(retChat, null, 2) })




    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun()


