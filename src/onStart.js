await import('./resources/clearConsole.js');
console.log('onStart');
await import('./resources/functions.js');
await import('./actions/shortcutPressed.js');
await import('./resources/excel.js');
await import('./resources/websocketRet.js');

// EXCLUIR DOWNLOAD DA LISTA SE FOR DO NTFY E TIVER '[KEEP]' NO TITULO DO ARQUIVO
chrome.downloads.onChanged.addListener(async function (...inf) {
    if (inf[0].state && inf[0].state.current === "complete") {
        chrome.downloads.search({ id: inf.id }, async function (inf) {
            if (inf.length > 0) {
                const downloadItem = inf[0];
                if (downloadItem.byExtensionName === 'NTFY' && !downloadItem.filename.includes('[KEEP]')) {
                    // console.log(`EVENTO: download do NTFY concluído\n`, downloadItem)
                    setTimeout(function () {
                        chrome.downloads.erase({ id: downloadItem.id });
                        console.log('DOWNLOAD REMOVIDO DA LISTA');
                        URL.revokeObjectURL(downloadItem.url);
                    }, 5000);
                }
            }
        });
    }
});

// ######################### CLICK NO ICONE
chrome.browserAction.onClicked.addListener(async function (...inf) {
    console.log('BACKGROUND: ICONE PRESSIONADO');
});

// ######################### ATALHO PRESSIONADO
chrome.commands.onCommand.addListener(async function (...inf) {
    //console.log('BACKGROUND: ATALHO PRESSIONADO')
    const infShortcutPressed = {
        'shortcut': inf[0]
    }
    shortcutPressed(infShortcutPressed);
});

// *************************

async function client(inf) {
    let ret = { 'ret': false };
    try {
        let WebS;
        const retNodeOrBrowser = await nodeOrBrowser();
        if (retNodeOrBrowser.res == 'node') { // NODEJS
            const { default: WebSocket } = await import('isomorphic-ws'); WebS = WebSocket;
        } else if (retNodeOrBrowser.res == 'chrome') { // CHROME
            WebS = window.WebSocket;
        }
        const infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'websocket' }
        const retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) {
            return ret
        }
        const port = retConfigStorage.res.port;
        const device1 = retConfigStorage.res.device1.name
        const securityPass = retConfigStorage.res.securityPass

        let ws1;
        async function web1() {
            let ws1 = new WebS(`${retConfigStorage.res.ws2}:${port}/${device1}`);
            ws1.onerror = (e) => { };
            ws1.onopen = () => { console.log(`BACKGROUND: CONEXAO OK - WS1`) };
            ws1.onclose = async (event) => {
                console.log(`BACKGROUND: RECONEXAO EM 10 SEGUNDOS - WS1`);
                await new Promise(r => setTimeout(r, 10000)); web1()
            }
            ws1.onmessage = async (event) => {
                let data, fun
                try {
                    data = JSON.parse(event.data);
                    if (data.hasOwnProperty('funRun')) { fun = true }
                } catch (e) { }
                if (fun) {
                    const infWebsocketRet = { 'data': event.data }
                    const retWebsocketRet = websocketRet(infWebsocketRet)
                } else {
                    console.log(`MENSAGEM DO WEBSCKET\n\n${event.data}`)
                }
            }
        }
        web1()

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }
}
client()


await import('./scripts/oneFormaMTPE.js');
oneFormaMTPE()
// await import('./resources/sniffer.js');
// await import('./resources/clipboard.js');
// await import('./resources/notification.js');
// await import('./resources/chatGpt.js');
// let infRegex1, infRegex2, retRegex1, retRegex2, infSniffer, retSniffer, infNotification, retNotification, infChatGpt, retChatGpt, infClipboard, retClipboard
// async function aaaaa() {
//     infSniffer = { 'arrUrl': ['https://desk.oneforma.com/scribo_apps/MTPE_new_process/postediting.php?flogin=2*'] }
//     retSniffer = await sniffer(infSniffer)
//     //console.log(retSniffer)

//     infRegex1 = { 'simple': true, 'pattern': '<p class="source_text"(.*?)/p>', 'text': retSniffer.res }
//     retRegex1 = regex(infRegex1)

//     infRegex2 = { 'simple': true, 'pattern': 'mt_textbox" dir class="form-control"(.*?)/textarea>', 'text': retSniffer.res }
//     retRegex2 = regex(infRegex2)

//     if (retRegex1.ret && retRegex1.res.text.split('<').length - 1 == 1 && retRegex1.res.text.split('>').length - 1 == 1 && retRegex2.ret && retRegex2.res.text.split('<').length - 1 == 1 && retRegex2.res.text.split('>').length - 1 == 1) {

//         infRegex1 = { 'simple': true, 'pattern': '>(.*?)<', 'text': retRegex1.res.text }
//         retRegex1 = regex(infRegex1)

//         infRegex2 = { 'simple': true, 'pattern': '>(.*?)<', 'text': retRegex2.res.text }
//         retRegex2 = regex(infRegex2)

//         infNotification =
//         {
//             'duration': 2,
//             'type': 'basic',
//             'title': `AGUARDE...`,
//             'message': `Mudando o texto`,
//             'iconUrl': null,
//             'buttons': [],
//         };
//         retNotification = await notification(infNotification)


//         infChatGpt = { 'provider': 'ora.ai', 'input': `REWRITE THIS SENTENCE IN ANOTHER WAY, KEEPING IT AS SIMILAR AS POSSIBLE AND WITH THE SAME NUMBER OF WORDS POSSIBLE, AND KEEPING CAPITAL LETTERS ACCORDING TO THE ORIGINAL TEXT\n\n${retRegex2.res.text}` }
//         retChatGpt = await chatGpt(infChatGpt)
//         //console.log('AQUI', retChatGpt.res)

//         infClipboard = { 'value': retChatGpt.res };
//         retClipboard = await clipboard(infClipboard)

//         if (retRegex2.res.text == retChatGpt.res) {
//             infNotification =
//             {
//                 'duration': 2,
//                 'type': 'basic',
//                 'title': `🟡 PULAR 🟡`,
//                 'message': `Mesmo texto`,
//                 'iconUrl': null,
//                 'buttons': [],
//             };
//             retNotification = await notification(infNotification)
//         } else {
//             infNotification =
//             {
//                 'duration': 8,
//                 'type': 'basic',
//                 'title': `🟢 CONCLUÍDO 🟢`,
//                 'message': `pt → ${retRegex1.res.text}\nen → ${retRegex2.res.text}\n🔵 ${retChatGpt.res}`,
//                 'iconUrl': null,
//                 'buttons': [],
//             };
//             retNotification = await notification(infNotification)
//         }



//         aaaaa()
//     } else {
//         //console.log(false)
//         infNotification =
//         {
//             'duration': 1,
//             'type': 'basic',
//             'title': `🔴 PULAR 🔴`,
//             'message': `Erro ao alterar texto`,
//             'iconUrl': null,
//             'buttons': [],
//         };
//         retNotification = await notification(infNotification)
//     }
// }
// //aaaaa()

