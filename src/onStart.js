await import('./resources/@functions.js');
console.log('onStart');

if (typeof window !== 'undefined') { // CHROME
    await chromeActions({ 'action': 'badge', 'inf': { 'text': '' } })
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
        let ret = { 'ret': false };
        try {
            //console.log('ON START: ATALHO PRESSIONADO')
            const infShortcutPressed = { 'shortcut': inf[0] }
            if (infShortcutPressed.shortcut == 'atalho_1') {
                command1()
                ret['ret'] = true;
                ret['msg'] = `SHORTCUT PRESSED: OK`;
            } else if (infShortcutPressed.shortcut == 'atalho_2') {
                const infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'webSocket' }
                const retConfigStorage = await configStorage(infConfigStorage)
                if (!retConfigStorage.ret) {
                    return ret
                }
                const wsHost = retConfigStorage.res.ws1
                const portWebSocket = retConfigStorage.res.portWebSocket;
                const device1 = retConfigStorage.res.device1.name
                const device2 = retConfigStorage.res.device2.name
                const securityPass = retConfigStorage.res.securityPass
                const infNotification =
                {
                    'duration': 4,
                    'type': 'basic',
                    'title': `AGUARDE...`,
                    'message': `Alternando sniffer`,
                    'iconUrl': "./src/media/icon_3.png",
                    'buttons': [],
                };
                const retNotification = await notification(infNotification)
                const par = '\"D:\\ARQUIVOS\\WINDOWS\\PORTABLE_NodeJS\\nodeSniffer.exe\" \"D:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\sniffer.js\"'
                const infApi = {
                    url: `http://${wsHost}:${portWebSocket}/${device2}`,
                    method: 'POST', headers: { 'accept-language': 'application/json' },
                    body: {
                        "fun": {
                            "securityPass": securityPass, "funRet": { "ret": false, },
                            "funRun": { "name": "commandLine", "par": { "background": false, "command": par } }
                        }
                    }
                };
                const retApi = await api(infApi);
                if (!gO.inf.sniffer) {
                    // const infNotification =
                    // {
                    //     'duration': 2,
                    //     'type': 'basic',
                    //     'title': `RODANDO`,
                    //     'message': `OneForma | Peroptyx`,
                    //     'iconUrl': "./src/media/icon_3.png",
                    //     'buttons': [],
                    // };
                    // const retNotification = await notification(infNotification)
                    // command2();
                    // gO.inf = { 'sniffer': 1 }
                } else {
                    //gO.inf = { 'sniffer': 2 }
                    // const infNotification =
                    // {
                    //     'duration': 2,
                    //     'type': 'basic',
                    //     'title': `PAROU`,
                    //     'message': `OneForma | Peroptyx`,
                    //     'iconUrl': "./src/media/icon_3.png",
                    //     'buttons': [],
                    // };
                    // const retNotification = await notification(infNotification)
                    // gO.inf = { 'sniffer': 0 }
                }
                ret['ret'] = true;
                ret['msg'] = `SHORTCUT PRESSED: OK`;
            } else if (infShortcutPressed.shortcut == 'atalho_3') {
                command3()
                ret['ret'] = true;
                ret['msg'] = `SHORTCUT PRESSED: OK`;
            } else {
                ret['msg'] = `\n #### ERRO #### ON START | ACAO DO ATALHO NAO DEFINIDA \n\n`;
            }
        } catch (e) {
            ret['msg'] = regexE({ 'e': e }).res
        }

        if (!ret.ret) { console.log(ret.msg) }
        return ret
    });
}

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

        const infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'webSocket' }
        const retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) {
            return ret
        }
        const wsHost = retConfigStorage.res.ws1
        const portWebSocket = retConfigStorage.res.portWebSocket;
        const device1 = retConfigStorage.res.device1.name
        const securityPass = retConfigStorage.res.securityPass

        let ws1;
        async function web1() {
            let ws1 = new WebS(`ws://${wsHost}:${portWebSocket}/${device1}`);
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
                    let infWebSocketRet
                    if (data.retWs && data.retWs.res) {
                        infWebSocketRet = { 'data': event.data.replace(/"########"/g, JSON.stringify(`${data.retWs.res}\n`)) }
                    } else {
                        infWebSocketRet = { 'data': event.data }
                    }
                    const retWebSocketRet = webSocketRet(infWebSocketRet)
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

// const infSniffer = {  'arrUrl': ['*.vtt*'] }
// const retSniffer = await sniffer(infSniffer)
// console.log(retSniffer)

// let infExcel, retExcel // CQPT    KQRE
// infExcel = { 'action': 'get', 'tab': 'YARE', 'col': 'A', 'lin': 1 }
// //infExcel = { 'action': 'set', 'tab': 'YARE', 'col': 'A',  'value': `VALOR` }
// retExcel = await excel(infExcel)
// console.log(retExcel)


