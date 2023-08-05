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

let infExcel, retExcel

// infExcel = { 'action': 'set', 'tab': 'YARE', 'col': 'A', 'value': `VALOR ${dateHour().res.tim}` }
// retExcel = await excel(infExcel)
// console.log(retExcel)

// await import('./resources/tabSearch.js');
// const infTabSearch = { 'search': '*oneforma*', 'openIfNotExist': false, 'active': true, 'pinned': false, 'url': 'https://www.google.com/' } // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
// const retTabSearch = await tabSearch(infTabSearch)
// console.log(retTabSearch)

// await import('./resources/getPage.js');
// const infGetPage = { 'id': retTabSearch.res.id }
// const retGetPage = await getPage(infGetPage)
// console.log(retGetPage.res)

// const infFileWrite = {
//     'file': `page.txt`,
//     'rewrite': false, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
//     'text': retGetPage.res
// };
// const retFileWrite = await fileWrite(infFileWrite);
// console.log(retFileWrite);

// const infRegex = { 'pattern': 'UM(.*?)TRES#', 'text': `UM
// DOIS
// TRES
// QUATRO
// TRES#` }
const infRegex = { 'simple': true, 'pattern': '*DOIS*', 'text': 'UMDOISTRES' }
const retRegex = regex(infRegex)
console.log(retRegex)
