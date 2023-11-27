// await new Promise(resolve => { setTimeout(resolve, 2000) })

// let array = ['A', 'B', 'C', 'D', 'E', 'F'];
// for (let [index, value] of array.entries()) {
//     console.log('INDEX', index, 'VALUE', value);
//     await new Promise(resolve => setTimeout(resolve, 1000));
// }
// console.log('FIM');

// [1] CHROME [c] | [2] NODEJS [n] | [3] GOOGLE [g]  
let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2
// ###### true CHROME / GOOGLE | false NODEJS
if (cng == 1) {
    window['eng'] = true
    window['engName'] = 'CHROME'
    window['engName'] = 'CHROME'
} else if (cng == 2) {
    global['eng'] = false
    global['engName'] = 'NODEJS'
} else if (cng == 3) {
    global['eng'] = true
    global['engName'] = 'GOOGLE'
}

let _fs, _path, _cheerio, _clipboard, _WebSocket, _http, _exec, _google, _crypto, cs, conf = ['src/config.json'];

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
    // ## RATE LIMITER 
    window['rateLimiter'] = rateLimiter
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
    // ## RATE LIMITER 
    global['rateLimiter'] = rateLimiter
}

// OBRIGATÓRIO FICAR APOS O EXPORT GLOBAL (não subir!!!)
function all1() { }; // ******************************************************** NÃO USAR !!!
if (eng) { window['all1'] = all1; } else { global['all1'] = all1 }
// *****************************************************************************************

// NÃO COMENTAR! NECESSÁRIO QUANDO NÃO FOR 'Chrome_Extension'
if (!(eng ? window.all2 : global.all2)) { await import('./@export.js'); }

