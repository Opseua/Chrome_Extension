// await import('./resources/@functions.js'); console.log('onStartNode')
await import('./resources/@functions.js'); console.log('onStart');

if (typeof window !== 'undefined') { // CHROME
    const keys = ['webSocket', 'chatGptOra.aiAAAA', 'chatGptOpenAi', 'sniffer'];
    for (const key of keys) { const infConfigStorage = { 'action': 'del', 'key': key }; const retConfigStorage = await configStorage(infConfigStorage) }
    await chromeActions({ 'action': 'badge', 'text': '' });
    chrome.downloads.onChanged.addListener(async function (...inf) { // EXCLUIR DOWNLOAD SE TIVER '[KEEP]' NO TITULO DO ARQUIVO
        if (inf[0].state && inf[0].state.current === "complete") {
            chrome.downloads.search({ id: inf.id }, async function (inf) {
                if (inf.length > 0) {
                    const d = inf[0]; if (d.byExtensionName === 'BOT' && !d.filename.includes('[KEEP]')) {
                        setTimeout(function () {
                            chrome.downloads.erase({ id: d.id }); console.log('DOWNLOAD REMOVIDO DA LISTA'); URL.revokeObjectURL(d.url)
                        }, 5000);
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
        if (!ret.ret) { console.log(ret.msg) }; return ret
    });
}

async function keepCookieLive() {
    let retConfigStorage = await configStorage({ 'action': 'get', 'key': 'chatGptOra.ai' }); retConfigStorage = retConfigStorage.res
    const infTabSearch = { 'search': '*ora.ai*', 'openIfNotExist': true, 'active': false, 'pinned': true, 'url': retConfigStorage.Referer }
    const retTabSearch = await tabSearch(infTabSearch); chrome.tabs.reload(retTabSearch.res.id); await new Promise(resolve => { setTimeout(resolve, 5000) })
    const infGetCookies = { 'url': retConfigStorage.Referer, 'cookieSearch': '__Secure-next-auth.session-token' }
    const retGetCookies = await getCookies(infGetCookies); retConfigStorage['cookie'] = retGetCookies.res.concat
    const infConfigStorage = { 'action': 'set', 'key': 'chatGptOra.ai', 'value': retConfigStorage }
    retConfigStorage = await configStorage(infConfigStorage); const send = {
        "fun": [
            {
                "securityPass": securityPass, "funRet": { "retUrl": true, "retInf": false },
                "funRun": { "name": "configStorage", "par": infConfigStorage }
            },
            {
                "securityPass": securityPass, "funRet": { "retUrl": true, "retInf": false },
                "funRun": { "name": "log", "par": { 'folder': 'JavaScript', 'path': `log.txt`, 'text': `keepCookieLive` } }
            }]
    }; wsSend(devNodeJS, send);
    //  setTimeout(keepCookieLive, 3600000);
}; // keepCookieLive();

// *************************
async function run(inf) {
    let ret = { 'ret': false };
    try {
        await wsConnect([devChrome, devNodeJS, devBlueStacks,]);
        
        wsList(devChrome, async (nomeList, par1) => {
            let data = {}; try { data = JSON.parse(par1) } catch (e) { }; if (data.fun) { // fun
                let infWebSocketRet; if (data.retWs && data.retWs.res) {
                    infWebSocketRet = { 'data': JSON.parse(par1.replace(/"########"/g, JSON.stringify(`${data.retWs.res}\n`))) }
                } else { infWebSocketRet = { 'data': data, 'wsOrigin': nomeList } }; await webSocketRet(infWebSocketRet)
            } else if (data.other) { // other
                // console.log('other', data.other)

                if (data.other == 'keepCookieLive') {
                    await keepCookieLive(); wsSend(nomeList, { 'other': 'OK: keepCookieLive' })
                } else if (data.other == 'TryRating_QueryImageDeservingClassification') {
                    const infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/TryRating/reg.txt' }
                    const retFile = await file(infFile); let old = Number(retFile.res); let now = Number(dateHour().res.tim); const dif = now - old

                    if (dif < 15) { const wait = 15 - dif; const retRandom = await random({ 'min': wait, 'max': wait + 9, 'await': true }) }
                    console.log('FIM', data.inf, '\n', data.res, '\n', data.query)

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
                        const infChromeActions = { 'action': 'script', 'code': code, 'search': retTabSearch.res.id }; const retChromeActions = await chromeActions(infChromeActions)
                    }
                    // ###### SUBMIT (topo)
                    element = `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[2]/button[2]`
                    element = `document.evaluate('${element}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`
                    action = `.click()`; code = `${element}${action}`; await new Promise(resolve => { setTimeout(resolve, 800) })
                    const infChromeActions = { 'action': 'script', 'code': code, 'search': retTabSearch.res.id }; const retChromeActions = await chromeActions(infChromeActions)
                    wsSend(nomeList, { 'other': 'OK: TryRating_QueryImageDeservingClassification' })
                }

            } else { console.log(`\nMENSAGEM DO WEBSCKET\n\n${par1}\n`) }
        });

        ret['ret'] = true
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) {
        console.log(ret.msg); if (typeof window !== 'undefined') { const retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' }) }
        else { await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': `ONSTART NODEJS: ${ret.msg}` }) } // ← NODEJS  ↑ CHROME
    }
}
run()

let infConfigStorage, retConfigStorage;
infConfigStorage = { 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
infConfigStorage = { 'action': 'get', 'key': 'chatGptOra.ai' }
//infConfigStorage = { 'action': 'del', 'key': 'NomeDaChave' }
//retConfigStorage = await configStorage(infConfigStorage); console.log(retConfigStorage)

let infFile, retFile
infFile = { 'action': 'inf' }
infFile = { 'action': 'write', 'functionLocal': false, 'path': './PASTA/ola.txt', 'rewrite': true, 'text': '1234\n' }
infFile = { 'action': 'read', 'functionLocal': false, 'path': './PASTA/ola.txt' }
infFile = { 'action': 'list', 'functionLocal': false, 'path': './PASTA/', 'max': 10 }
infFile = { 'action': 'change', 'functionLocal': false, 'path': './PASTA/', 'pathNew': './PASTA2/' }
infFile = { 'action': 'del', 'functionLocal': false, 'path': './PASTA2/' }
// retFile = await file(infFile); console.log(retFile)

let infChatGpt = { 'provider': 'ora.ai', 'input': `Quanto é 1+1999?` }
//let retChatGpt = await chatGpt(infChatGpt); console.log(retChatGpt)

let infChromeActions, retChromeActions
// infChromeActions = {
//     'search': '*https://ora.ai/signin*',
//     'url': 'https://ora.ai/signin',
//     'action': 'script',
//     'code': `document.evaluate('//*[@id="__next"]/div/div/div[2]/div[2]/div/main/div/div/button/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()`
// }; retChromeActions = await chromeActions(infChromeActions); console.log(retChromeActions)
// await new Promise(resolve => { setTimeout(resolve, 5000) })
// infChromeActions = {
//     'search': '*https://accounts.google.com/*',
//     'url': 'https://accounts.google.com/',
//     'action': 'script',
//     'code': `document.evaluate('//*[@id="view_container"]/div/div/div[2]/div/div[1]/div/form/span/section/div/div/div/div/ul/li[1]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()`
// }; retChromeActions = await chromeActions(infChromeActions); console.log(retChromeActions)
// infChromeActions = {
//     'search': '*https://ora.ai/voluntary-red-v53j/keep_session*',
//     'url': 'https://ora.ai/voluntary-red-v53j/keep_session',
//     'action': 'script',
//     'code': `document.evaluate('//*[@id="__next"]/div/div/div[2]/div/div[2]/div/div/main/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()`
// }; retChromeActions = await chromeActions(infChromeActions); console.log(retChromeActions)
// function elementAction(inf) {
//     if (inf.method == 'xpath') {
//         var elemento = document.evaluate(inf.element, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//         if (!elemento) { return false }
//         else {
//             if (inf.action == 'click') {
//                 elemento.click()
//             }
//             else if (inf.action == 'input') {
//                 elemento.value = inf.value
//             }
//             return true;
//         }
//     }
// }
// console.log(elementAction({
//     'method': 'xpath', 'action': 'input', 'value': `123`,
//     'element': `//*[@id="app-root"]/div/div[4]/div[2]/div/form/div[1]/div/div/span/div/div/div[1]`
// }))
// console.log(elementAction({
//     'method': 'xpath', 'action': 'click',
//     'element': `//*[@id="headlessui-menu-button-:r15:"]/div/span`
// }))






