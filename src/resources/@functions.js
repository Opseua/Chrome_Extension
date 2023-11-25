// await import('./@functions.js');

// await new Promise(resolve => { setTimeout(resolve, 2000) })

// let array = ['A', 'B', 'C', 'D', 'E', 'F'];
// for (let [index, value] of array.entries()) {
//     console.log('INDEX', index, 'VALUE', value);
//     await new Promise(resolve => setTimeout(resolve, 1000));
// }
// console.log('FIM');

// let qtd = 0, stop = false
// while (!stop) {
//     qtd++;
//     await new Promise(resolve => { setTimeout(resolve, 1000) })
//     console.log(qtd)
//     if (qtd === 3) { return }
// }
// console.log('FIM')

// [1] CHROME [c] | [2] NODEJS [n] | [3] GOOGLE [g]  
let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2

// ###### true CHROME | false NODEJS
if (cng == 1) {
    window['eng'] = true
    window['engName'] = 'CHROME'
} else if (cng == 2) {
    global['eng'] = false
    global['engName'] = 'NODEJS'
} else if (cng == 3) {
    // global['eng'] = false
    // global['engName'] = 'GOOGLE'
}

let _fs, _path, _cheerio, _clipboard, _WebSocket, _http, _exec, _google, _crypto, _puppeteer, cs, conf = ['src/config.json'];

if (eng) { // CHROME
    _WebSocket = window.WebSocket
} else { // NODEJS
    _fs = await import('fs');
    _path = await import('path');
    _cheerio = await import('cheerio');
    const { default: WebSocket } = await import('ws'); _WebSocket = WebSocket;
    const { default: clipboard } = await import('clipboardy'); _clipboard = clipboard;
    const { default: http } = await import('http'); _http = http;
    const { exec } = await import('child_process'); _exec = exec
    const { google } = await import('googleapis'); _google = google
    const { createHash } = await import('crypto'); _crypto = createHash
    _puppeteer = await import('puppeteer');
}

function all() { }; // ******************************************************** NÃO USAR !!!
if (eng) { window['all'] = all; } else { global['all'] = all }
// *****************************************************************************************

// ############## RESOURCES
await import('./api.js')
await import('./chatGpt.js')
await import('./chromeActions.js')
await import('./clipboard.js')
await import('./commandLine.js')
await import('./configStorage.js')
await import('./dateHour.js')
await import('./devFun.js')
await import('./file.js')
await import('./getCookies.js')
await import('./getPage.js')
await import('./googleSheet.js')
await import('./hasKey.js')
await import('./htmlToJson.js')
await import('./jsonInterpret.js')
await import('./log.js')
await import('./keepCookieLive.js')
await import('./notification.js')
await import('./orderObj.js')
await import('./promptChrome.js')
await import('./random.js')
await import('./regex.js')
await import('./regexE.js')
await import('./secToHour.js')
await import('./sniffer.js')
await import('./splitText.js')
await import('./tabSearch.js')
await import('./translate.js')
await import('./wsConnect.js')

// ############## SCRIPTS [CHROME]
if (eng) {
    await import('../scripts/command1.js')
    await import('../scripts/command2.js')
    await import('../scripts/action_TryRating_QueryImageDeservingClassification.js')
}

// ############## SERVER [NODEJS]
await import('../serverNode.js')

