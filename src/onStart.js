await import('./resources/@functions.js');
console.log('onStart')

if (typeof window !== 'undefined') { // CHROME
    const keys = ['webSocket', 'chatGptOra.ai', 'sniffer'];
    for (const key of keys) { const infConfigStorage = { 'action': 'del', 'key': key }; const retConfigStorage = await configStorage(infConfigStorage) }
    await chromeActions({ 'action': 'badge', 'inf': { 'text': '' } })
    chrome.downloads.onChanged.addListener(async function (...inf) { // EXCLUIR DOWNLOAD SE TIVER '[KEEP]' NO TITULO DO ARQUIVO
        if (inf[0].state && inf[0].state.current === "complete") {
            chrome.downloads.search({ id: inf.id }, async function (inf) {
                if (inf.length > 0) {
                    const downloadItem = inf[0];
                    if (downloadItem.byExtensionName === 'BOT' && !downloadItem.filename.includes('[KEEP]')) {
                        // console.log(`EVENTO: download do BOT concluído\n`, downloadItem)
                        setTimeout(function () {
                            chrome.downloads.erase({ id: downloadItem.id }); console.log('DOWNLOAD REMOVIDO DA LISTA');
                            URL.revokeObjectURL(downloadItem.url);
                        }, 5000);
                    }
                }
            });
        }
    });
    chrome.browserAction.onClicked.addListener(async function (...inf) { // ######################### CLICK NO ICONE
        console.log('ON START: ICONE PRESSIONADO'); //chrome.browserAction.setPopup({popup: "./popup.html"});
    });
    chrome.commands.onCommand.addListener(async function (...inf) { // ######################### ATALHO PRESSIONADO
        let ret = { 'ret': false };
        try {
            //console.log('ON START: ATALHO PRESSIONADO')
            const infShortcutPressed = { 'shortcut': inf[0] }
            if (infShortcutPressed.shortcut == 'atalho_1') { command1(); ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK` }
            else if (infShortcutPressed.shortcut == 'atalho_2') {
                const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
                if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
                const wsHost = retConfigStorage.ws1; const portWebSocket = retConfigStorage.portWebSocket;
                const device1 = retConfigStorage.device1.name; const device2 = retConfigStorage.device2.name
                const securityPass = retConfigStorage.securityPass
                const infNotification =
                {
                    'duration': 4, 'iconUrl': './src/media/icon_3.png',
                    'title': `AGUARDE...`,
                    'message': `Alternando sniffer`,
                }; let par; const retNotification = await notification(infNotification);
                const infFile = { 'action': 'read', 'path': `${conf[1]}:/ARQUIVOS/Projetos/Sniffer_Python/log/state.txt` };
                const retFile = await file(infFile)
                par = `"${conf[1]}:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\1_BACKGROUND.exe"`
                if (retFile.ret) {
                    par = `${par} "del "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\log\\state.txt" &&`
                    par = `${par} taskkill /IM \"nodeSniffer.exe\" /F\"`
                } else { par = `${par} "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\1_BACKGROUND.exe"` }
                const infApi = {
                    url: `http://${wsHost}:${portWebSocket}/${device2}`, method: 'POST', headers: { 'accept-language': 'application/json' },
                    body: {
                        "fun": {
                            "securityPass": securityPass, "funRet": { "ret": true, },
                            "funRun": { "name": "commandLine", "par": { "background": false, "command": par } }
                        }
                    }
                }; const retApi = await api(infApi);
                if (!gO.inf.sniffer) {
                    // const infNotification =
                    // {
                    //      'duration': 2, 'iconUrl': './src/media/icon_3.png',
                    //     'title': `RODANDO`,
                    //     'message': `OneForma | Peroptyx`,
                    // };
                    // const retNotification = await notification(infNotification)
                    // command2();
                    // gO.inf = { 'sniffer': 1 }
                } else {
                    //gO.inf = { 'sniffer': 2 }
                    // const infNotification =
                    // {
                    //      'duration': 2, 'iconUrl': './src/media/icon_3.png',
                    //     'title': `PAROU`,
                    //     'message': `OneForma | Peroptyx`,
                    // };
                    // const retNotification = await notification(infNotification)
                    // gO.inf = { 'sniffer': 0 }
                }; ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK`;
            } else if (infShortcutPressed.shortcut == 'atalho_3') { command3(); ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK` }
            else { ret['msg'] = `\n #### ERRO #### ON START | ACAO DO ATALHO NAO DEFINIDA \n\n` }
        } catch (e) { ret['msg'] = regexE({ 'e': e }).res }

        if (!ret.ret) {
            console.log(ret.msg)
            if (typeof window !== 'undefined') { // CHROME
                const infConfigStorage = { 'action': 'del', 'key': 'webSocket' }; const retConfigStorage = await configStorage(infConfigStorage)
            }
        }; return ret
    });
}

