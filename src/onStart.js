await import('./resources/clearConsole.js');
console.log('onStart');
chrome.browserAction.setBadgeText({ text: '' });
await import('./resources/functions.js');
await import('./actions/shortcutPressed.js');
await import('./resources/websocketRet.js');
await import('./scripts/oneFormaMTPE.js');
await import('./scripts/peroptyx.js');

// EXCLUIR DOWNLOAD DA LISTA SE FOR DO BOT E TIVER '[KEEP]' NO TITULO DO ARQUIVO
chrome.downloads.onChanged.addListener(async function (...inf) {
    if (inf[0].state && inf[0].state.current === "complete") {
        chrome.downloads.search({ id: inf.id }, async function (inf) {
            if (inf.length > 0) {
                const downloadItem = inf[0];
                if (downloadItem.byExtensionName === 'BOT' && !downloadItem.filename.includes('[KEEP]')) {
                    // console.log(`EVENTO: download do BOT concluído\n`, downloadItem)
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
    console.log('ON START: ICONE PRESSIONADO');
    //chrome.browserAction.setPopup({popup: "./popup.html"});
});

// ######################### ATALHO PRESSIONADO
chrome.commands.onCommand.addListener(async function (...inf) {
    //console.log('ON START: ATALHO PRESSIONADO')
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
        if (typeof window !== 'undefined') { // CHROME
            WebS = window.WebSocket;
        } else { // NODEJS
            const { default: WebSocket } = await import('isomorphic-ws'); WebS = WebSocket;
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
            ws1.onopen = () => { console.log(`ON START: CONEXAO OK - WS1`) };
            ws1.onclose = async (event) => {
                console.log(`ON START: RECONEXAO EM 10 SEGUNDOS - WS1`);
                await new Promise(r => setTimeout(r, 10000)); web1()
            }
            ws1.onmessage = async (event) => {
                let data, fun
                try {
                    data = JSON.parse(event.data);
                    if (data.fun) { fun = true }
                } catch (e) { }
                if (fun) {
                    const infWebsocketRet = { 'data': event.data }
                    const retWebsocketRet = websocketRet(infWebsocketRet)
                } else {
                    console.log(`MENSAGEM DO WEBSCKET\n\n${event.data}\n\n`)
                }
            }
        }
        web1()

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }
}
client()

