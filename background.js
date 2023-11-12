import('./src/onStart.js');

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

// setTimeout(function () {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.executeScript(tabs[0].id, {
//             // XPATH
//             code: `document.evaluate('//*[@id="app-root"]/div/div[4]/div[2]/div/p/a/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()`
//             // JS PATH
//             // code: `document.querySelector("#app-root > div > div.application-wrapper--content > div.survey-view > div.task-container > div:nth-child(1) > div.editor.mode-live.mode-view > div > div > div > div > div > div > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(3) > div.extra-wrapper > div > div > div > div:nth-child(8) > div > div > div > div.d-flex.justify-content-center.field-array-actions.py-2 > button").click()`
//             // ELEMENT (por '.' nos espaços)   <button class="btn btn-primary">Get a Survey</button>    →    document.querySelector('.btn.btn-primary').click()
//             // code: `document.querySelector('.btn.btn-primary').click()`  
//         })
//     });
// }, 5000);

chrome.browserAction.onClicked.addListener(async function (...inf) { // ######################### CLICK NO ICONE
    console.log('ON START: ICONE PRESSIONADO'); //chrome.browserAction.setPopup({popup: './popup.html'});
});

// NAO POR NADA AQUI!

// ***************** USAR O 'onStart.js' *****************

