await import('./clearConsole.js');
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
        const device = retConfigStorage.res.device1
        const securityPass = retConfigStorage.res.securityPass

        let ws1;
        async function web1() {
            ws1 = new WebS(`${retConfigStorage.res.ws2}:${port}/${device}`);
            ws1.onerror = (e) => { };
            ws1.onopen = () => { console.log(`BACKGROUND: CONEXAO ESTABELECIDA - WS1`) };
            ws1.onclose = async (event) => {
                console.log(`BACKGROUND: RECONEXAO EM 30 SEGUNDOS - WS1`);
                await new Promise(r => setTimeout(r, 30000)); web1()
            }
            ws1.onmessage = async (event) => {
                let data, fun
                try {
                    data = JSON.parse(event.data);
                    if (data.hasOwnProperty('funRun')) { fun = true }
                } catch (e) { data = event.data }
                if (fun) {
                    const infWebsocketRet = { 'data': event.data }
                    const retWebsocketRet = websocketRet(infWebsocketRet)
                } else {
                    console.log(data)
                }
            }
        }
        web1()

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }
}
client()

// let infExcel, retExcel, lin // CQPT    KQRE
// infExcel = { 'action': 'get', 'tab': 'KQRE', 'col': 'A', 'lin': 1 }
// retExcel = await excel(infExcel)
// lin = retExcel.res
// console.log(retExcel)

// const loop = 5;
// let i = 0;
// async function runLoop() {
//     while (i < loop) {
//         i++;

//         infExcel = { 'action': 'set', 'tab': 'KQRE', 'col': 'A', 'lin': lin, 'value': `A ${ lin } B` }
//         retExcel = await excel(infExcel)
//         console.log(retExcel)
//         if (!retExcel.ret) {
//             break
//         }
//         lin++

//         const infRandom = { 'min': 1, 'max': 1, 'await': true }
//         //const retRandom = await random(infRandom)
//     }
//     console.log('Loop concluído!');
// }
// runLoop();



