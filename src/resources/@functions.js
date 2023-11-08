// await import('./@functions.js');
// await new Promise(resolve => { setTimeout(resolve, 2000) })

let _fs, _path, _cheerio, _clipboard, _WebS, _http, _run, cs, conf = ['src/config.json'];

if (typeof window !== 'undefined') { // CHROME
    _WebS = window.WebSocket
} else { // NODEJS
    const { default: WebSocket } = await import('ws'); _WebS = WebSocket; _fs = await import('fs');
    _path = await import('path'); _cheerio = await import('cheerio');
    const { default: clipboard } = await import('clipboardy'); _clipboard = clipboard;
    const { default: http } = await import('http'); _http = http;
    const { exec } = await import('child_process'); _run = exec
}

function all() { }; // ******************************************************** NAO USAR !!!
if (typeof window !== 'undefined') { window['all'] = all; } else { global['all'] = all }
// *****************************************************************************************

// ############## functions
await import('./api.js')
await import('./chatGpt.js')
await import('./chromeActions.js')
await import('./clipboard.js')
await import('./commandLine.js')
await import('./configStorage.js')
await import('./dateHour.js')
await import('./devAndFun.js')
await import('./file.js')
await import('./getCookies.js')
await import('./getPage.js')
await import('./googleSheets.js')
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
await import('./webSocketRet.js')
await import('./wsConnect.js')

// ############## scripts
await import('../scripts/command1.js')

// ############### GLOBAL OBJECT ###############
// gOList(async function () {
//     console.log('globalObject [import] ALTERADO →', gO.inf);
// })
// gO.inf['NovaChave'] = { 'a': 'b' }
// gO.inf['NovaChave'] = ['a', 'b', 'c',]
// console.log(gO.inf)
// ******
const gOListener = []; const gOObj = {};
function gOList(listener) { gOListener.push(listener) }
function notificarListeners(prop, value) {
    if (gO.inf.alert) { console.log('globalObject [export] ALTERADO →', gO.inf) };
    for (const listener of gOListener) { listener(prop, value); }
}; const gO = new Proxy(gOObj, {
    set(target, prop, value) { target[prop] = value; notificarListeners(prop, value); return true; }
}); gO.inf = {}
// *-*-*-*-*-*-*-*
// const cs = await configStorage([''])
// console.log(cs)
// // ############### CLEAR CONSOLE ###############
console.clear(); let msgQtd = 0; const clearConsole = console.log;
console.log = function () {
    clearConsole.apply(console, arguments); msgQtd++;
    if (msgQtd >= 100) { console.clear(); msgQtd = 0; console.log('CONSOLE LIMPO!') }
} // // ###############               ###############

if (typeof window !== 'undefined') { // CHROME
    // ## bibliotecas
    window['_WebS'] = _WebS;
    // ## variaveis
    window['conf'] = conf;
    window['cs'] = cs;
    // ## global object
    window['gO'] = gO; window['gOList'] = gOList;
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
const retFile = await file({ 'action': 'inf' });
const confNew = retFile.ret ? retFile.res : ['NaoEncontrado']
const retConfigStorage = await configStorage({ 'action': 'get', 'key': 'webSocket', });
const securityPass = retConfigStorage.res.securityPass
const server = retConfigStorage.res.server['1']
const url = server.url; const host = server.host; const port = server.port
const devices = retConfigStorage.res.devices
const devRet = `${url}://${host}:${port}/${devices[0].name}`
const devChrome = `${url}://${host}:${port}/${devices[1].name}`
const devNodeJS = `${url}://${host}:${port}/${devices[2].name}`
const devBlueStacks = `${url}://${host}:${port}/${devices[3].name}`

if (typeof window !== 'undefined') { // CHROME
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



