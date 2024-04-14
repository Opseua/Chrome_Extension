// await new Promise(resolve => { setTimeout(resolve, 2000) })

// process.exit();

// for (let [index, value] of array.entries()) {
//     console.log('INDEX', index, 'VALUE', value);
// }; console.log('FIM');

// // ## LOG ## retApi
// let errMsg = `$ [leadChangeStatus] LOG retApi`
// infLog = {'e':e, 'folder': 'Registros', 'path': `${errMsg}.txt`, 'text': retApi }
// retLog = await log(infLog);

// LOOP DE REPETIÇÃO
// setInterval(() => {
//     console.log('OK');
//   }, 2000);

// ESPERAR E MOSTRAR UMA VEZ (timeout)
// setTimeout(() => {
//     console.log('OK');
// }, 2000);

// let timeout = setTimeout(() => {
//     console.log('OK');
// }, 2000);
// clearTimeout(timeout);

// let data = 'CASAMENTO'
// // QUALQUER → BASE64
// let qualquerParaBase64 = Buffer.from(data).toString('base64')
// console.log(`qualquerParaBase64 ${qualquerParaBase64}`)
// // BASE64 → UTF8
// let base64ParaUtf8 = Buffer.from(qualquerParaBase64, 'base64').toString('utf8')
// console.log(`base64ParaUtf8 ${base64ParaUtf8}`)

// cd /d D:\ARQUIVOS\PROJETOS\URA_Reversa

// [1] CHROME [c] | [2] NODEJS [n] | [3] GOOGLE [g]  
let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2;

let _fs, _path, _cheerio, _clipboard, _WebSocket, _http, _exec, _google, _crypto, _puppeteer, _net, _util, _getFolderSize, _parse, cs

if (cng == 1) { // CHROME
    window['eng'] = true; window['engName'] = 'CHROME'; window['cng'] = 1; window['letter'] = 'x'; window['catchGlobal'] = false; window['globalWindow'] = {};
} else { // NDEJS
    global['eng'] = false; global['engName'] = 'NODEJS'; global['cng'] = 2; global['letter'] = 'x'; global['catchGlobal'] = false; global['globalWindow'] = {};
    _fs = await import('fs'); global['_fs'] = _fs;
}

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
await import('./getPath.js'); let retGetPath; retGetPath = await getPath({ 'e': new Error(), 'isFunction': true, }); let conf = retGetPath.res.confOk.webSocket;

let securityPass = `${conf.securityPass}`;
let serverWeb = conf.server['1']; let hostWeb = `${serverWeb.host}`; let portWeb = `${serverWeb.port}`; let hostRoomWeb = `${hostWeb}:${portWeb}`
let serverLoc = conf.server['2']; let hostLoc = `${serverLoc.host}`; let portLoc = `${serverLoc.port}`; let hostRoomLoc = `${hostLoc}:${portLoc}`;

let secConnect = conf.secConnect; let secReconnect = conf.secReconnect; let secRetWebSocket = conf.secRetWebSocket; let secPing = conf.secPing;
let secPingTimeout = conf.secPingTimeout; let secLoop = conf.secLoop; let kbPartsMessage = conf.kbPartsMessage; let minClearPartsMessages = conf.minClearPartsMessages;

let par1 = `${securityPass}-${conf.par1}`; let par2 = `${conf.par2}`; let par3 = `${securityPass}-${conf.par3}`; let par4 = `${securityPass}-${conf.par4}`;
let par5 = `${securityPass}-${conf.par5}`; let par6 = `${conf.par6}`; let par7 = `${conf.par7}`; let par8 = `${securityPass}-${conf.par8}`;
let par9 = `${securityPass}-${conf.par9}`; let par10 = `${securityPass}-${conf.par10}`

let devices = conf.devices; let devMaster = `${devices[0].master}`; let sheetServer = conf.sheetServer
// CHROME | Send → NodeJS | Get → Chrome ##### NODEJS | Send → Chrome | Get → NodeJS
let devSend = `${letter == 'D' ? hostRoomLoc : hostRoomWeb}/${devMaster}`; devSend = `${devSend}_${devices[eng ? 2 : 1].name}`

