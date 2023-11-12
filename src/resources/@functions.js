// await import('./@functions.js');
// await new Promise(resolve => { setTimeout(resolve, 2000) })

// ###### true CHROME | false NODEJS
if (typeof window !== 'undefined') {
    window['eng'] = true
    window['engName'] = 'CHROME'
} else {
    global['eng'] = false
    global['engName'] = 'NODEJS'
}

let _fs, _path, _cheerio, _clipboard, _WebS, _http, _run, cs, conf = ['src/config.json'];

if (eng) { // CHROME
    _WebS = window.WebSocket
} else { // NODEJS
    const { default: WebSocket } = await import('ws'); _WebS = WebSocket; _fs = await import('fs');
    _path = await import('path'); _cheerio = await import('cheerio');
    const { default: clipboard } = await import('clipboardy'); _clipboard = clipboard;
    const { default: http } = await import('http'); _http = http;
    const { exec } = await import('child_process'); _run = exec
}

function all() { }; // ******************************************************** NAO USAR !!!
if (eng) { window['all'] = all; } else { global['all'] = all }
// *****************************************************************************************

// ############## functions
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
await import('./jsonInterpret.js')
await import('./log.js')
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

// ############## scripts
await import('../scripts/command1.js')

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// ############### GLOBAL OBJECT [novo] ###############
// gOList(async function () {
//     console.log('globalObject [import] ALTERADO →', gO.inf);
// })
// gO.inf['NovaChave'] = { 'a': 'b' }
// gO.inf['NovaChave'] = ['a', 'b', 'c',]
// console.log(gO.inf)
// *-*-*-*-*-*-*-*
const gOListener = []; const gOObj = {};
function gOList(listener) { gOListener.push(listener) }
function notificarListeners(prop, value) {
    if (gO.inf.alert) { console.log('globalObject [export] ALTERADO →', gO.inf) };
    for (const listener of gOListener) { listener(prop, value); }
}; const gO = new Proxy(gOObj, {
    set(target, prop, value) { target[prop] = value; notificarListeners(prop, value); return true; }
}); gO.inf = {}
// ##########################################################

// let cs = await configStorage([''])
// console.log(cs)

// ############### GLOBAL OBJECT [sniffer] ###############
const data = { inf: '' }; const listeners = new Set();
const gOSniffer = new Proxy(data, {
    set(target, key, value) { target[key] = value; globalChanged(value); listeners.forEach(listener => listener(target)); return true }
});
function gOAddSniffer(listener) { listeners.add(listener) }; function gORemSniffer(listener) { listeners.delete(listener) }
async function globalChanged(i) {
    // if (i.alert !== false) { console.log('globalObject ALTERADO →', i)}
}

// // ############### CLEAR CONSOLE ###############
console.clear(); let msgQtd = 0; let clearConsole = console.log;
console.log = function () {
    clearConsole.apply(console, arguments); msgQtd++;
    if (msgQtd >= 100) { console.clear(); msgQtd = 0; console.log('CONSOLE LIMPO!') }
} // // ###############               ###############

if (eng) { // CHROME
    // ## bibliotecas
    window['_WebS'] = _WebS;
    // ## variaveis
    window['conf'] = conf;
    window['cs'] = cs;
    // ## global object NOVO  
    window['gO'] = gO; window['gOList'] = gOList;
    // ## global object SNIFFER CHROME  
    window['gOSniffer'] = gOSniffer;
    window['gOAddSniffer'] = gOAddSniffer;
    window['gORemSniffer'] = gORemSniffer;
} else { // NODEJS 
    // ## bibliotecas
    const { WebSocketServer } = await import('ws'); global['_WebSServer'] = WebSocketServer; // SERVER WEBSOCKET [EC2] (não subir!!!)
    global['_WebS'] = _WebS; global['_fs'] = _fs; global['_path'] = _path;
    global['_cheerio'] = _cheerio; global['_clipboard'] = _clipboard;
    global['_http'] = _http; global['_run'] = _run
    // ## variáveis
    global['conf'] = conf;
    global['cs'] = cs;
    // ## global object
    global['gO'] = gO; global['gOList'] = gOList;
}

// OBRIGATÓRIO FICAR APOS O EXPORT GLOBAL (não subir!!!)
let retFile = await file({ 'action': 'inf' });
let confNew = retFile.ret ? retFile.res : ['NaoEncontrado']
let retConfigStorage = await configStorage({ 'action': 'get', 'key': 'webSocket', });
let securityPass = retConfigStorage.res.securityPass
let server = retConfigStorage.res.server['1']
let url = server.url;
let host = server.host;
let port = server.port
let devices = retConfigStorage.res.devices
let devRet = `${url}://${host}:${port}/${devices[0].name}`
let devChrome = `${url}://${host}:${port}/${devices[1].name}`
let devNodeJS = `${url}://${host}:${port}/${devices[2].name}`
let devBlueStacks = `${url}://${host}:${port}/${devices[3].name}`

if (eng) { // CHROME
    window['conf'] = confNew
    window['securityPass'] = securityPass
    window['devRet'] = devRet
    window['devChrome'] = devChrome
    window['devNodeJS'] = devNodeJS
    window['devBlueStacks'] = devBlueStacks
} else { // NODEJS 
    global['conf'] = confNew
    global['securityPass'] = securityPass
    global['devRet'] = devRet
    global['devChrome'] = devChrome
    global['devNodeJS'] = devNodeJS
    global['devBlueStacks'] = devBlueStacks
}