// ############## @EXPORT WORK [NODEJS]
if (!eng) {
    // WebScraper
    await import('../../../WebScraper/src/resources/@export.js')

    // URA_Reversa
    await import('../../../URA_Reversa/src/resources/@export.js')
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// ############### GLOBAL OBJECT [NOVO] ###############
// gOList(async function () {
//     console.log('globalObject [import] ALTERADO →', gO.inf);
// })
// gO.inf['NovaChave'] = { 'a': 'b' }
// gO.inf['NovaChave'] = ['a', 'b', 'c',]
// console.log(gO.inf)

let gOListener = []; let gOObj = {};
function gOList(listener) { gOListener.push(listener) }
function notificarListeners(prop, value) {
    if (gO.inf.alert) { console.log('globalObject [export] ALTERADO →', gO.inf) };
    for (let listener of gOListener) { listener(prop, value); }
}; let gO = new Proxy(gOObj, {
    set(target, prop, value) { target[prop] = value; notificarListeners(prop, value); return true; }
}); gO.inf = {}
// ##########################################################

// let cs = await configStorage([''])
// console.log(cs)

// ############### GLOBAL OBJECT [SNIFFER CHROME] ###############
let data = { inf: '' }; let listeners = new Set();
let gOSniffer = new Proxy(data, {
    set(target, key, value) { target[key] = value; globalChanged(value); listeners.forEach(listener => listener(target)); return true }
});
function gOAddSniffer(listener) { listeners.add(listener) }; function gORemSniffer(listener) { listeners.delete(listener) }
async function globalChanged(i) {
    // if (i.alert !== false) { console.log('globalObject ALTERADO →', i)}
}

// ############### RATE LIMIT ###############
// let rate = rateLimiter({ 'max': 5, 'sec': 10 });
// function testRate() {
//     console.log(rate.check())
//     console.log(rate.check())
//     console.log(rate.check())
//     console.log(rate.check())
//     console.log(rate.check())
//     console.log(rate.check())
//     console.log(rate.check())
// };
// testRate();

function rateLimiter(inf) {
    let max = inf.max; let sec = inf.sec * 1000; let old = []; function check() {
        let now = Date.now(); let recent = old.filter(timestamp => timestamp >= now - sec);
        if (recent.length < max) { old.push(now); return true; } else { return false }
    }; return { check };
}
// // ############### CLEAR CONSOLE ###############
console.clear(); let msgQtd = 0; let clearConsole = console.log;
console.log = function () {
    clearConsole.apply(console, arguments); msgQtd++;
    if (msgQtd >= 100) { console.clear(); msgQtd = 0; console.log('CONSOLE LIMPO!') }
} // // ###############               ###############

if (eng) { // CHROME
    // ## BIBLIOTECAS
    window['_WebSocket'] = _WebSocket;
    // ## VARIÁVEIS
    window['conf'] = conf;
    window['cs'] = cs;
    // ## GLOBAL OBJECT [NOVO]
    window['gO'] = gO; window['gOList'] = gOList;
    // ## GLOBAL OBJECT [SNIFFER CHROME] 
    window['gOSniffer'] = gOSniffer;
    window['gOAddSniffer'] = gOAddSniffer;
    window['gORemSniffer'] = gORemSniffer;
} else { // NODEJS 
    // ## BIBLIOTECAS
    const { WebSocketServer } = await import('ws'); global['_WebSocketServer'] = WebSocketServer; // SERVER WEBSOCKET [EC2] (não subir!!!)
    global['_WebSocket'] = _WebSocket;
    global['_fs'] = _fs;
    global['_path'] = _path;
    global['_cheerio'] = _cheerio;
    global['_clipboard'] = _clipboard;
    global['_http'] = _http;
    global['_exec'] = _exec;
    global['_google'] = _google;
    global['_crypto'] = _crypto
    global['_puppeteer'] = _puppeteer
    // ## VARIÁVEIS
    global['conf'] = conf;
    global['cs'] = cs;
    // ## GLOBAL OBJECT [NOVO]
    global['gO'] = gO;
    global['gOList'] = gOList;
    // ## GLOBAL OBJECT [SNIFFER CHROME]  
    global['gOSniffer'] = gOSniffer;
    global['gOAddSniffer'] = gOAddSniffer;
    global['gORemSniffer'] = gORemSniffer;
}

// OBRIGATÓRIO FICAR APOS O EXPORT GLOBAL (não subir!!!)
let retFile = await file({ 'action': 'inf' });
let confNew = retFile.ret ? retFile.res : ['NaoEncontrado']
let retConfigStorage = await configStorage({ 'action': 'get', 'key': 'webSocket', });
let secReconnect = retConfigStorage.res.secReconnect
let secPing = retConfigStorage.res.secPing
let par1 = retConfigStorage.res.par1
let par2 = retConfigStorage.res.par2
let par3 = retConfigStorage.res.par3
let par4 = retConfigStorage.res.par4
let par5 = retConfigStorage.res.par5
let par6 = retConfigStorage.res.par6
let par7 = retConfigStorage.res.par7
let securityPass = retConfigStorage.res.securityPass
let serverWeb = retConfigStorage.res.server['1']
let serverLocal = retConfigStorage.res.server['2']
let url = serverWeb.url;
let hostWeb = serverWeb.host;
let portWeb = serverWeb.port
let hostLocal = serverLocal.host;
let portLocal = serverLocal.port
let devices = retConfigStorage.res.devices
let devChromeWeb = `${url}://${hostWeb}:${portWeb}/${devices[0].name}`
let devChromeLocal = `${url}://${hostLocal}:${portLocal}/${devices[0].name}`
let devNodeJSWeb = `${url}://${hostWeb}:${portWeb}/${devices[1].name}`
let devNodeJSLocal = `${url}://${hostLocal}:${portLocal}/${devices[1].name}`
let devBlueStacksWeb = `${url}://${hostWeb}:${portWeb}/${devices[2].name}`
let devBlueStacksLocal = `${url}://${hostLocal}:${portLocal}/${devices[2].name}`
let devEC2Web = `${url}://${hostWeb}:${portWeb}/${devices[3].name}`
let devEC2Local = `${url}://${hostLocal}:${portLocal}/${devices[3].name}`

if (eng) { // CHROME
    window['conf'] = confNew
    window['secReconnect'] = secReconnect
    window['secPing'] = secPing
    window['par1'] = par1
    window['par2'] = par2
    window['par3'] = par3
    window['par4'] = par4
    window['par5'] = par5
    window['par6'] = par6
    window['par7'] = par7
    window['securityPass'] = securityPass
    window['port'] = portWeb
    window['devChromeWeb'] = devChromeWeb
    window['devChromeLocal'] = devChromeLocal
    window['devNodeJSWeb'] = devNodeJSWeb
    window['devNodeJSLocal'] = devNodeJSLocal
    window['devBlueStacksWeb'] = devBlueStacksWeb
    window['devBlueStacksLocal'] = devBlueStacksLocal
    window['devEC2Web'] = devEC2Web
    window['devEC2Local'] = devEC2Local
    window['rateLimiter'] = rateLimiter
} else { // NODEJS 
    global['conf'] = confNew
    global['secReconnect'] = secReconnect
    global['secPing'] = secPing
    global['par1'] = par1
    global['par2'] = par2
    global['par3'] = par3
    global['par4'] = par4
    global['par5'] = par5
    global['par6'] = par6
    global['par7'] = par7
    global['securityPass'] = securityPass
    global['port'] = portWeb
    global['devChromeWeb'] = devChromeWeb
    global['devChromeLocal'] = devChromeLocal
    global['devNodeJSWeb'] = devNodeJSWeb
    global['devNodeJSLocal'] = devNodeJSLocal
    global['devBlueStacksWeb'] = devBlueStacksWeb
    global['devBlueStacksLocal'] = devBlueStacksLocal
    global['devEC2Web'] = devEC2Web
    global['devEC2Local'] = devEC2Local
    global['rateLimiter'] = rateLimiter
}


