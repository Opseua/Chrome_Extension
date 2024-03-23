await import('./resources/@export.js');
let e = import.meta.url, ee = e;


try {
    console.log(aaaaaaa)
} catch (catchErr) {
    let retGetPathNew = await getPathNew({ 'e': catchErr, 'isFunction': false, })
    console.log(retGetPathNew)
}

// // // *************************

// // APAGAR TODO O STORAGE (É APAGADO NO 'background.js')
// // let keys = ['webSocket', 'chatOra.ai', 'chatOpenAi', 'sniffer'];
// // for (let key of keys) { let infConfigStorage = { 'e': e, 'action': 'del', 'key': key }; await configStorage(infConfigStorage) }

// // LIMPAR O BADGE
// chromeActions({ 'e': e, 'action': 'badge', 'text': '' });

// // EXCLUIR DOWNLOAD SE TIVER '[KEEP]' NO TITULO DO ARQUIVO
// chrome.downloads.onChanged.addListener(async function (...inf) {
//     if (inf[0].state && inf[0].state.current === 'complete') {
//         chrome.downloads.search({ id: inf.id }, async function (inf) {
//             if (inf.length > 0) {
//                 let d = inf[0]; if (d.byExtensionName.includes('BOT') && !d.filename.includes('[KEEP]')) {
//                     setTimeout(function () {
//                         chrome.downloads.erase({ id: d.id });
//                         // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `DOWNLOAD REMOVIDO DA LISTA` }); URL.revokeObjectURL(d.url)
//                     }, 5000);
//                 }
//             }
//         });
//     }
// });

// // ATALHO PRESSIONADO
// chrome.commands.onCommand.addListener(async function (...inf) {
//     let ret = { 'ret': false };
//     try {
//         // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `ON START: ATALHO PRESSIONADO` })
//         let infShortcutPressed = { 'shortcut': inf[0] }
//         if (infShortcutPressed.shortcut == 'atalho_1') {
//             command1();
//         } else if (infShortcutPressed.shortcut == 'atalho_2') {
//             command2();
//         } else { ret['msg'] = `\n #### ERRO #### ON START | ACAO DO ATALHO NAO DEFINIDA \n\n` }
//     } catch (catchErr) {
//         let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
//         ret['msg'] = retRegexE.res
//     };
//     return {
//         ...({ ret: ret.ret }),
//         ...(ret.msg && { msg: ret.msg }),
//         ...(ret.res && { res: ret.res }),
//     };
// });

// // *************************

// // MANTER NO FINAL PARA GARANTIR QUE O ATALHO VAI FUNCIONAR ANTES DO WEBSOCKET SER CONECTADO
// // client({ 'e': e })

