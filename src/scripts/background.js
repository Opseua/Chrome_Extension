// APAGAR TODO O CONTEUDO DO STORAGE
chrome.storage.local.clear(function () { /* console.log('DEL 1'); */ }); chrome.storage.sync.clear(function () { /* console.log('DEL 2'); */ });

import('../server.js'); // NÃO POR COMO await!!!

chrome.browserAction.onClicked.addListener(async function (...inf) {
    console.log(`EVENTO: click no ícone\n`, inf); // chrome.browserAction.setPopup({popup: './popup.html'});
});

// → BACKUP
chrome.downloads.onChanged.addListener(async function (...inf) {
    let { id, } = inf; if (inf[0].state && inf[0].state.current === 'complete') {
        chrome.downloads.search({ id, }, async function (txt) {
            if (txt.length > 0) {
                let d = inf[0]; if (d.byExtensionName && d.byExtensionName.includes('BOT')) {
                    /* console.log(`EVENTO: download do BOT concluído\n`, downloadItem) */ if (!d.filename.includes('[KEEP]')) {
                        setTimeout(function () { chrome.downloads.erase({ id: d.id, }); /* logConsole({ e, ee, 'txt': `DOWNLOAD REMOVIDO DA LISTA` }); URL.revokeObjectURL(d.url) */ }, 5000);
                    }
                }
            }
        });
    }
});

// FECHAR ABA DESNECESSÁRIA
chrome.tabs.onUpdated.addListener(function (...inf) {
    let { id, url, } = inf[2]; if (url.includes('.msftconnecttest.com') || url.includes('.netcombowifi.com')) {
        setTimeout(() => { chrome.tabs.remove(id, () => { if (chrome.runtime.lastError) { } }); }, (30 * 1000));
    }
});

// chrome.commands.onCommand.addListener(async function (...inf) {
//     console.log(`EVENTO: atalho pressionado\n`, inf);
// });

// chrome.tabs.onActivated.addListener(async function (...inf) {
//     console.log(`EVENTO: guia ativa alterada\n`, inf);
// });

// chrome.notifications.onClicked.addListener(async function (...inf) {
//     console.log(`EVENTO: click na notificação\n`, inf);
// });

// chrome.notifications.onButtonClicked.addListener(async function (...inf) {
//     console.log(`EVENTO: click no botão da notificação\n`, inf);
// });

// chrome.notifications.onClosed.addListener(async function (...inf) {
//     console.log(`EVENTO: notificação fechada\n`, inf);
// });

// chrome.runtime.onMessage.addListener(async function (...inf) {
//     console.log(`EVENTO: mensagem recebida\n`, inf);
// });

// chrome.tabs.onUpdated.addListener(function (...inf) {
//     let { active, id, index, pinned, selected, status, title, url, } = inf[2];
//     if (url.includes('www.google.com') && status === 'complete') {
//         console.log(`EVENTO: URL aberto e 100% carregado na aba\n`, id);
//     }
// });

// chrome.webRequest.onBeforeRequest.addListener(
//     async function (...inf) {
//         let { requestId, tabId, url, method, } = inf[0];
//         if (url.includes('.com/api/survey')) { // .com/api/announcement | .com/api/survey
//             console.log(`EVENTO: requisição iniciada\n`, requestId, tabId, method, url);
//         }
//     }, { urls: ['<all_urls>',], }
// );

// chrome.webRequest.onCompleted.addListener(
//     async function (...inf) {
//         let { requestId, tabId, url, method, } = inf[0];
//         if (url.includes('.com/api/survey') || url.includes('.com/api/announcement')) { // .com/api/announcement | .com/api/survey
//             console.log(`EVENTO: requisição concluída\n`, requestId, tabId, method, url);

//             // commandLine({ 'notBackground': true, 'command': `!fileWindows!/PORTABLE_Clavier/Clavier.exe /sendkeys "${com}"`, });
//             let retChromeActions = await chromeActions({ 'action': 'getBody', 'target': `*.com/app/announcemen*`, }); console.log(retChromeActions);
//             // let retFile = await file({ 'action': 'write', 'path': 'arquivoNovo.html', 'text': retChromeActions.res, }); console.log(retFile);
//             let msgLis = { 'fun': [{ 'securityPass': gW.securityPass, 'retInf': true, 'name': 'file', 'par': { 'action': 'write', 'path': 'arquivoNovo.html', 'text': 'CASA', }, },], };
//             let retMessageSend = await messageSend({ 'destination': `127.0.0.1:1234/?roo=SALA`, 'message': msgLis, }); console.log(retMessageSend);
//         }
//     }, { urls: ['<all_urls>',], }
// );

// NAO POR NADA AQUI!

// ***************** USAR O 'server.js' *****************


