// APAGAR TODO O CONTEUDO DO STORAGE
chrome.storage.local.clear(function () {
    // console.log('DEL 1');
});
chrome.storage.sync.clear(function () {
    // console.log('DEL 2');
});

import('../server.js');

chrome.browserAction.onClicked.addListener(async function (...inf) {
    console.log(`EVENTO: click no ícone\n`, inf)
    // chrome.browserAction.setPopup({popup: './popup.html'});
});

// → BACKUP

// chrome.tabs.onUpdated.addListener(function (...inf) {
//     [, tabInf, tab] = inf;
//     if (tab.url == 'https://rating.ewoq.google.com/u/0/home' && tabInf.status == 'complete') {
//         console.log(`EVENTO: URL aberto 1\n`, tab)
//     }
// });

// EXCLUIR DOWNLOAD DA LISTA SE FOR DO BOT E TIVER '[KEEP]' NO TITULO DO ARQUIVO
// chrome.downloads.onChanged.addListener(async function (...inf) {
//     if (inf[0].state && inf[0].state.current === "complete") {
//         chrome.downloads.search({ id: inf.id }, async function (inf) {
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

// NAO POR NADA AQUI!

// ***************** USAR O 'server.js' *****************

