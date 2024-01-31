await import('./resources/@export.js');
let e = import.meta.url;

// *************************
let keys = ['webSocket', 'chatGptOra.aiAAAAA', 'chatGptOpenAi', 'sniffer'];
for (let key of keys) { let infConfigStorage = { 'e': e, 'action': 'del', 'key': key }; configStorage(infConfigStorage) }
chromeActions({ 'e': e, 'action': 'badge', 'text': '' });
chrome.downloads.onChanged.addListener(async function (...inf) { // EXCLUIR DOWNLOAD SE TIVER '[KEEP]' NO TITULO DO ARQUIVO
    if (inf[0].state && inf[0].state.current === 'complete') {
        chrome.downloads.search({ id: inf.id }, async function (inf) {
            if (inf.length > 0) {
                let d = inf[0]; if (d.byExtensionName === 'BOT' && !d.filename.includes('[KEEP]')) {
                    setTimeout(function () {
                        chrome.downloads.erase({ id: d.id });
                        logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `DOWNLOAD REMOVIDO DA LISTA` }); URL.revokeObjectURL(d.url)
                    }, 5000);
                }
            }
        });
    }
});
chrome.commands.onCommand.addListener(async function (...inf) { // ######################### ATALHO PRESSIONADO
    let ret = { 'ret': false };
    try {
        let infShortcutPressed = { 'shortcut': inf[0] } //console.log('ON START: ATALHO PRESSIONADO')
        if (infShortcutPressed.shortcut == 'atalho_1') {
            command1();
        } else if (infShortcutPressed.shortcut == 'atalho_2') {
            command2();
        } else { ret['msg'] = `\n #### ERRO #### ON START | ACAO DO ATALHO NAO DEFINIDA \n\n` }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
});
// *************************


await new Promise(resolve => { setTimeout(resolve, 3000) })

// MANTER NO FINAL PARA GARANTIR QUE O ATALHO VAI FUNCIONAR ANTES DO WEBSOCKET SER CONECTADO
client({ 'e': e })