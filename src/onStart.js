await import('./resources/clearConsole.js');
console.log('onStart');
await import('./resources/@functions.js');

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
                    const infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'webSocketRet' }
                    const retConfigStorage = await configStorage(infConfigStorage)
                    if (!retConfigStorage.ret) {
                        return ret
                    }
                    const port = retConfigStorage.res.port;
                    const device1 = retConfigStorage.res.device2.name
                    const securityPass = retConfigStorage.res.securityPass

                    const infApi = {
                        url: `http://${retConfigStorage.res.ws1}:${port}/${device1}`,
                        method: 'POST',
                        headers: { 'content-type': 'text/plain;charset=UTF-8' },
                        body: {
                            "fun": {
                                "securityPass": securityPass,
                                "funRet": {
                                    "ret": true,
                                    "url": `ws://${retConfigStorage.res.ws1}:${port}/${device1}`,
                                    "inf": "ID DO RETORNO"
                                },
                                "funRun": {
                                    "name": "commandLine",
                                    "par": {
                                        "background": true,
                                        "command": "notepad"
                                    }
                                }
                            }
                        }
                    };
                    const retApi = api(infApi);
                } else {
                    // gO.inf = { 'sniffer': 2 }
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

        const infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'webSocketRet' }
        const retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) {
            return ret
        }
        const port = retConfigStorage.res.port;
        const device1 = retConfigStorage.res.device1.name
        const securityPass = retConfigStorage.res.securityPass

        let ws1;
        async function web1() {
            let ws1 = new WebS(`ws://${retConfigStorage.res.ws1}:${port}/${device1}`);
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
                    const infWebSocketRet = { 'data': event.data }
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

