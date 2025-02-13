// APAGAR TODO O CONTEUDO DO STORAGE
chrome.storage.local.clear(function () {
    // console.log('DEL 1');
});
chrome.storage.sync.clear(function () {
    // console.log('DEL 2');
});

import('../server.js');

chrome.browserAction.onClicked.addListener(async function (...inf) {
    console.log(`EVENTO: click no ícone\n`, inf);
    // chrome.browserAction.setPopup({popup: './popup.html'});
});

// → BACKUP

// EXCLUIR DOWNLOAD DA LISTA SE FOR DO BOT E TIVER '[KEEP]' NO TITULO DO ARQUIVO
// chrome.downloads.onChanged.addListener(async function (...inf) {
//     let { id } = inf; if (inf[0].state && inf[0].state.current === "complete") {
//         chrome.downloads.search({ id }, async function (inf) {
//             if (inf.length > 0) {
//                 let downloadItem = inf[0];
//                 if (downloadItem.byExtensionName === 'BOT') {
//                     console.log(`EVENTO: download do BOT concluído\n`, downloadItem)
//                 }
//             }
//         });
//     }
// });

// chrome.commands.onCommand.addListener(async function (...inf) {
//     console.log(`EVENTO: atalho pressionado\n`, inf)
// });

// chrome.tabs.onActivated.addListener(async function (...inf) {
//   console.log(`EVENTO: guia ativa alterada\n`, inf)
// });

// chrome.notifications.onClicked.addListener(async function (...inf) {
//   console.log(`EVENTO: click na notificação\n`, inf)
// })

// chrome.notifications.onButtonClicked.addListener(async function (...inf) {
//   console.log(`EVENTO: click no botão da notificação\n`, inf)
// });

// chrome.notifications.onClosed.addListener(async function (...inf) {
//   console.log(`EVENTO: notificação fechada\n`, inf)
// });

// chrome.runtime.onMessage.addListener(async function (...inf) {
//   console.log(`EVENTO: mensagem recebida\n`, inf)
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
//     },
//     { urls: ['<all_urls>',], }
// );

chrome.webRequest.onCompleted.addListener(
    async function (...inf) {
        let { requestId, tabId, url, method, } = inf[0];
        if (url.includes('.com/api/survey') || url.includes('.com/api/announcement')) { // .com/api/announcement | .com/api/survey
            console.log(`EVENTO: requisição concluída\n`, requestId, tabId, method, url);

            // commandLine({ 'notBackground': true, 'command': `!fileWindows!/PORTABLE_Clavier/Clavier.exe /sendkeys "${com}"`, });

            let retChromeActions = await chromeActions({ 'action': 'getBody', 'target': `*.com/app/announcemen*`, }); console.log(retChromeActions);

            // let retFile = await file({ 'action': 'write', 'path': 'arquivoNovo.html', 'text': retChromeActions.res, }); console.log(retFile);

            let des = `127.0.0.1:8889/?roo=OPSEUA-NODEJS-WEBSOCKET-SERVER`;
            let msgLis = { 'fun': [{ 'securityPass': gW.securityPass, 'retInf': true, 'name': 'file', 'par': { 'action': 'write', 'path': 'arquivoNovo.html', 'text': 'CASA', }, },], };
            let retMessageSend = await messageSend({ 'destination': des, 'message': msgLis, }); console.log(retMessageSend);

        }
    },
    { urls: ['<all_urls>',], }
);

// NAO POR NADA AQUI!

// ***************** USAR O 'server.js' *****************