// MANTER APÓS O 'devSend'
globalWindow = {
    ...globalWindow,
    'securityPass': securityPass, 'serverWeb': serverWeb.host, 'portWeb': portWeb, 'portLoc': portLoc, 'devMaster': devMaster, 'devSend': devSend,

    'hostRoomWeb': hostRoomWeb, 'hostRoomLoc': hostRoomLoc, 'secConnect': secConnect, 'secReconnect': secReconnect, 'secRetWebSocket': secRetWebSocket,
    'secPing': secPing, 'secPingTimeout': secPingTimeout, 'secLoop': secLoop, 'kbPartsMessage': kbPartsMessage, 'minClearPartsMessages': minClearPartsMessages,

    'par1': par1, 'par2': par2, 'par3': par3, 'par4': par4, 'par5': par5, 'par6': par6, 'par7': par7, 'par8': par8, 'par9': par9, 'par10': par10, 'sheetServer': sheetServer,
}
// console.log('1', '-', globalWindow.conf, '|', letter, '|', globalWindow.root, '| functions →', globalWindow.functions, '| devMaster →', globalWindow.devMaster, '| project →', globalWindow.project, '| devSlave →', globalWindow.devSlave)

if (eng) { // CHROME
    _WebSocket = window.WebSocket
} else { // NODEJS
    _path = await import('path'); _cheerio = await import('cheerio'); const { default: WebSocket } = await import('ws'); _WebSocket = WebSocket;
    const { default: clipboard } = await import('clipboardy'); _clipboard = clipboard; const { default: http } = await import('http'); _http = http;
    const { exec } = await import('child_process'); _exec = exec; const { google } = await import('googleapis'); _google = google
    const { createHash } = await import('crypto'); _crypto = createHash; _puppeteer = await import('puppeteer'); _net = await import('net');
    _util = await import('util'); const { default: getFolderSize } = await import('get-folder-size'); _getFolderSize = getFolderSize
    const { parse } = await import('url'); _parse = parse;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ############### GLOBAL OBJECT ###############
// gOList(async function () { console.log('globalObject [import] ALTERADO →', gO.inf) })
// gO.inf['NovaChave'] = { 'a': 'b' }; gO.inf['NovaChave'] = ['a', 'b', 'c',]; console.log(gO.inf)

let gOListener = []; let gOObj = {}; function gOList(listener) { gOListener.push(listener) }
function notificarListeners(prop, value) { if (gO.inf.alert) { console.log('globalObject [export] ALTERADO →', gO.inf) }; for (let listener of gOListener) { listener(prop, value); } };
let gO = new Proxy(gOObj, { set(target, prop, value) { target[prop] = value; notificarListeners(prop, value); return true; } }); gO.inf = {}

// let cs = await configStorage([''])
// console.log(cs)

// ############### GLOBAL OBJECT [SNIFFER CHROME] ###############
let data = { inf: '' }; let listenersGoSniffer = new Set();
let gOSniffer = new Proxy(data, { set(target, key, value) { target[key] = value; globalChanged(value); listenersGoSniffer.forEach(listener => listener(target)); return true } });
function gOAddSniffer(listener) { listenersGoSniffer.add(listener) }; function gORemSniffer(listener) { listenersGoSniffer.delete(listener) }
async function globalChanged(i) { if (i.alert !== false) { console.log('globalObject ALTERADO →', i) } }

// ############### RATE LIMIT ###############
// let rate = rateLimiter({ 'max': 3, 'sec': 5 }); function testRate() { console.log(rate.check()); console.log(rate.check()); console.log(rate.check()); console.log(rate.check()) }; testRate();

function rateLimiter(inf) {
    let max = inf.max; let sec = inf.sec * 1000; let old = []; function check() {
        let now = Date.now(); let recent = old.filter(timestamp => timestamp >= now - sec); if (recent.length < max) { old.push(now); return true; } else { return false }
    }; return { check };
}

// ############### LISTENER ###############
let listeners = {}; function listenerMonitorar(nomeList, callback) { if (!listeners[nomeList]) { listeners[nomeList] = []; } listeners[nomeList].push(callback); }
async function listenerAcionar(nomeList, inf, callback) {
    if (listeners[nomeList]) { for (let callFun of listeners[nomeList]) { let response = await callFun(nomeList, inf); if (callback) { callback(response); } return response; } }
}

// listenerMonitorar('TESTE1', async (nomeList, inf) => {
//     console.log('ACIONADO:', nomeList, '→', inf);
//     return 'retorno do listener';
// }); let retListenerAcionar = await listenerAcionar('TESTE1', { 'a': 'a', 'b': 'b' }); console.log(retListenerAcionar);

// ############### AWAIT TIMEOUT ###############
function awaitTimeout(inf) {
    return new Promise((resolve) => {
        let timeout; listenerMonitorar(inf.listenerName, async (nomeList, param1) => { clearTimeout(timeout); resolve({ 'ret': true, 'msg': 'TIMEOUT_FOI_LIMPO', 'res': param1, }); });
        timeout = setTimeout(() => { resolve({ 'ret': false, 'msg': 'TIMEOUT_EXPIROU' }); }, inf.secondsAwait * 1000);
    });
}

// async function run() {  console.log('INICIO'); let retAwaitTimeout = await awaitTimeout({ 'secondsAwait': 5, 'listenerName': 'NOME AQUI' }); console.log(retAwaitTimeout); }; run();
// async function liberarTimeout() { setTimeout(() => { listenerAcionar('NOME AQUI', 'INF1', 'INF2'); }, 2000);}; liberarTimeout();

// ############### CLEAR CONSOLE ###############
function clearConsoleRun() { /* CHROME | ANTIGO | NOVO */ if (eng) { console.clear(); } else { process.stdout.write('\u001b[2J\u001b[0;0H'); process.stdout.write('\x1Bc'); } };
let msgQtd = 0; let clearConsole = console.log; console.log = function () {
    clearConsole.apply(console, arguments); msgQtd++; if (msgQtd >= 30) { clearConsoleRun(); msgQtd = 0; console.log('CONSOLE LIMPO!\n') }
}; clearConsoleRun();

// // ###############               ###############

if (eng) { // CHROME
    // ## BIBLIOTECAS / NATIVO
    window['_WebSocket'] = _WebSocket;
    // ## VARIÁVEIS
    window['cs'] = cs;
    // ## GLOBAL OBJECT
    window['gO'] = gO; window['gOList'] = gOList;
    // ## GLOBAL OBJECT [SNIFFER CHROME]
    window['gOSniffer'] = gOSniffer; window['gOAddSniffer'] = gOAddSniffer; window['gORemSniffer'] = gORemSniffer;
    // ## LISTENER
    window['listenerMonitorar'] = listenerMonitorar; window['listenerAcionar'] = listenerAcionar;
    // ## FUNÇÕES
    window['rateLimiter'] = rateLimiter; window['awaitTimeout'] = awaitTimeout;
} else { // NODEJS
    // ## BIBLIOTECAS / NATIVO
    const { WebSocketServer } = await import('ws'); global['_WebSocketServer'] = WebSocketServer; // SERVER WEBSOCKET [EC2] (não subir!!!)
    global['_WebSocket'] = _WebSocket; global['_fs'] = _fs; global['_path'] = _path; global['_cheerio'] = _cheerio; global['_clipboard'] = _clipboard;
    global['_http'] = _http; global['_exec'] = _exec; global['_google'] = _google; global['_crypto'] = _crypto; global['_puppeteer'] = _puppeteer; global['_net'] = _net;
    global['_util'] = _util; global['_getFolderSize'] = _getFolderSize; global['_parse'] = _parse;
    // ## VARIÁVEIS
    global['cs'] = cs;
    // ## GLOBAL OBJECT [NOVO]
    global['gO'] = gO; global['gOList'] = gOList;
    // ## GLOBAL OBJECT [SNIFFER CHROME]
    global['gOSniffer'] = gOSniffer; global['gOAddSniffer'] = gOAddSniffer; global['gORemSniffer'] = gORemSniffer;
    // ## LISTENER
    global['listenerMonitorar'] = listenerMonitorar; global['listenerAcionar'] = listenerAcionar;
    // ## FUNÇÕES
    global['rateLimiter'] = rateLimiter; global['awaitTimeout'] = awaitTimeout;
}

// OBRIGATÓRIO FICAR APOS O EXPORT GLOBAL (não subir!!!)
function all1() { }; // ******************************************************** NÃO USAR !!!
if (eng) { window['all1'] = all1; } else { global['all1'] = all1 }
// *****************************************************************************************

// NÃO COMENTAR! NECESSÁRIO QUANDO NÃO FOR 'Chrome_Extension'
if (!(eng ? window.all2 : global.all2)) { await import('./@export.js'); }


// javascript: (function () {
//     function pw(j, pw, ph, u) {
//         let w = (pw / 100) * j.top.screen.width, h = (ph / 100) * j.top.screen.height; let y = j.top.outerHeight / 2 + j.top.screenY - (h / 2)
//         let x = j.top.outerWidth / 2 + j.top.screenX - (w / 2); return j.open(u, '', `width = ${ w }, height = ${ h }, top = ${ y }, left = ${ x } `);
//     }; pw(window, 40, 40, 'http://12.345.678.910:1234');
// })();


// ### Chrome
// 1 - src/config.json | D | chrome-extension | functions → afelhdjampgfmchfcnbginicjcmjhhma | devMaster → OPSEUA | project → Downloads/Google Chrome% | devSlave → NAO_DEFINIDO
// 2 - src/config.json | D | chrome-extension | functions → afelhdjampgfmchfcnbginicjcmjhhma | devMaster → OPSEUA | project → Downloads/Google Chrome% | devSlave → CHROME

// ### NodeJS
// 1 - src/config.json | D | ARQUIVOS/PROJETOS | functions → Chrome_Extension | devMaster → OPSEUA | project → NAO_DEFINIDO | devSlave → NAO_DEFINIDO
// 2 - src/config.json | D | ARQUIVOS/PROJETOS | functions → Chrome_Extension | devMaster → OPSEUA | project → Chrome_Extension | devSlave → NODEJS
// 2 - src/config.json | D | ARQUIVOS/PROJETOS | functions → Chrome_Extension | devMaster → OPSEUA | project → WebSocket | devSlave → NODEJS
// 2 - src/config.json | D | ARQUIVOS/PROJETOS | functions → Chrome_Extension | devMaster → OPSEUA | project → Sniffer_Python | devSlave → SNIFFER
// 2 - src/config.json | D | ARQUIVOS/PROJETOS | functions → Chrome_Extension | devMaster → OPSEUA | project → URA_Reversa | devSlave → NAO_DEFINIDO
// 2 - src/config.json | D | ARQUIVOS/PROJETOS | functions → Chrome_Extension | devMaster → OPSEUA | project → WebScraper | devSlave → NAO_DEFINIDO

// "src/config.json"                                       → globalWindow.conf
// "D"                                                     → letter
// "chrome-extension" | "ARQUIVOS/PROJETOS"                → globalWindow.root
// "afelhdjampgfmchfcnbginicjcmjhhma" | "Chrome_Extension" → globalWindow.functions
// "OPSEUA"                                                → globalWindow.devMaster
// "Downloads/Google Chrome%" | "Sniffer_Python"           → globalWindow.project
// "SNIFFER"                                               → globalWindow.devSlave

// → CONF ANTIGA [Chrome] | [NodeJS]
// [
//     'src/config.json',
//     'D',
//     'chrome-extension://afelhdjampgfmchfcnbginicjcmjhhma' | 'ARQUIVOS/PROJETOS/Chrome_Extension',
//     'Downloads/Google Chrome%' | 'ARQUIVOS/PROJETOS/Sniffer_Python',
//     'src/server.js',
//     58,
//     'Chrome_Extension' | 'Sniffer_Python',
// ]

