import('./src/onStart.js');

// EXCLUIR DOWNLOAD DA LISTA SE FOR DO NTFY E TIVER '[KEEP]' NO TITULO DO ARQUIVO
// chrome.downloads.onChanged.addListener(function (inf) {
//     if (inf.state && inf.state.current === "complete") {
//         chrome.downloads.search({ id: inf.id }, async function (inf) {
//             if (inf.length > 0) {
//                 const downloadItem = inf[0];
//                 if (downloadItem.byExtensionName === 'NTFY' && !downloadItem.filename.includes('[KEEP]')) {
//                     // console.log(`EVENTO: download do NTFY concluído\n`, downloadItem)
//                     setTimeout(function () {
//                         chrome.downloads.erase({ id: downloadItem.id });
//                         console.log('DOWNLOAD REMOVIDO DA LISTA');
//                         URL.revokeObjectURL(downloadItem.url);
//                     }, 5000);
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

