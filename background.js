import('./src/onStart.js');


// EXCLUIR DOWNLOAD DA LISTA SE FOR DO BOT E TIVER '[KEEP]' NO TITULO DO ARQUIVO
// chrome.downloads.onChanged.addListener(async function (...inf) {
//     if (inf[0].state && inf[0].state.current === "complete") {
//         chrome.downloads.search({ id: inf.id }, async function (inf) {
//             if (inf.length > 0) {
//                 const downloadItem = inf[0];
//                 if (downloadItem.byExtensionName === 'BOT') {
//                     console.log(`EVENTO: download do BOT concluído\n`, downloadItem)
//                 }
//             }
//         });
//     }
// });

// chrome.browserAction.onClicked.addListener(async function (...inf) {
//   console.log(`EVENTO: click no ícone\n`, inf)
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

// ***************** USAR O 'onStart.js' *****************


chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log("Received %o from %o, frame", msg, sender.tab, sender.frameId);
    sendResponse("Gotcha!");
});


