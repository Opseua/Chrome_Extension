//await import('./@functions.js');
//await new Promise(resolve => { setTimeout(resolve, 2000) })

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
await import('./api.js') // node chrome
await import('./chatGpt.js') // node chrome
await import('./chromeActions.js') // node chrome
await import('./clipboard.js') // node chrome
await import('./commandLine.js') // node chrome
await import('./configStorage.js') // node chrome
await import('./dateHour.js') // node chrome
await import('./devAndFun.js') // node chrome
await import('./file.js') // node chrome
await import('./getCookies.js') // node chrome
await import('./getPage.js') // node chrome
await import('./hasKey.js') // node chrome
await import('./jsonInterpret.js') // node chrome
await import('./log.js') // node chrome
await import('./notification.js') // node chrome
await import('./orderObj.js') // node chrome
await import('./promptChrome.js') // node chrome
await import('./random.js') // node chrome
await import('./regex.js') // node chrome
await import('./regexE.js') // node chrome
await import('./secToHour.js') // node chrome
await import('./sniffer.js') // node chrome
await import('./splitText.js') // node chrome
await import('./tabSearch.js') // node chrome
await import('./translate.js') // node chrome
await import('./webSocketRet.js') // node chrome
await import('./wsConnect.js') // node chrome

// ############## scripts
await import('../scripts/command1.js')

// ############### GLOBAL OBJECT ###############
// gOList(async function () {
//     console.log('globalObject [import] ALTERADO →', gO.inf);
// })
// gO.inf['wsArr'] = ['ws://127.0.0.1:8888/DEV1', 'ws://127.0.0.1:8888/DEV2', 'ws://127.0.0.1:8888/DEV3']
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
console.log = async function () {
    clearConsole.apply(console, arguments); msgQtd++;
    if (msgQtd >= 50) { console.clear(); msgQtd = 0; console.log('CONSOLE LIMPO!') }
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
    // ## variaveis
    global['conf'] = conf;
    global['cs'] = cs;
    // ## global object
    global['gO'] = gO; global['gOList'] = gOList;
}

// OBRIGATORIO FICAR APOS O EXPORT GLOBAL, NAO SUBIR!!!
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