// *************************

async function client(inf) {
    let ret = { 'ret': false };
    try {
        let WebS; ret['ret'] = true;
        if (typeof window !== 'undefined') { WebS = window.WebSocket } // CHROME
        else { const { WebSocketServer } = await import('ws'); WebS = WebSocketServer } // NODEJS

        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const wsHost = retConfigStorage.ws1; const portWebSocket = retConfigStorage.portWebSocket;
        const device1 = retConfigStorage.device1.name; const securityPass = retConfigStorage.securityPass

        let ws1;
        async function web1() {
            let ws1 = new WebS(`ws://${wsHost}:${portWebSocket}/${device1}`);
            ws1.onerror = (e) => { }; ws1.onopen = () => { console.log(`ON START: CONEXAO OK`) }
            ws1.onclose = async (event) => { console.log(`ON START: RECONEXAO EM 10 SEGUNDOS`); await new Promise(r => setTimeout(r, 10000)); web1() }
            ws1.onmessage = async (event) => {
                let data, fun
                try { data = JSON.parse(event.data); if (data.fun) { fun = true } }
                catch (e) { }
                if (fun) {
                    let infWebSocketRet
                    if (data.retWs && data.retWs.res) {
                        infWebSocketRet = { 'data': event.data.replace(/"########"/g, JSON.stringify(`${data.retWs.res}\n`)) }
                    } else { infWebSocketRet = { 'data': event.data } }; const retWebSocketRet = webSocketRet(infWebSocketRet)
                } else { console.log(`MENSAGEM DO WEBSCKET\n\n${event.data}\n\n`) }
            }
        }
        web1()
    } catch (e) { ret['msg'] = regexE({ 'e': e }).res }

    if (!ret.ret) {
        console.log(ret.msg)
        if (typeof window !== 'undefined') { // CHROME
            const infConfigStorage = { 'action': 'del', 'key': 'webSocket' }; const retConfigStorage = await configStorage(infConfigStorage)
        }
    }
}
client()

// const infSniffer = {  'arrUrl': ['*.vtt*'] }
// const retSniffer = await sniffer(infSniffer)
// console.log(retSniffer)

// let infExcel, retExcel ; // CQPT    KQRE
// infExcel = { 'action': 'get', 'tab': 'YARE', 'col': 'A', 'lin': 1 }
// infExcel = { 'action': 'set', 'tab': 'YARE', 'col': 'A',  'value': `VALOR` }
// retExcel = await excel(infExcel)
// console.log(retExcel)

let infConfigStorage, retConfigStorage;
infConfigStorage = { 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
infConfigStorage = { 'action': 'get', 'key': 'NomeDaChave' }
infConfigStorage = { 'action': 'del', 'key': 'NomeDaChave' }
// retConfigStorage = await configStorage(infConfigStorage)
// console.log(retConfigStorage)

let infFile, retFile;
infFile = { 'action': 'inf' }
infFile = { 'action': 'relative', 'functionLocal': false, 'path': './PASTA/ola.txt' }
infFile = { 'action': 'read', 'functionLocal': true, 'path': './PASTA/ola.txt' }
infFile = { 'action': 'write', 'functionLocal': false, 'path': './PASTA/ola.txt', 'rewrite': false, 'text': '1234\n' }
infFile = { 'action': 'del', 'functionLocal': true, 'path': './PASTA1/ola.txt' }
infFile = { 'action': 'list', 'functionLocal': true, 'path': '.', 'max': 10 }
// retFile = await file(infFile);
// console.log(retFile)


const infNotification =
{
    'duration': 2, 'iconUrl': './src/media/icon_4.png',
    'title': `TITULO`,
    'message': 'Texto',
};
const retNotification = await notification(infNotification)
