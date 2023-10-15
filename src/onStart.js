// await import('./resources/@functions.js'); console.log('onStartNode')
await import('./resources/@functions.js'); console.log('onStart');

if (typeof window !== 'undefined') { // CHROME
    const keys = ['webSocket', 'chatGptOra.ai', 'chatGptOpenAi', 'sniffer'];
    for (const key of keys) { const infConfigStorage = { 'action': 'del', 'key': key }; const retConfigStorage = await configStorage(infConfigStorage) }
    await chromeActions({ 'action': 'badge', 'text': '' }); chrome.downloads.onChanged.addListener(async function (...inf) { // EXCLUIR DOWNLOAD SE TIVER '[KEEP]' NO TITULO DO ARQUIVO
        if (inf[0].state && inf[0].state.current === "complete") {
            chrome.downloads.search({ id: inf.id }, async function (inf) {
                if (inf.length > 0) {
                    const d = inf[0]; if (d.byExtensionName === 'BOT' && !d.filename.includes('[KEEP]')) {
                        setTimeout(function () { chrome.downloads.erase({ id: d.id }); console.log('DOWNLOAD REMOVIDO DA LISTA'); URL.revokeObjectURL(d.url) }, 5000);
                    }
                }
            });
        }
    }); chrome.browserAction.onClicked.addListener(async function (...inf) { // ######################### CLICK NO ICONE
        console.log('ON START: ICONE PRESSIONADO'); //chrome.browserAction.setPopup({popup: "./popup.html"});
    }); chrome.commands.onCommand.addListener(async function (...inf) { // ######################### ATALHO PRESSIONADO
        let ret = { 'ret': false }; try {
            const infShortcutPressed = { 'shortcut': inf[0] } //console.log('ON START: ATALHO PRESSIONADO')
            if (infShortcutPressed.shortcut == 'atalho_1') { command1(); ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK` }
            else if (infShortcutPressed.shortcut == 'atalho_2') {
                const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
                if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }; const host = retConfigStorage.ws1;
                const port = retConfigStorage.portWebSocket; const dev2 = retConfigStorage.device2.name; const securityPass = retConfigStorage.securityPass;
                const infNotification = { 'duration': 4, 'icon': './src/media/icon_3.png', 'title': `AGUARDE...`, 'text': `Alternando sniffer` }
                let par; const retNotification = await notification(infNotification);
                const infFile = { 'action': 'read', 'path': `${conf[1]}:/ARQUIVOS/Projetos/Sniffer_Python/log/state.txt` };
                const retFile = await file(infFile); par = `"${conf[1]}:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\1_BACKGROUND.exe"`;
                if (retFile.res == 'ON') { par = `${par} "taskkill /IM nodeSniffer.exe /F"` }
                else { par = `${par} "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\1_BACKGROUND.exe"` }; await commandLine({ 'command': par })
                ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK`;
            } else if (infShortcutPressed.shortcut == 'atalho_3') { command3(); ret['ret'] = true; ret['msg'] = `SHORTCUT PRESSED: OK` }
            else { ret['msg'] = `\n #### ERRO #### ON START | ACAO DO ATALHO NAO DEFINIDA \n\n` }
        } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }
        if (!ret.ret) { console.log(ret.msg); if (typeof window !== 'undefined') { const retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' }) } }; return ret
    });
}
// *************************
async function run(inf) {
    let ret = { 'ret': false };
    try {
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }; const securityPass = retConfigStorage.securityPass;
        let s = retConfigStorage.server['1'], url = s.url, host = s.host, port = s.port, dev = retConfigStorage.devices; let dev1 = `${url}://${host}:${port}/${dev[1].name}`

        gO.inf = { 'wsArr': [dev1,] }; await wsConnect(gO.inf.wsArr); wsList(gO.inf.wsArr[0], async (message) => {
            let data = {}; try { data = JSON.parse(message) } catch (e) { }; if (data.fun) {
                let infWebSocketRet; if (data.retWs && data.retWs.res) {
                    infWebSocketRet = { 'data': message.replace(/"########"/g, JSON.stringify(`${data.retWs.res}\n`)) }
                } else { infWebSocketRet = { 'data': message } }; await webSocketRet(infWebSocketRet)
            } else if (data.other) { // other
                // console.log('ther', data.other)
                const infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/TryRating/reg.txt' }
                const retFile = await file(infFile); let old = Number(retFile.res); let now = Number(dateHour().res.tim); const dif = now - old

                if (dif < 15) { const wait = 15 - dif; const retRandom = await random({ 'min': wait, 'max': wait + 9, 'await': true }) }
                console.log('FIM', data.inf, '\n', data.res, '\n', data.query)

                if (data.other == 'peroptyx_QueryImageDeservingClassification') {
                    const infTabSearch = { 'search': '*tryrating.com*', 'openIfNotExist': false, 'active': true, 'pinned': false }
                    const retTabSearch = await tabSearch(infTabSearch); if (!retTabSearch.res) { console.log('voltou'); return }
                    let element, action, code, array = data.inf; for (let [index, value] of array.entries()) {
                        await new Promise(resolve => { setTimeout(resolve, 800) });// console.log(`INDEX: ${index} | VALUE: ${value}`)
                        if (index == 0) {
                            if (value == 1) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[1]/label/span[2]` }
                            else if (value == 2) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[2]/label/span[2]` }
                            else if (value == 3) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[3]/label/span[2]` }
                            else if (value == 4) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[4]/label/span[2]` }
                        } else if (index == 1) {
                            if (value == 1) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[5]/div/div/form/div/div/div/div[1]/label/span[2]` }
                            else if (value == 2) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[5]/div/div/form/div/div/div/div[2]/label/span[2]` }
                            else if (value == 3) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[5]/div/div/form/div/div/div/div[3]/label/span[2]` }
                        } else if (index == 2) {
                            if (value == 1) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[7]/div/div/form/div/div/div/div[1]/label/span[2]` }
                            else if (value == 2) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[7]/div/div/form/div/div/div/div[2]/label/span[2]` }
                            else if (value == 3) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[7]/div/div/form/div/div/div/div[3]/label/span[2]` }
                        }; element = `document.evaluate('${element}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`
                        action = `.click()`; code = `${element}${action}`
                        const infChromeActions = { 'action': 'script', 'code': code, 'tabSearch': retTabSearch.res.id }; const retChromeActions = await chromeActions(infChromeActions)
                    }
                    // ###### SUBMIT (topo)
                    element = `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[2]/button[2]`
                    element = `document.evaluate('${element}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`
                    action = `.click()`; code = `${element}${action}`; await new Promise(resolve => { setTimeout(resolve, 800) })
                    const infChromeActions = { 'action': 'script', 'code': code, 'tabSearch': retTabSearch.res.id }; const retChromeActions = await chromeActions(infChromeActions)
                }

            } else { console.log(`\nMENSAGEM DO WEBSCKET\n\n${message}\n`) }
        });

        const infLog = { 'folder': '#_TESTE_#', 'path': `TESTE.txt`, 'text': 'INF AQUI' }
        const retLog = await log(infLog);
        console.log(retLog)

        ret['ret'] = true
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) {
        console.log(ret.msg); if (typeof window !== 'undefined') { const retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' }) }
        else { await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': `ONSTART NODEJS: ${ret.msg}` }) } // ← NODEJS  ↑CHROME
    }
}
run()

let infConfigStorage, retConfigStorage;
infConfigStorage = { 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
infConfigStorage = { 'action': 'get', 'key': 'NomeDaChave' }
infConfigStorage = { 'action': 'del', 'key': 'NomeDaChave' }
// retConfigStorage = await configStorage(infConfigStorage); console.log(retConfigStorage)

let infFile, retFile
infFile = { 'action': 'inf' }
infFile = { 'action': 'write', 'functionLocal': false, 'path': './PASTA/ola.txt', 'rewrite': true, 'text': '1234\n' }
infFile = { 'action': 'read', 'functionLocal': false, 'path': './PASTA/ola.txt' }
infFile = { 'action': 'list', 'functionLocal': false, 'path': './PASTA/', 'max': 10 }
infFile = { 'action': 'change', 'functionLocal': false, 'path': './PASTA/', 'pathNew': './PASTA2/' }
infFile = { 'action': 'del', 'functionLocal': false, 'path': './PASTA2/' }
// retFile = await file(infFile); console.log(retFile)

// let csf = configStorage, cs
// gLet = 'AAAAAAA'
// cs = await csf([gLet]); gLet = cs.res
// console.log('######', gLet)

let infChatGpt = { 'provider': 'ora.ai', 'input': `Quanto é 1+1?` }
// let retChatGpt = await chatGpt(infChatGpt); console.log(retChatGpt)

// let cs = configStorage, csr
// csr = await cs(['set', 'NomeDaChave123', 'valor aqui']); console.log(csr)
// csr = await cs(['get', 'NomeDaChave123']); console.log(csr)




