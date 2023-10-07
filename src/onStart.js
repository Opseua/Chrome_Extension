await import('./resources/@functions.js');
console.log('onStart');

if (typeof window !== 'undefined') { // CHROME
    const keys = ['webSocket', 'chatGptOra.ai', 'chatGptOpenAi', 'sniffer'];
    for (const key of keys) { const infConfigStorage = { 'action': 'del', 'key': key }; const retConfigStorage = await configStorage(infConfigStorage) }
    await chromeActions({ 'action': 'badge', 'inf': { 'text': '' } })
    chrome.downloads.onChanged.addListener(async function (...inf) { // EXCLUIR DOWNLOAD SE TIVER '[KEEP]' NO TITULO DO ARQUIVO
        if (inf[0].state && inf[0].state.current === "complete") {
            chrome.downloads.search({ id: inf.id }, async function (inf) {
                if (inf.length > 0) {
                    const d = inf[0]; if (d.byExtensionName === 'BOT' && !d.filename.includes('[KEEP]')) {
                        // console.log(`EVENTO: download do BOT concluído\n`, downloadItem)
                        setTimeout(function () { chrome.downloads.erase({ id: d.id }); console.log('DOWNLOAD REMOVIDO DA LISTA'); URL.revokeObjectURL(d.url) }, 5000);
                    }
                }
            });
        }
    });
    chrome.browserAction.onClicked.addListener(async function (...inf) { // ######################### CLICK NO ICONE
        console.log('ON START: ICONE PRESSIONADO'); //chrome.browserAction.setPopup({popup: "./popup.html"});
    });
    chrome.commands.onCommand.addListener(async function (...inf) { // ######################### ATALHO PRESSIONADO
        let ret = { 'ret': false }
        try {
            const infShortcutPressed = { 'shortcut': inf[0] } //console.log('ON START: ATALHO PRESSIONADO')
            if (infShortcutPressed.shortcut == 'atalho_1') { command1(); ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK` }
            else if (infShortcutPressed.shortcut == 'atalho_2') {
                const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
                if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
                const wsHost = retConfigStorage.ws1; const portWebSocket = retConfigStorage.portWebSocket;
                const device1 = retConfigStorage.device1.name; const device2 = retConfigStorage.device2.name
                const securityPass = retConfigStorage.securityPass
                const infNotification =
                {
                    'duration': 4, 'icon': './src/media/icon_3.png',
                    'title': `AGUARDE...`, 'text': `Alternando sniffer`,
                }; let par; const retNotification = await notification(infNotification);
                const infFile = { 'action': 'read', 'path': `${conf[1]}:/ARQUIVOS/Projetos/Sniffer_Python/log/state.txt` };
                const retFile = await file(infFile); par = `"${conf[1]}:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\1_BACKGROUND.exe"`
                if (retFile.ret) {
                    par = `${par} "del "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\log\\state.txt" &&`
                    par = `${par} taskkill /IM \"nodeSniffer.exe\" /F\"`
                } else { par = `${par} "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\1_BACKGROUND.exe"` }
                const infApi = {
                    'url': `http://${wsHost}:${portWebSocket}/${device2}`, 'method': 'POST', 'headers': { 'accept-language': 'application/json' },
                    'body': {
                        "fun": [{
                            "securityPass": securityPass, "funRet": { "retUrl": false }, "funRun": {
                                "name": "commandLine", "par": { "command": par }
                            }
                        }]
                    }
                }; const retApi = await api(infApi); ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK`;
            } else if (infShortcutPressed.shortcut == 'atalho_3') { command3(); ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK` }
            else { ret['msg'] = `\n #### ERRO #### ON START | ACAO DO ATALHO NAO DEFINIDA \n\n` }
        } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }
        if (!ret.ret) {
            console.log(ret.msg); if (typeof window !== 'undefined') { // CHROME
                const infConfigStorage = { 'action': 'del', 'key': 'webSocket' }; const retConfigStorage = await configStorage(infConfigStorage)
            }
        }; return ret
    });
}

// *************************

async function client(inf) {
    let ret = { 'ret': false }
    try {
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const wsHost = retConfigStorage.ws1; const portWebSocket = retConfigStorage.portWebSocket;
        const device1 = retConfigStorage.device1.name; const securityPass = retConfigStorage.securityPass

        async function web1() {
            ws1 = new _WebS(`ws://${wsHost}:${portWebSocket}/${device1}`);
            ws1.onerror = async (e) => { }; ws1.onopen = () => { console.log(`ON START: CONEXAO OK`) }
            ws1.onclose = async (event) => { console.log(`ON START: RECONEXAO EM 10 SEGUNDOS`); await new Promise(r => setTimeout(r, 10000)); web1() }
            ws1.onmessage = async (event) => {
                let data, fun, other; try { data = JSON.parse(event.data); if (data.fun) { fun = true } else if (data.other) { other = true } } catch (e) { }; if (fun) {
                    let infWebSocketRet; if (data.retWs && data.retWs.res) {
                        infWebSocketRet = { 'data': event.data.replace(/"########"/g, JSON.stringify(`${data.retWs.res}\n`)) }
                    } else { infWebSocketRet = { 'data': event.data } }; const retWebSocketRet = webSocketRet(infWebSocketRet)
                } else if (other) {
                    // other
                    console.log(data.other)
                } else {
                    const msg = `\n\n MENSAGEM DO WEBSCKET \n\n ${event.data} \n\n`; console.log(msg)
                }
            }

        }; web1(); ret['ret'] = true
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }
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

let infFile, retFile
infFile = { 'action': 'inf' }
// infFile = { 'action': 'write', 'functionLocal': false, 'path': './PASTA/ola.txt', 'rewrite': true, 'text': '1234\n' }
// infFile = { 'action': 'read', 'functionLocal': false, 'path': './PASTA/ola.txt' }
// infFile = { 'action': 'list', 'functionLocal': false, 'path': './PASTA/', 'max': 10 }
// infFile = { 'action': 'change', 'functionLocal': false, 'path': './PASTA/', 'pathNew': './PASTA2/' }
// infFile = { 'action': 'del', 'functionLocal': false, 'path': './PASTA2/' }
//retFile = await file(infFile); console.log(retFile)


// await new Promise(resolve => setTimeout(resolve, 2000));
// ws1.send(JSON.stringify({ "name": "google", "par": { "search": "quanto é 1+1" } }))


// let infChatGpt = { 'provider': 'ec2', 'input': `Quanto é 1+1?` }
// let retChatGpt = await chatGpt(infChatGpt)
// console.log(retChatGpt)


